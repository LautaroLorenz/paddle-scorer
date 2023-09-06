import { PlayerIndex } from './player.model';
import { TeamIndex } from './team.model';

export interface PlayerPosition {
    teamIndex: TeamIndex;
    playerIndex: PlayerIndex;
}

export const PLAYER_POSITIONS: PlayerPosition[] = [
    {
        teamIndex: 0,
        playerIndex: 0
    },
    {
        teamIndex: 0,
        playerIndex: 1
    },
    {
        teamIndex: 1,
        playerIndex: 0
    },
    {
        teamIndex: 1,
        playerIndex: 1
    }
];
