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
        this.gameService.gameEnd$.pipe(takeUntil(this._onDestroy)).subscribe((game) => {
            const { teams, winnerTeamIndex } = game;
            const winnerTeamNumber = winnerTeamIndex! + 1;
            const winnerPlayer1 = teams[winnerTeamIndex!].players[0];
            const winnerPlayer2 = teams[winnerTeamIndex!].players[1];
            const victoryHeader = `¡¡¡ Felicidades al equipo ${winnerTeamNumber} por la victoria !!!`;
            let victoryMessage;
            if (winnerPlayer1 && winnerPlayer2) {
                victoryMessage = `Excelente victoria ${winnerPlayer1.name} y ${winnerPlayer2.name}, sigan jugando así.`;
            } else {
                victoryMessage = `¡ Hey, Jugaron muy bien !`;
            }
            this.confirmationService.confirm({
                header: victoryHeader,
                message: victoryMessage,
                icon: 'pi pi-heart-fill',
                acceptLabel: 'Reiniciar',
                rejectVisible: false,
                accept: () => {
                    this.gameService.restartScore();
                    this.gameService.setNextPlayers();
                },
                closeOnEscape: false
            });
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

    playerSelectorClick({ option }: { option: Player }): void {
        this.displayPlayerSelector = false;
        this.gameService.setGamePlayerAt(this.playerSelectorTeamIndex!, this.playerSelectorPlayerIndex!, option);
        this.playerSelectorTeamIndex = null;
        this.playerSelectorPlayerIndex = null;
    }

    incrementCounterAt(teamIndex: TeamIndex): void {
        this.gameService.incrementScoreAt(teamIndex, 'counter');
    }

    ngOnDestroy(): void {
        this._onDestroy.next();
        this._onDestroy.complete();
    }

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
                label: 'reiniciar score',
                icon: 'pi pi-refresh',
                command: () => {
                    this.confirmationService.confirm({
                        header: 'Reiniciar score',
                        message: 'Volver a empezar los contadores?',
                        closeOnEscape: false,
                        acceptLabel: 'Confirmar',
                        accept: () => {
                            this.gameService.restartScore();
                        }
                    });
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
