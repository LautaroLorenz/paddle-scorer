import { Game } from './game.model';
import { Player } from './player.model';
import { TeamIndex } from './team.model';

export interface EndGame {
    game: Game;
    winnerTeamIndex: TeamIndex;
    // nextPlayers: [Player, Player, Player, Player];
}
