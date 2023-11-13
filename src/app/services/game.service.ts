import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { DEFAULT_GAME, Game, GameSnapshotStatus } from '../models/game.model';
import { Player, PlayerIndex, RequiredPlayers } from '../models/player.model';
import { TeamIndex } from '../models/team.model';
import { Snapshot } from '../core/snapshot.core';
import { GoalScore } from '../models/goal-score.model';
import { GameStatsService } from './game-stats.service';
import { PLAYER_POSITIONS, PlayerPosition } from '../models/player-position.model';
import { TeamsSettings } from '../models/game-settings.model';

@Injectable({
    providedIn: 'root'
})
export class GameService {
    private game = new ReplaySubject<Game>(1);
    private gameEnd = new Subject<Game>();
    private snapshot: Snapshot<Game>;

    constructor(private gameStatsService: GameStatsService) {
        const gameSnapshotStatus = new GameSnapshotStatus();
        this.snapshot = new Snapshot(gameSnapshotStatus);
    }

    get game$(): Observable<Game> {
        return this.game.asObservable();
    }

    get gameEnd$(): Observable<Game> {
        return this.gameEnd.asObservable();
    }

    initGame(players: RequiredPlayers, teamsSettings: TeamsSettings): void {
        const game: Game = DEFAULT_GAME(players, [teamsSettings.colorTeam1, teamsSettings.colorTeam2]);
        this.game.next(game);
        this.snapshot.clearHistory();
        this.snapshot.generate(game);
    }

    setPlayerAt(playerPosition: PlayerPosition, playerToSet: Player): void {
        const { teamIndex: teamIndexToSet, playerIndex: playerIndexToSet } = playerPosition;
        const gameSnapshot: Game = this.snapshot.get();
        let teamIndexAux: TeamIndex | null = null,
            playerIndexAux: PlayerIndex | null = null,
            playerAux: Player;
        for (let teamIndex = 0; teamIndex < gameSnapshot.teams.length; teamIndex++) {
            const team = gameSnapshot.teams[teamIndex];
            for (let playerIndex = 0; playerIndex < team.players.length; playerIndex++) {
                const player = team.players[playerIndex];
                if (player.id === playerToSet.id) {
                    teamIndexAux = teamIndex as TeamIndex;
                    playerIndexAux = playerIndex as PlayerIndex;
                }
            }
        }
        playerAux = gameSnapshot.teams[teamIndexToSet].players[playerIndexToSet];
        gameSnapshot.teams[teamIndexToSet].players[playerIndexToSet] = playerToSet;
        if (teamIndexAux !== null && playerIndexAux !== null) {
            gameSnapshot.teams[teamIndexAux].players[playerIndexAux] = playerAux;
        }
        this.game.next(gameSnapshot);
        this.snapshot.generate(gameSnapshot);
    }

    setPlayers(participants: Player[], lockWinnerTeam: boolean): void {
        const endGames: Game[] = this.snapshot.history.filter(({ winnerTeamIndex }) => winnerTeamIndex !== null);
        const { timesPlayedPerPlayer, timesWinnedPerPlayer } = this.gameStatsService.getStats(endGames, participants);

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

        PLAYER_POSITIONS.forEach((position, index) => {
            this.setPlayerAt(position, nextPlayers[index]);
        });
    }

    incrementScoreAt(goalScore: GoalScore, teamIndexToIncrement: TeamIndex, mode: 'counter' | 'point' | 'set'): void {
        const gameSnapshot = this.snapshot.get();
        gameSnapshot.winnerTeamIndex = null;
        switch (mode) {
            case 'counter':
                switch (gameSnapshot.teams[teamIndexToIncrement].score.counter) {
                    case 0:
                        gameSnapshot.teams[teamIndexToIncrement].score.counter = 15;
                        break;
                    case 15:
                        gameSnapshot.teams[teamIndexToIncrement].score.counter = 30;
                        break;
                    case 30:
                        gameSnapshot.teams[teamIndexToIncrement].score.counter = 40;
                        break;
                    case 40:
                        return this.incrementScoreAt(goalScore, teamIndexToIncrement, 'point');
                }
                break;
            case 'point':
                gameSnapshot.teams[0].score.counter = 0;
                gameSnapshot.teams[1].score.counter = 0;
                gameSnapshot.teams[teamIndexToIncrement].score.points =
                    gameSnapshot.teams[teamIndexToIncrement].score.points + 1;
                if (gameSnapshot.teams[teamIndexToIncrement].score.points === goalScore.points) {
                    return this.incrementScoreAt(goalScore, teamIndexToIncrement, 'set');
                }
                break;
            case 'set':
                gameSnapshot.teams[0].score.counter = 0;
                gameSnapshot.teams[1].score.counter = 0;
                gameSnapshot.teams[0].score.points = 0;
                gameSnapshot.teams[1].score.points = 0;
                gameSnapshot.teams[teamIndexToIncrement].score.sets =
                    gameSnapshot.teams[teamIndexToIncrement].score.sets + 1;
                if (gameSnapshot.teams[teamIndexToIncrement].score.sets === goalScore.sets) {
                    gameSnapshot.teams[0].score.sets = 0;
                    gameSnapshot.teams[1].score.sets = 0;
                    gameSnapshot.winnerTeamIndex = teamIndexToIncrement;
                }
                break;
        }

        gameSnapshot.isGoldenPoint = this.isGoldenPoint(gameSnapshot);
        this.game.next(gameSnapshot);
        this.snapshot.generate(gameSnapshot);
        if (gameSnapshot.winnerTeamIndex !== null) {
            this.gameEnd.next(gameSnapshot);
        }
    }

    undo(): void {
        const gameSnapshot: Game = this.snapshot.undo();
        this.game.next(gameSnapshot);
    }

    restartScore(): void {
        const gameSnapshot = this.snapshot.get();
        const [team1, team2] = gameSnapshot.teams;
        const [player1, player2] = team1.players;
        const [player3, player4] = team2.players;
        const game = DEFAULT_GAME([player1, player2, player3, player4], [team1.color, team2.color]);
        this.game.next(game);
        this.snapshot.generate(game);
    }

    private isGoldenPoint(game: Game): boolean {
        return game.teams[0].score.counter === 40 && game.teams[1].score.counter === 40;
    }
}
