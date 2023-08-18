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

    constructor(private gameService: GameService) {}

    get game$(): Observable<Game> {
        return this.gameService.game$;
    }

    getPlayerAt(game: Game, teamIndex: number, playerIndex: number): Player | undefined {
        return game.teams[teamIndex].players[playerIndex];
    }

    openPlayerSelector(teamIndex: number, playerIndex: number): void {
        // this.gameService.setGamePlayer(teamIndex, playerIndex, this.draggedPlayer);
    }
}
