import { Players } from './player.model';
import { Team, TeamIndex } from './team.model';

export const DEFAULT_GAME: (players: Players) => Game = (players) => ({
    teams: [
        {
            players: [players[0], players[1]],
            score: {
                points: 0,
                sets: 0,
                counter: 0
            }
        },
        {
            players: [players[2], players[3]],
            score: {
                points: 0,
                sets: 0,
                counter: 0
            }
        }
    ],
    isGoldenPoint: false,
    winnerTeamIndex: null
});

export interface Game {
    teams: [Team, Team];
    isGoldenPoint: boolean;
    winnerTeamIndex: TeamIndex | null;
}
