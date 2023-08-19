import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { Game } from '../models/game.model';
import { Player, PlayerIndex } from '../models/player.model';
import { Score } from '../models/score.model';
import { Team, TeamIndex } from '../models/team.model';
import { EndGame } from '../models/end-game.model';

@Injectable({
    providedIn: 'root'
})
export class GameService {
    private game = new ReplaySubject<Game>(1);
    private endGame = new Subject<EndGame>();

    constructor() {
        this.loadGameFromStorage();
    }

    get game$(): Observable<Game> {
        return this.game.asObservable();
    }

    get endGame$(): Observable<EndGame> {
        return this.endGame.asObservable();
    }

    setGamePlayerAt(gameStatus: Game, teamIndex: TeamIndex, playerIndex: PlayerIndex, player: Player): void {
        const newGameStatus = { ...gameStatus };
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
        this.saveGameOnStorage(newGameStatus, 'append');
    }

    initGame(participants: Player[], goalScore: Score): void {
        const game: Game = {
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
            ]
        };
        this.saveGameOnStorage(game, 'override');
        this.saveEndGameOnStorage(undefined, 'clear');
    }

    incrementScoreAt(gameStatus: Game, teamIndexToIncrement: TeamIndex, mode: 'counter' | 'point' | 'set'): void {
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
                        return this.incrementScoreAt(gameStatus, teamIndexToIncrement, 'point');
                }
                break;
            case 'point':
                newScores[0].counter = 0;
                newScores[1].counter = 0;
                scoreToIncrement.points = scoreToIncrement.points + 1;
                if (scoreToIncrement.points === gameStatus.goalScore.points) {
                    return this.incrementScoreAt(gameStatus, teamIndexToIncrement, 'set');
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
            isGoldenPoint: this.isGoldenPoint(newGameStatus)
        };
        this.saveGameOnStorage(newGameStatus, 'append');

        if (winnerTeamIndex !== null) {
            const newEndGame: EndGame = {
                game: newGameStatus,
                winnerTeamIndex
            };
            this.saveEndGameOnStorage(newEndGame, 'append');
        }
    }

    undoGameStatus(): void {
        const gameHistory: Game[] = this.getGameHistoryFromStorage();
        if (gameHistory.length === 1) {
            return;
        }
        const newGameHistory = gameHistory.slice(0, -1);
        this.setGameHistory(newGameHistory);
    }

    restartScore(): void {
        const emptyScore: Score = {
            counter: 0,
            points: 0,
            sets: 0
        };
        const newScores: [Score, Score] = [{ ...emptyScore }, { ...emptyScore }];
        const gameHistory: Game[] = this.getGameHistoryFromStorage();
        const lastGame = gameHistory[gameHistory.length - 1];
        const newGameStatus = {
            ...lastGame,
            teams: lastGame.teams.map((team, index) => ({
                ...team,
                score: {
                    ...newScores[index]
                }
            })) as [Team, Team]
        };
        this.saveGameOnStorage(newGameStatus, 'append');
    }

    setNextPlayers(gameStatus: Game): void {
        const endGameHistory = this.getEndGameHistoryFromStorage();
        const { game: lastGame } = endGameHistory.slice(-1)[0];

        const timesPlayedPerPlayer: Record<number, number> = {};
        const timesWinnedPerPlayer: Record<number, number> = {};
        for (let index = 0; index < lastGame.participants.length; index++) {
            const player = lastGame.participants[index];
            timesPlayedPerPlayer[player.id] = endGameHistory.filter(
                ({
                    game: {
                        teams: [team1, team2]
                    }
                }) =>
                    team1.players[0]?.id === player.id ||
                    team1.players[1]?.id === player.id ||
                    team2.players[0]?.id === player.id ||
                    team2.players[1]?.id === player.id
            ).length;
            timesWinnedPerPlayer[player.id] = endGameHistory.filter(
                ({ game: { teams }, winnerTeamIndex }) =>
                    teams[winnerTeamIndex].players[0]?.id === player.id ||
                    teams[winnerTeamIndex].players[1]?.id === player.id
            ).length;
        }

        const nextPlayers = lastGame.participants.sort((playerA, playerB) => {
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

        if (nextPlayers[0]) {
            this.setGamePlayerAt(gameStatus, 0, 0, nextPlayers[0]);
        }

        if (nextPlayers[1]) {
            this.setGamePlayerAt(gameStatus, 0, 1, nextPlayers[1]);
        }

        if (nextPlayers[2]) {
            this.setGamePlayerAt(gameStatus, 1, 0, nextPlayers[2]);
        }

        if (nextPlayers[3]) {
            this.setGamePlayerAt(gameStatus, 1, 1, nextPlayers[3]);
        }
    }

    private isGoldenPoint(game: Game): boolean {
        return game.teams[0].score.counter === 40 && game.teams[1].score.counter === 40;
    }

    private saveGameOnStorage(gameStatus: Game, mode: 'append' | 'override'): void {
        let newGameHistory: Game[] = [];
        if (mode === 'override') {
            newGameHistory = [gameStatus];
        }
        if (mode === 'append') {
            const gameHistory: Game[] = this.getGameHistoryFromStorage();
            newGameHistory = gameHistory.concat(gameStatus);
        }
        this.setGameHistory(newGameHistory);
    }

    private loadGameFromStorage(): void {
        const gameHistory: Game[] = this.getGameHistoryFromStorage();
        this.game.next(gameHistory[gameHistory.length - 1]);
    }

    private getGameHistoryFromStorage(): Game[] {
        const history = localStorage.getItem('gameHistory');
        if (history) {
            return JSON.parse(history);
        }
        return [];
    }

    private setGameHistory(gameHistory: Game[]): void {
        localStorage.setItem('gameHistory', JSON.stringify(gameHistory));
        this.game.next(gameHistory[gameHistory.length - 1]);
    }

    private saveEndGameOnStorage(endGameStatus: EndGame | undefined, mode: 'append' | 'clear'): void {
        let newEndGameHistory: EndGame[] = [];
        if (mode === 'clear') {
            newEndGameHistory = [];
        }
        if (mode === 'append' && endGameStatus) {
            const endGameHistory: EndGame[] = this.getEndGameHistoryFromStorage();
            newEndGameHistory = endGameHistory.concat(endGameStatus);
        }
        this.setEndGameHistory(newEndGameHistory);
    }

    private getEndGameHistoryFromStorage(): EndGame[] {
        const history = localStorage.getItem('endGameHistory');
        if (history) {
            return JSON.parse(history);
        }
        return [];
    }

    private setEndGameHistory(endGameHistory: EndGame[]): void {
        localStorage.setItem('endGameHistory', JSON.stringify(endGameHistory));
        this.endGame.next(endGameHistory[endGameHistory.length - 1]);
    }
}
