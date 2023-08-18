import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Game } from 'src/app/models/game.model';
import { Player } from 'src/app/models/player.model';
import { GameService } from 'src/app/services/game.service';

@Component({
    templateUrl: './game-page.component.html',
    styleUrls: ['./game-page.component.scss']
})
export class GamePageComponent {
    private draggedPlayer: Player | null = null;

    constructor(private gameService: GameService) {}

    get game$(): Observable<Game> {
        return this.gameService.game$;
    }

    dragStart(player: Player): void {
        this.draggedPlayer = player;
    }

    dragEnd(): void {
        this.draggedPlayer = null;
    }

    drop(teamIndex: number, playerIndex: number): void {
        if (!this.draggedPlayer) {
            return;
        }
        this.gameService.setGamePlayer(teamIndex, playerIndex, this.draggedPlayer);
        this.draggedPlayer = null;
    }
}
