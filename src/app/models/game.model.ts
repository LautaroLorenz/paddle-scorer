import { Player } from './player.model';
import { Score } from './score.model';
import { Team, TeamIndex } from './team.model';

export interface Game {
    participants: Player[];
    goalScore: Score;
    teams: [Team, Team];
    isGoldenPoint: boolean;
    winnerTeamIndex: TeamIndex | null;
}
