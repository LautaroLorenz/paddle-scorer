import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
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
    private _isEndGame = new ReplaySubject<EndGame>(1);

    constructor() {
        this.loadGameFromStorage();
    }

    get game$(): Observable<Game> {
        return this.game.asObservable();
    }

    get isEndGame$(): Observable<EndGame> {
        return this._isEndGame.asObservable();
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
                    players: [undefined, undefined],
                    score: {
                        points: 0,
                        sets: 0,
                        counter: 0
                    }
                },
                {
                    players: [undefined, undefined],
                    score: {
                        points: 0,
                        sets: 0,
                        counter: 0
                    }
                }
            ]
        };
        this.saveGameOnStorage(game, 'override');
    }

    incrementCounterAt(gameStatus: Game, teamIndexToIncrement: TeamIndex): void {
        let isPoint = false;
        let newGameStatus: Game = { ...gameStatus };
        let newScores: [Score, Score] = [newGameStatus.teams[0].score, newGameStatus.teams[1].score];

        switch (newScores[teamIndexToIncrement].counter) {
            case 0:
                newScores[teamIndexToIncrement].counter = 15;
                break;
            case 15:
                newScores[teamIndexToIncrement].counter = 30;
                break;
            case 30:
                newScores[teamIndexToIncrement].counter = 40;
                break;
            case 40:
                newScores[0].counter = 0;
                newScores[1].counter = 0;
                isPoint = true;
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
        if (isPoint) {
            this.incrementPointAt(newGameStatus, teamIndexToIncrement);
        } else {
            this.saveGameOnStorage(newGameStatus, 'append');
        }
    }

    incrementPointAt(gameStatus: Game, teamIndexToIncrement: TeamIndex): void {
        let isSet = false;
        let newGameStatus: Game = { ...gameStatus };
        let newScores: [Score, Score] = [newGameStatus.teams[0].score, newGameStatus.teams[1].score];

        newScores[0].counter = 0;
        newScores[1].counter = 0;
        newScores[teamIndexToIncrement].points = newScores[teamIndexToIncrement].points + 1;
        if (newScores[teamIndexToIncrement].points === gameStatus.goalScore.points) {
            newScores[0].points = 0;
            newScores[1].points = 0;
            isSet = true;
        }
        newGameStatus = {
            ...newGameStatus,
            teams: newGameStatus.teams.map((team, index) => ({
                ...team,
                score: {
                    ...newScores[index]
                }
            })) as [Team, Team]
        };
        if (isSet) {
            this.incrementSetAt(newGameStatus, teamIndexToIncrement);
        } else {
            this.saveGameOnStorage(newGameStatus, 'append');
        }
    }

    incrementSetAt(gameStatus: Game, teamIndexToIncrement: TeamIndex): void {
        let winnerTeamIndex: TeamIndex | null = null;
        let newGameStatus: Game = { ...gameStatus };
        let newScores: [Score, Score] = [newGameStatus.teams[0].score, newGameStatus.teams[1].score];

        newScores[0].counter = 0;
        newScores[1].counter = 0;
        newScores[0].points = 0;
        newScores[1].points = 0;
        newScores[teamIndexToIncrement].sets = newScores[teamIndexToIncrement].sets + 1;
        if (newScores[teamIndexToIncrement].sets === gameStatus.goalScore.sets) {
            newScores[0].sets = 0;
            newScores[1].sets = 0;
            winnerTeamIndex = teamIndexToIncrement;
        }
        newGameStatus = {
            ...newGameStatus,
            teams: newGameStatus.teams.map((team, index) => ({
                ...team,
                score: {
                    ...newScores[index]
                }
            })) as [Team, Team]
        };
        if (winnerTeamIndex !== null) {
            // TODO: const gameHistory = this.getGameHistoryFromStorage();
            this._isEndGame.next({
                game: newGameStatus,
                winnerTeamIndex
                // ODO:  nextPlayers: this.calculateNextPlayers(gameHistory),
            });
        }
        this.saveGameOnStorage(newGameStatus, 'append');
    }

    undoGameStatus(): void {
        const gameHistory: Game[] = this.getGameHistoryFromStorage();
        if (gameHistory.length === 1) {
            return;
        }
        const newGameHistory = gameHistory.slice(0, -1);
        this.setGameHistory(newGameHistory);
    }

    restartGame(): void {
        const gameHistory: Game[] = this.getGameHistoryFromStorage();
        if (gameHistory.length === 1) {
            return;
        }
        const newGameHistory = gameHistory.slice(0, 1);
        this.setGameHistory(newGameHistory);
    }

    // TODO:
    // private calculateNextPlayers(gameHistory: Game[]): [Player, Player, Player, Player] {
    //     const lastGame = gameHistory.slice(-1)[0];
    //     const participants = lastGame.participants;
    // }

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
}
