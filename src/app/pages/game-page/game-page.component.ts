import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject, take, takeUntil } from 'rxjs';
import { Game } from 'src/app/models/game.model';
import { Player, RequiredPlayers } from 'src/app/models/player.model';
import { GameService } from 'src/app/services/game.service';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { Router } from '@angular/router';
import { Score } from 'src/app/models/score.model';
import { Team, TeamIndex } from 'src/app/models/team.model';
import { DOCUMENT } from '@angular/common';
import { GameSettingsService } from 'src/app/services/game-settings.service';
import { GameSettings } from 'src/app/models/game-settings.model';
import { PLAYER_POSITIONS, PlayerPosition } from 'src/app/models/player-position.model';
import { GamePlayersService } from 'src/app/services/game-players.service';
import { randomSortArray } from 'src/app/core/random-sort-array';

@Component({
    templateUrl: './game-page.component.html',
    styleUrls: ['./game-page.component.scss']
})
export class GamePageComponent implements OnInit, OnDestroy {
    menuOptions: MenuItem[];
    displayPlayerSelector: boolean = false;
    playerSelectorHeader: string = '';
    gameSettings: GameSettings | undefined;
    PLAYER_POSITIONS = PLAYER_POSITIONS;
    private isFullScreen: boolean = false;
    private playerSelectorPlayerPosition: PlayerPosition | null = null;
    private _onDestroy = new Subject<void>();

    constructor(
        private gameSettingsService: GameSettingsService,
        private gameService: GameService,
        private router: Router,
        private confirmationService: ConfirmationService,
        private gamePlayers: GamePlayersService,
        @Inject(DOCUMENT) private document: any
    ) {
        this.menuOptions = this.getMenuOptions();
    }

    get game$(): Observable<Game> {
        return this.gameService.game$;
    }

    ngOnInit(): void {
        this.gameSettingsService.gameSettings$.pipe(take(1)).subscribe((gameSettings) => {
            this.gameSettings = gameSettings;
            const [player1, player2, player3, player4] = randomSortArray(gameSettings.participants) as RequiredPlayers;
            this.gameService.initGame([player1, player2, player3, player4], gameSettings.teams);
        });
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
                acceptLabel: 'Comenzar siguiente partido',
                rejectVisible: false,
                accept: () => {
                    this.gameService.restartScore();
                    if (this.gameSettings && this.gameSettings.participants) {
                        this.gameService.setPlayers(
                            this.gameSettings.participants,
                            this.gameSettings.optionals.lockWinnerTeam
                        );
                    }
                },
                closeOnEscape: false
            });
        });
    }

    getPlayerByPosition(game: Game, playerPosition: PlayerPosition): Player {
        return this.gamePlayers.getPlayerByPosition(game, playerPosition);
    }

    getTeamAt(game: Game, teamIndex: TeamIndex): Team {
        return game.teams[teamIndex];
    }

    getScoreAt(game: Game, teamIndex: TeamIndex): Score {
        return game.teams[teamIndex].score;
    }

    openPlayerSelector(playerPosition: PlayerPosition): void {
        this.playerSelectorPlayerPosition = playerPosition;
        this.playerSelectorHeader = `Elegir para el equipo ${playerPosition.teamIndex + 1}`;
        this.displayPlayerSelector = true;
    }

    playerSelectorClick({ option }: { option: Player }): void {
        this.displayPlayerSelector = false;
        this.gameService.setPlayerAt(this.playerSelectorPlayerPosition!, option);
        this.playerSelectorPlayerPosition = null;
    }

    incrementCounterAt(teamIndex: TeamIndex): void {
        if (!this.gameSettings || !this.gameSettings.goalScore) {
            return;
        }
        this.gameService.incrementScoreAt(this.gameSettings.goalScore, teamIndex, 'counter');
    }

    undo(): void {
        this.gameService.undo();
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
                    this.undo();
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
