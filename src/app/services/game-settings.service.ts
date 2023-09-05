import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DEFAULT_GAME_SETTINGS, GameSettings } from '../models/game-settings.model';

@Injectable({
    providedIn: 'root'
})
export class GameSettingsService {
    private gameSettings = new BehaviorSubject<GameSettings>(DEFAULT_GAME_SETTINGS);

    constructor() {
        this.loadGameSettingsFromStorage();
    }

    get gameSettings$(): Observable<GameSettings> {
        return this.gameSettings.asObservable();
    }

    saveGameSettingsOnStorage(gameSettings: GameSettings): void {
        localStorage.setItem('gameSettings', JSON.stringify(gameSettings));
        this.gameSettings.next(gameSettings);
    }

    private loadGameSettingsFromStorage(): void {
        const savedGameSettings = localStorage.getItem('gameSettings');
        if (!savedGameSettings) {
            return;
        }

        // prevent undefined settings values
        const gameSettings: GameSettings = {
            ...DEFAULT_GAME_SETTINGS,
            ...JSON.parse(savedGameSettings)
        };
        
        this.gameSettings.next(gameSettings);
    }
}
