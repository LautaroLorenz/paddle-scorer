import { getRandomBrightHexColor } from '../core/color-generator.core';
import { GoalScore } from './goal-score.model';
import { Player, RequiredPlayers } from './player.model';

export const DEFAULT_GAME_SETTINGS: GameSettings = {
    goalScore: {
        sets: 3,
        points: 6
    },
    participants: [
        {
            id: 0,
            name: ''
        },
        {
            id: 1,
            name: ''
        },
        {
            id: 2,
            name: ''
        },
        {
            id: 3,
            name: ''
        }
    ],
    teams: {
        colorTeam1: getRandomBrightHexColor(),
        colorTeam2: getRandomBrightHexColor()
    },
    optionals: {
        lockWinnerTeam: false
    }
};

export interface GameSettingsOptionals {
    lockWinnerTeam: boolean;
}

export interface TeamsSettings {
    colorTeam1: string;
    colorTeam2: string;
}

export interface GameSettings {
    participants: [...RequiredPlayers, ...Player[]];
    goalScore: GoalScore;
    optionals: GameSettingsOptionals;
    teams: TeamsSettings;
}
