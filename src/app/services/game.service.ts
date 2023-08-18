import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { Game } from '../models/game.model';
import { Player } from '../models/player.model';
import { Score } from '../models/score.model';

@Injectable({
    providedIn: 'root'
})
export class GameService {
    private game = new ReplaySubject<Game>(1);

    constructor() {}

    get game$(): Observable<Game> {
        return this.game.asObservable();
    }

    setGame(participants: Player[], scoreSettings: Score): void {
        this.game.next({
            scoreSettings,
            participants,
            players: [],
            currentScore: {
                points: 0,
                sets: 0
            }
        });
    }
}
