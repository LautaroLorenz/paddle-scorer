import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { DEFAULT_GAME, Game } from '../models/game.model';
import { Player, PlayerIndex, Players } from '../models/player.model';
import { TeamIndex } from '../models/team.model';
import { Snapshot } from '../core/snapshot.core';
import { GoalScore } from '../models/goal-score.model';

@Injectable({
    providedIn: 'root'
})
export class GameService {
    private game = new ReplaySubject<Game>(1);
    private gameEnd = new Subject<Game>();
    private snapshot: Snapshot<Game>;

    constructor() {
        this.snapshot = new Snapshot();
    }

    get game$(): Observable<Game> {
        return this.game.asObservable();
    }

    get gameEnd$(): Observable<Game> {
        return this.gameEnd.asObservable();
    }

    initGame(players: Players): void {
        const game: Game = DEFAULT_GAME(players);
        this.game.next(game);
        this.snapshot.clearHistory();
        this.snapshot.generate(game);
    }

    setPlayerAt(teamIndexToSet: TeamIndex, playerIndexToSet: PlayerIndex, playerToSet: Player): void {
        const gameSnapshot: Game | null = this.snapshot.get();
        if (!gameSnapshot) {
            return;
        }

        const gameCopy = this.copy(gameSnapshot);
        let teamIndexAux: TeamIndex | null = null,
            playerIndexAux: PlayerIndex | null = null,
            playerAux: Player;
        for (let teamIndex = 0; teamIndex < gameCopy.teams.length; teamIndex++) {
            const team = gameCopy.teams[teamIndex];
            for (let playerIndex = 0; playerIndex < team.players.length; playerIndex++) {
                const player = team.players[playerIndex];
                if (player.id === playerToSet.id) {
                    teamIndexAux = teamIndex as TeamIndex;
                    playerIndexAux = playerIndex as PlayerIndex;
                }
            }
        }
        playerAux = gameCopy.teams[teamIndexToSet].players[playerIndexToSet];
        gameCopy.teams[teamIndexToSet].players[playerIndexToSet] = playerToSet;
        if (teamIndexAux !== null && playerIndexAux !== null) {
            gameCopy.teams[teamIndexAux].players[playerIndexAux] = playerAux;
        }
        this.game.next(gameCopy);
        this.snapshot.generate(gameCopy);
    }

    setPlayers(participants: Player[]): void {
        const endGames: Game[] = this.snapshot.history.filter(({ winnerTeamIndex }) => winnerTeamIndex !== null);
        const timesPlayedPerPlayer: Record<number, number> = {};
        const timesWinnedPerPlayer: Record<number, number> = {};
        for (let index = 0; index < participants.length; index++) {
            const player = participants[index];
            timesPlayedPerPlayer[player.id] = endGames.filter(
                ({ teams: [team1, team2] }) =>
                    team1.players[0]?.id === player.id ||
                    team1.players[1]?.id === player.id ||
                    team2.players[0]?.id === player.id ||
                    team2.players[1]?.id === player.id
            ).length;
            timesWinnedPerPlayer[player.id] = endGames.filter(
                ({ teams, winnerTeamIndex }) =>
                    teams[winnerTeamIndex!].players[0]?.id === player.id ||
                    teams[winnerTeamIndex!].players[1]?.id === player.id
            ).length;
        }

        const participantsCopy: Player[] = [...participants];
        const nextPlayers = participantsCopy.sort((playerA, playerB) => {
            // Prioridad para quien menos jugó
            if (timesPlayedPerPlayer[playerA.id] > timesPlayedPerPlayer[playerB.id]) {
                return 1;
            }
            if (timesPlayedPerPlayer[playerA.id] < timesPlayedPerPlayer[playerB.id]) {
                return -1;
            }

            // Prioridad para quien más ganó
            if (timesWinnedPerPlayer[playerA.id] < timesWinnedPerPlayer[playerB.id]) {
                return 1;
            }
            if (timesWinnedPerPlayer[playerA.id] > timesWinnedPerPlayer[playerB.id]) {
                return -1;
            }

            return 0;
        });

        nextPlayers[0] && this.setPlayerAt(0, 0, nextPlayers[0]);
        nextPlayers[1] && this.setPlayerAt(0, 1, nextPlayers[1]);
        nextPlayers[2] && this.setPlayerAt(1, 0, nextPlayers[2]);
        nextPlayers[3] && this.setPlayerAt(1, 1, nextPlayers[3]);
    }

