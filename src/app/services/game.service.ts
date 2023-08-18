import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Game } from '../models/game.model';
import { Player } from '../models/player.model';
import { Score } from '../models/score.model';
import { Team } from '../models/team.model';

@Injectable({
    providedIn: 'root'
})
export class GameService {
    private game = new BehaviorSubject<Game>({
        score: {
            points: 6,
            sets: 3
        },
        participants: [],
        teams: [
            {
                players: [undefined, undefined],
                score: {
                    points: 0,
                    sets: 0
                }
            },
            {
                players: [undefined, undefined],
                score: {
                    points: 0,
                    sets: 0
                }
            }
        ]
    });

    constructor() {
        this.loadGameFromStorage();
    }

    get game$(): Observable<Game> {
        return this.game.asObservable();
    }

    setGamePlayerAt(teamIndex: number, playerIndex: number, player: Player): void {
        const game: Game = this.game.value;
        for (let i = 0; i < game.teams.length; i++) {
            const team = game.teams[i];
            for (let f = 0; f < team.players.length; f++) {
                const splotPlayer = team.players[f];
                if (splotPlayer?.name === player?.name && splotPlayer?.color === player?.color) {
                    team.players[f] = undefined;
                }
            }
        }
        game.teams[teamIndex].players[playerIndex] = player;
        this.saveGameOnStorage(game, 'append');
    }

    initGame(participants: Player[], score: Score): void {
        const game: Game = {
            score,
            participants,
            teams: [
                {
                    players: [undefined, undefined],
                    score: {
                        points: 0,
                        sets: 0
                    }
                },
                {
                    players: [undefined, undefined],
                    score: {
                        points: 0,
                        sets: 0
                    }
                }
            ]
        };
        this.saveGameOnStorage(game, 'override');
    }

    incrementScoreAt(gameStatus: Game, teamIndex: number): Game {
        const newScore: Score = this.calculateTeamScore(gameStatus.teams[teamIndex]);
        gameStatus.teams[teamIndex].score = newScore;
        this.saveGameOnStorage(gameStatus, 'append');
        return gameStatus;
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

    isEndGame(game: Game): number | false {
        if (this.isTeamWinner(game.score, game.teams[0])) {
            return 0;
        }
        if (this.isTeamWinner(game.score, game.teams[1])) {
            return 1;
        }
        return false;
    }

    private isTeamWinner(gameScore: Score, team: Team): boolean {
        return team.score.sets === gameScore.sets;
    }

    private calculateTeamScore(team: Team): Score {
        const { score } = team;
        const newScore: Score = {
            sets: score.sets,
            points: score.points
        };
        switch (score.points) {
            case 0:
                newScore.points = 15;
                break;
            case 15:
                newScore.points = 30;
                break;
            case 30:
                newScore.points = 40;
                break;
            case 40:
                newScore.points = 0;
                newScore.sets = score.sets + 1;
                break;
        }
        return newScore;
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
