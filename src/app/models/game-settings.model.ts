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
            name: '',
            color: getRandomBrightHexColor()
        },
        {
            id: 1,
            name: '',
            color: getRandomBrightHexColor()
        },
        {
            id: 2,
            name: '',
            color: getRandomBrightHexColor()
        },
        {
            id: 3,
            name: '',
            color: getRandomBrightHexColor()
        }
    ]
};

export interface GameSettings {
    participants: [...RequiredPlayers, ...Player[]];
    goalScore: GoalScore;
}
