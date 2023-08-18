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
    displayPlayerSelector: boolean = false;
    playerSelectorHeader: string = '';
    private playerSelectorTeamIndex: number | null = null;
    private playerSelectorPlayerIndex: number | null = null

    constructor(private gameService: GameService) {}

    get game$(): Observable<Game> {
        return this.gameService.game$;
    }

    getPlayerAt(game: Game, teamIndex: number, playerIndex: number): Player | undefined {
        return game.teams[teamIndex].players[playerIndex];
    }

    openPlayerSelector(teamIndex: number, playerIndex: number): void {
        this.playerSelectorTeamIndex = teamIndex;
        this.playerSelectorPlayerIndex = playerIndex;
        this.playerSelectorHeader = `Elegir para el equipo ${teamIndex + 1}`;
        this.displayPlayerSelector = true;
    }

    playerSelectorClick({ option }: { option: Player }): void {
        this.displayPlayerSelector = false;
        this.gameService.setGamePlayer(this.playerSelectorTeamIndex!, this.playerSelectorPlayerIndex!, option);
        this.playerSelectorTeamIndex = null;
        this.playerSelectorPlayerIndex = null;
    }
}
