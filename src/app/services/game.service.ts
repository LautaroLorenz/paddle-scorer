import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { Game } from '../models/game.model';
import { Player, PlayerIndex } from '../models/player.model';
import { Score } from '../models/score.model';
import { Team, TeamIndex } from '../models/team.model';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class GameService {
    private game = new ReplaySubject<Game>(1);
    private gameEnd = new Subject<Game>();
    private initialStatus: Game | undefined;

    constructor(private router: Router) {
        this.loadGameStatusFromStorage();
    }

    get game$(): Observable<Game> {
        return this.game.asObservable();
    }

    get gameEnd$(): Observable<Game> {
        return this.gameEnd.asObservable();
    }

    setGamePlayerAt(teamIndex: TeamIndex, playerIndex: PlayerIndex, player: Player): void {
        const newGameStatus = { ...this.getGameStatus() };
        for (let i = 0; i < newGameStatus.teams.length; i++) {
            const team = newGameStatus.teams[i];
            for (let f = 0; f < team.players.length; f++) {
                const splotPlayer = team.players[f];
                if (splotPlayer?.id === player?.id) {
                    team.players[f] = undefined;
                }
            }
        }
        newGameStatus.teams[teamIndex].players[playerIndex] = player;
        this.saveGameStatusOnStorage(newGameStatus, 'append');
    }

    initGame(participants: Player[], goalScore: Score): void {
        this.initialStatus = {
            participants,
            goalScore,
            isGoldenPoint: false,
            teams: [
                {
                    players: [participants[0] ?? undefined, participants[1] ?? undefined],
                    score: {
                        points: 0,
                        sets: 0,
                        counter: 0
                    }
                },
                {
                    players: [participants[2] ?? undefined, participants[3] ?? undefined],
                    score: {
                        points: 0,
                        sets: 0,
                        counter: 0
                    }
                }
            ],
            winnerTeamIndex: null
        };
        this.saveGameStatusOnStorage(this.initialStatus, 'override');
    }

    incrementScoreAt(teamIndexToIncrement: TeamIndex, mode: 'counter' | 'point' | 'set'): void {
        const gameStatus = this.getGameStatus();
        let winnerTeamIndex: TeamIndex | null = null;
        let newGameStatus: Game = { ...gameStatus };
        let newScores: [Score, Score] = [newGameStatus.teams[0].score, newGameStatus.teams[1].score];
        const scoreToIncrement = newScores[teamIndexToIncrement];

        switch (mode) {
            case 'counter':
                switch (scoreToIncrement.counter) {
                    case 0:
                        scoreToIncrement.counter = 15;
                        break;
                    case 15:
                        scoreToIncrement.counter = 30;
                        break;
                    case 30:
                        scoreToIncrement.counter = 40;
                        break;
                    case 40:
                        return this.incrementScoreAt(teamIndexToIncrement, 'point');
                }
                break;
            case 'point':
                newScores[0].counter = 0;
                newScores[1].counter = 0;
                scoreToIncrement.points = scoreToIncrement.points + 1;
                if (scoreToIncrement.points === gameStatus.goalScore.points) {
                    return this.incrementScoreAt(teamIndexToIncrement, 'set');
                }
                break;
            case 'set':
                newScores[0].counter = 0;
                newScores[1].counter = 0;
                newScores[0].points = 0;
                newScores[1].points = 0;
                scoreToIncrement.sets = scoreToIncrement.sets + 1;
                if (scoreToIncrement.sets === gameStatus.goalScore.sets) {
                    newScores[0].sets = 0;
                    newScores[1].sets = 0;
                    winnerTeamIndex = teamIndexToIncrement;
                }
                break;
        }

        newGameStatus = {
            ...newGameStatus,
            teams: newGameStatus.teams.map((team, index) => ({
                ...team,
                score: {
                    ...newScores[index]
                }
            })) as [Team, Team],
            isGoldenPoint: this.isGoldenPoint(newGameStatus),
            winnerTeamIndex
        };
        this.saveGameStatusOnStorage(newGameStatus, 'append');

        if (winnerTeamIndex !== null) {
            this.gameEnd.next(newGameStatus);
        }
    }

    undoGameStatus(): void {
        const gameHistory: Game[] = this.getGameStatusHistoryFromStorage();
        if (gameHistory.length === 1) {
            return;
        }
        const newGameHistory = gameHistory.slice(0, -1);
        this.setGameStatusHistory(newGameHistory);
    }

    restartScore(): void {
        const emptyScore: Score = {
            counter: 0,
            points: 0,
            sets: 0
        };
        const newEmptyScores: [Score, Score] = [{ ...emptyScore }, { ...emptyScore }];
        const gameStatus = this.getGameStatus();
        const newGameStatus: Game = {
            ...gameStatus,
            teams: gameStatus.teams.map((team, index) => ({
                ...team,
                score: { ...newEmptyScores[index] }
            })) as [Team, Team],
            winnerTeamIndex: null
        };
        this.saveGameStatusOnStorage(newGameStatus, 'append');
    }

    setNextPlayers(): void {
        const gameHistory: Game[] = this.getGameStatusHistoryFromStorage();
        const endGameHistory: Game[] = gameHistory.filter(({ winnerTeamIndex }) => winnerTeamIndex !== null);
        const { participants } = endGameHistory.slice(-1)[0];

        const timesPlayedPerPlayer: Record<number, number> = {};
        const timesWinnedPerPlayer: Record<number, number> = {};
        for (let index = 0; index < participants.length; index++) {
            const player = participants[index];
            timesPlayedPerPlayer[player.id] = endGameHistory.filter(
                ({ teams: [team1, team2] }) =>
                    team1.players[0]?.id === player.id ||
                    team1.players[1]?.id === player.id ||
                    team2.players[0]?.id === player.id ||
                    team2.players[1]?.id === player.id
            ).length;
            timesWinnedPerPlayer[player.id] = endGameHistory.filter(
                ({ teams, winnerTeamIndex }) =>
                    teams[winnerTeamIndex!].players[0]?.id === player.id ||
                    teams[winnerTeamIndex!].players[1]?.id === player.id
            ).length;
        }

        const nextPlayers = participants.sort((playerA, playerB) => {
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

        nextPlayers[0] && this.setGamePlayerAt(0, 0, nextPlayers[0]);
        nextPlayers[1] && this.setGamePlayerAt(0, 1, nextPlayers[1]);
        nextPlayers[2] && this.setGamePlayerAt(1, 0, nextPlayers[2]);
        nextPlayers[3] && this.setGamePlayerAt(1, 1, nextPlayers[3]);
    }

    private isGoldenPoint(game: Game): boolean {
        return game.teams[0].score.counter === 40 && game.teams[1].score.counter === 40;
    }

    private getGameStatus(): Game {
        const gameHistory = this.getGameStatusHistoryFromStorage();
        const gameStatus = gameHistory.slice(-1)[0];
        if (!gameStatus) {
            if (this.initialStatus) {
                return { ...this.initialStatus };
            }
            // estado no recuperable
            this.router.navigate(['home']);
        }
        return gameStatus;
    }

    private saveGameStatusOnStorage(gameStatus: Game, mode: 'append' | 'override'): void {
        let newGameHistory: Game[] = [];
        if (mode === 'override') {
            newGameHistory = [gameStatus];
        }
        if (mode === 'append') {
            const gameHistory: Game[] = this.getGameStatusHistoryFromStorage();
            newGameHistory = gameHistory.concat(gameStatus);
        }
        this.setGameStatusHistory(newGameHistory);
    }

    private loadGameStatusFromStorage(): void {
        const gameHistory: Game[] = this.getGameStatusHistoryFromStorage();
        this.game.next(gameHistory[gameHistory.length - 1]);
    }

    private getGameStatusHistoryFromStorage(): Game[] {
        const history = localStorage.getItem('gameHistory');
        if (history) {
            return JSON.parse(history);
        }
        return [];
    }

    private setGameStatusHistory(gameHistory: Game[]): void {
        localStorage.setItem('gameHistory', JSON.stringify(gameHistory));
        this.game.next(gameHistory[gameHistory.length - 1]);
    }
}
