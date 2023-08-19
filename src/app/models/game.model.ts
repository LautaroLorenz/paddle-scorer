import { Player } from './player.model';
import { Score } from './score.model';
import { Team } from './team.model';

export interface Game {
    participants: Player[];
    goalScore: Score;
    teams: [Team, Team];
    isGoldenPoint: boolean;
}
