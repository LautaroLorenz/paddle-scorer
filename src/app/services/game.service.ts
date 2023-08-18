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
        team1: {
            player1: undefined,
            player2: undefined,
            score: {
                points: 0,
                sets: 0
            }
        },
        team2: {
            player1: undefined,
            player2: undefined,
            score: {
                points: 0,
                sets: 0
            }
        }
    });

    constructor() {
        this.loadGame();
    }

    get game$(): Observable<Game> {
        return this.game.asObservable();
    }

    setGamePlayer(teamIndex: number, playerIndex: number, player: Player): void {
        const game = this.game.value;
        if (teamIndex === 1) {
            if (playerIndex === 1) {
                game.team1.player1 = player;
            }
            if (playerIndex === 2) {
                game.team1.player2 = player;
            }
        }
        if (teamIndex === 2) {
            if (playerIndex === 1) {
                game.team2.player1 = player;
            }
            if (playerIndex === 2) {
                game.team2.player2 = player;
            }
        }
        this.game.next(game);
        this.saveGame(game);
    }

    setGame(participants: Player[], score: Score): void {
        const game: Game = {
            score,
            participants,
            team1: {
                player1: undefined,
                player2: undefined,
                score: {
                    points: 0,
                    sets: 0
                }
            },
            team2: {
                player1: undefined,
                player2: undefined,
                score: {
                    points: 0,
                    sets: 0
                }
            }
        };
        this.game.next(game);
        this.saveGame(game);
    }

    private saveGame(game: Game): void {
        localStorage.setItem('game', JSON.stringify(game));
    }

    private loadGame(): void {
        const game = localStorage.getItem('game');
        if (typeof game !== 'string') {
            return;
        }
        this.game.next(JSON.parse(game));
    }
}
