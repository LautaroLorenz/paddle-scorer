import { Team, TeamIndex } from './team.model';

export const DEFAULT_GAME: Game = {
    teams: [
        {
            players: [undefined, undefined],
            score: {
                points: 0,
                sets: 0,
                counter: 0
            }
        },
        {
            players: [undefined, undefined],
            score: {
                points: 0,
                sets: 0,
                counter: 0
            }
        }
    ],
    isGoldenPoint: false,
    winnerTeamIndex: null
};

export interface Game {
    teams: [Team, Team];
    isGoldenPoint: boolean;
    winnerTeamIndex: TeamIndex | null;
}
