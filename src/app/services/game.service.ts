import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Game } from '../models/game.model';
import { Player } from '../models/player.model';
import { Score } from '../models/score.model';

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

    setGamePlayer(teamIndex: number, playerIndex: number, player: Player): void {
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

    private saveGameOnStorage(gameStatus: Game, mode: 'append' | 'override'): void {
        let newGameHistory: Game[] = [];
        if (mode === 'override') {
            newGameHistory = [gameStatus];
        }
        if (mode === 'append') {
            const gameHistory: Game[] = this.getGameHistoryFromStorage();
            newGameHistory = gameHistory.concat(gameStatus);
        }
        localStorage.setItem('gameHistory', JSON.stringify(newGameHistory));
        this.game.next(newGameHistory[newGameHistory.length - 1]);
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
}
