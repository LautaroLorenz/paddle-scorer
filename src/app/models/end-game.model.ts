import { Game } from './game.model';
import { TeamIndex } from './team.model';

export interface EndGame {
    game: Game;
    winnerTeamIndex: TeamIndex,
}
