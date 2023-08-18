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
        this.loadGame();
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
                if(splotPlayer?.name === player?.name && splotPlayer?.color === player?.color) {
                    team.players[f] = undefined;
                }
            }
        }
        game.teams[teamIndex].players[playerIndex] = player;
        console.log(game);
        this.game.next(game);
        this.saveGame(game);
    }

    setGame(participants: Player[], score: Score): void {
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
