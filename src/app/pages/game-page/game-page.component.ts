import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import { Game } from 'src/app/models/game.model';
import { Player, PlayerIndex } from 'src/app/models/player.model';
import { GameService } from 'src/app/services/game.service';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { Router } from '@angular/router';
import { Score } from 'src/app/models/score.model';
import { TeamIndex } from 'src/app/models/team.model';
import { DOCUMENT } from '@angular/common';

@Component({
    templateUrl: './game-page.component.html',
    styleUrls: ['./game-page.component.scss']
})
export class GamePageComponent implements OnInit, OnDestroy {
    menuOptions: MenuItem[];
    displayPlayerSelector: boolean = false;
    playerSelectorHeader: string = '';
    private isFullScreen: boolean = false;
    private playerSelectorTeamIndex: TeamIndex | null = null;
    private playerSelectorPlayerIndex: PlayerIndex | null = null;
    private _onDestroy = new Subject<void>();

    constructor(
        private gameService: GameService,
        private router: Router,
        private confirmationService: ConfirmationService,
        @Inject(DOCUMENT) private document: any
    ) {
        this.menuOptions = this.getMenuOptions();
    }

    get game$(): Observable<Game> {
        return this.gameService.game$;
    }

    ngOnInit(): void {
        this.gameService.isEndGame$.pipe(takeUntil(this._onDestroy)).subscribe((endGame) => {
            console.log(endGame);
            // const winnerTeamIndex = isEndGame;
            // this.confirmationService.confirm({
            //     header: `¡¡¡ Ganador equipo ${winnerTeamIndex + 1} !!!`,
            //     message: `Felicidades equipo ${winnerTeamIndex + 1}. Fin del juego`,
            //     closeOnEscape: false,
            //     acceptLabel: 'reiniciar',
            //     rejectVisible: false,
            //     accept: () => {
            //         // this.gameService.restartGame();
            //         // // keep same players
            //         // // TODO: ordena primero el que menos jugo, si hay enpate, sigue el que mas ganó.
            //         // // TODO: te informa quien entra y quien sale.
            //         // this.gameService.setGamePlayerAt(0, 0, teams[0].players[0]!);
            //         // this.gameService.setGamePlayerAt(0, 1, teams[0].players[1]!);
            //         // this.gameService.setGamePlayerAt(1, 0, teams[1].players[0]!);
            //         // this.gameService.setGamePlayerAt(1, 1, teams[1].players[1]!);
            //     }
            // });
        });
    }

    getPlayerAt(game: Game, teamIndex: TeamIndex, playerIndex: PlayerIndex): Player | undefined {
        return game.teams[teamIndex].players[playerIndex];
    }

    getScoreAt(game: Game, teamIndex: TeamIndex): Score {
        return game.teams[teamIndex].score;
    }

    openPlayerSelector(teamIndex: TeamIndex, playerIndex: PlayerIndex): void {
        this.playerSelectorTeamIndex = teamIndex;
        this.playerSelectorPlayerIndex = playerIndex;
        this.playerSelectorHeader = `Elegir para el equipo ${teamIndex + 1}`;
        this.displayPlayerSelector = true;
    }

    playerSelectorClick({ option }: { option: Player }, game: Game): void {
        this.displayPlayerSelector = false;
        this.gameService.setGamePlayerAt(game, this.playerSelectorTeamIndex!, this.playerSelectorPlayerIndex!, option);
        this.playerSelectorTeamIndex = null;
        this.playerSelectorPlayerIndex = null;
    }

    incrementCounterAt(game: Game, teamIndex: TeamIndex): void {
        this.gameService.incrementCounterAt(game, teamIndex);
    }

    ngOnDestroy(): void {
        this._onDestroy.next();
        this._onDestroy.complete();
    }

    // TODO: contar cuantos partidos jugó cada jugador, rotar jugadores al finalizar con un algoritmo
    // TODO: Rotar con el saque: podria haber un boton sobre el slot para elegir quien inicia el saque
    // TODO: detectar portrait y landscape
    private getMenuOptions(): MenuItem[] {
        return [
            {
                label: 'deshacer cambio',
                icon: 'pi pi-undo',
                command: () => {
                    this.gameService.undoGameStatus();
                }
            },
            {
                label: `${this.isFullScreen ? 'Quit' : ''} full screen`,
                icon: `pi pi-window-${this.isFullScreen ? 'minimize' : 'maximize'}`,
                command: () => {
                    if (this.isFullScreen) {
                        this.document?.exitFullscreen();
                        this.isFullScreen = false;
                    } else {
                        this.document?.documentElement?.requestFullscreen();
                        this.isFullScreen = true;
                    }
                    this.menuOptions = this.getMenuOptions();
                }
            },
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