    incrementScoreAt(goalScore: GoalScore, teamIndexToIncrement: TeamIndex, mode: 'counter' | 'point' | 'set'): void {
        const gameSnapshot = this.snapshot.get();
        if (!gameSnapshot) {
            return;
        }

        const gameCopy = this.copy(gameSnapshot);
        gameCopy.winnerTeamIndex = null;
        switch (mode) {
            case 'counter':
                switch (gameCopy.teams[teamIndexToIncrement].score.counter) {
                    case 0:
                        gameCopy.teams[teamIndexToIncrement].score.counter = 15;
                        break;
                    case 15:
                        gameCopy.teams[teamIndexToIncrement].score.counter = 30;
                        break;
                    case 30:
                        gameCopy.teams[teamIndexToIncrement].score.counter = 40;
                        break;
                    case 40:
                        return this.incrementScoreAt(goalScore, teamIndexToIncrement, 'point');
                }
                break;
            case 'point':
                gameCopy.teams[0].score.counter = 0;
                gameCopy.teams[1].score.counter = 0;
                gameCopy.teams[teamIndexToIncrement].score.points =
                    gameCopy.teams[teamIndexToIncrement].score.points + 1;
                if (gameCopy.teams[teamIndexToIncrement].score.points === goalScore.points) {
                    return this.incrementScoreAt(goalScore, teamIndexToIncrement, 'set');
                }
                break;
            case 'set':
                gameCopy.teams[0].score.counter = 0;
                gameCopy.teams[1].score.counter = 0;
                gameCopy.teams[0].score.points = 0;
                gameCopy.teams[1].score.points = 0;
                gameCopy.teams[teamIndexToIncrement].score.sets = gameCopy.teams[teamIndexToIncrement].score.sets + 1;
                if (gameCopy.teams[teamIndexToIncrement].score.sets === goalScore.sets) {
                    gameCopy.teams[0].score.sets = 0;
                    gameCopy.teams[1].score.sets = 0;
                    gameCopy.winnerTeamIndex = teamIndexToIncrement;
                }
                break;
        }

        gameCopy.isGoldenPoint = this.isGoldenPoint(gameCopy);
        this.game.next(gameCopy);
        this.snapshot.generate(gameCopy);
        if (gameCopy.winnerTeamIndex !== null) {
            this.gameEnd.next(gameCopy);
        }
    }

    undo(): void {
        const gameSnapshot: Game | null = this.snapshot.undo();
        if (!gameSnapshot) {
            return;
        }
        this.game.next(gameSnapshot);
    }

    restartScore(): void {
        const gameSnapshot = this.snapshot.get();
        if (!gameSnapshot) {
            return;
        }

        const gameCopy = this.copy(gameSnapshot);
        gameCopy.winnerTeamIndex = null;
        gameCopy.teams[0].score.counter = 0;
        gameCopy.teams[0].score.sets = 0;
        gameCopy.teams[0].score.points = 0;
        gameCopy.teams[1].score.counter = 0;
        gameCopy.teams[1].score.sets = 0;
        gameCopy.teams[1].score.points = 0;
        this.game.next(gameCopy);
        this.snapshot.generate(gameCopy);
    }

    private isGoldenPoint(game: Game): boolean {
        return game.teams[0].score.counter === 40 && game.teams[1].score.counter === 40;
    }

    private copy(game: Game): Game {
        const {
            isGoldenPoint,
            winnerTeamIndex,
            teams: [team1, team2]
        } = game;
        const { score: score1, players: players1 } = team1;
        const { score: score2, players: players2 } = team2;

        return {
            isGoldenPoint: isGoldenPoint,
            winnerTeamIndex: winnerTeamIndex,
            teams: [
                {
                    score: {
                        counter: score1.counter,
                        points: score1.points,
                        sets: score1.sets
                    },
                    players: [this.copyPlayer(players1[0]), this.copyPlayer(players1[1])]
                },
                {
                    score: {
                        counter: score2.counter,
                        points: score2.points,
                        sets: score2.sets
                    },
                    players: [this.copyPlayer(players2[0]), this.copyPlayer(players2[1])]
                }
            ]
        };
    }

    private copyPlayer(player: Player): Player {
        return {
            id: player.id,
            color: player.color,
            name: player.name
        };
    }
}
