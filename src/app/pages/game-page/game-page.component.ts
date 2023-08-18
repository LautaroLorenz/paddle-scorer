import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Game } from 'src/app/models/game.model';
import { Player } from 'src/app/models/player.model';
import { GameService } from 'src/app/services/game.service';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { Router } from '@angular/router';
import { Score } from 'src/app/models/score.model';

@Component({
    templateUrl: './game-page.component.html',
    styleUrls: ['./game-page.component.scss']
})
export class GamePageComponent {
    menuOptions: MenuItem[];
    displayPlayerSelector: boolean = false;
    playerSelectorHeader: string = '';
    private playerSelectorTeamIndex: number | null = null;
    private playerSelectorPlayerIndex: number | null = null;

    constructor(
        private gameService: GameService,
        private router: Router,
        private confirmationService: ConfirmationService
    ) {
        this.menuOptions = this.getMenuOptions();
    }

    get game$(): Observable<Game> {
        return this.gameService.game$;
    }

    getPlayerAt(game: Game, teamIndex: number, playerIndex: number): Player | undefined {
        return game.teams[teamIndex].players[playerIndex];
    }

    getScoreAt(game: Game, teamIndex: number): Score {
        return game.teams[teamIndex].score;
    }

    openPlayerSelector(teamIndex: number, playerIndex: number): void {
        this.playerSelectorTeamIndex = teamIndex;
        this.playerSelectorPlayerIndex = playerIndex;
        this.playerSelectorHeader = `Elegir para el equipo ${teamIndex + 1}`;
        this.displayPlayerSelector = true;
    }

    playerSelectorClick({ option }: { option: Player }): void {
        this.displayPlayerSelector = false;
        this.gameService.setGamePlayerAt(this.playerSelectorTeamIndex!, this.playerSelectorPlayerIndex!, option);
        this.playerSelectorTeamIndex = null;
        this.playerSelectorPlayerIndex = null;
    }

    incrementScoreAt(game: Game, teamIndex: number): void {
        const newGameStatus = this.gameService.incrementScoreAt(game, teamIndex);
        const winnerTeamIndex = this.gameService.isEndGame(newGameStatus);
        if(winnerTeamIndex !== false) {
            this.confirmationService.confirm({
                header: `¡¡¡ Ganador equipo ${winnerTeamIndex + 1} !!!`,
                message: 'Fin del juego',
                closeOnEscape: false,
                acceptLabel: 'reiniciar',
                rejectVisible: false,
                accept: () => {
                    this.gameService.restartGame();
                }
            });
        }
    }

    // TODO: contar cuantos partidos jugó cada jugador, rotar jugadores al finalizar con un algoritmo
    // TODO: Rotar con el saque: podria haber un boton sobre el slot para elegir quien inicia el saque
    // TODO: animación punto de oro;
    private getMenuOptions(): MenuItem[] {
        return [
            {
                label: 'deshacer cambio',
                icon: 'pi pi-undo',
                command: () => {
                    this.gameService.undoGameStatus();
                }
            },
            // TODO: { label: 'Full screen', icon: 'pi pi-window-maximize' },
            {
                label: 'reiniciar',
                icon: 'pi pi-refresh',
                command: () => {
                    this.confirmationService.confirm({
                        header: 'Reiniciar',
                        message: 'Volver a empezar todo el juego?',
                        closeOnEscape: false,
                        acceptLabel: 'Confirmar',
                        accept: () => {
                            this.gameService.restartGame();
                        }
                    });
                }
            },
            {
                label: 'Ir al inicio',
                icon: 'pi pi-home',
                command: () => {
                    this.confirmationService.confirm({
                        header: 'Ir al inicio',
                        message: 'Al salir se borrará el progreso, continuar?',
                        closeOnEscape: false,
                        acceptLabel: 'Salir',
                        accept: () => {
                            this.router.navigate(['home']);
                        }
                    });
                }
            }
        ];
    }
}
