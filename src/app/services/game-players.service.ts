import { Injectable } from '@angular/core';
import { Game } from '../models/game.model';
import { Player } from '../models/player.model';
import { Team } from '../models/team.model';
import { PlayerPosition } from '../models/player-position.model';

@Injectable({
    providedIn: 'root'
})
export class GamePlayersService {
    getPlayerByPosition(game: Game, playerPosition: PlayerPosition): Player {
        const { teamIndex, playerIndex } = playerPosition;
        return game.teams[teamIndex].players[playerIndex];
    }

    playerPlaysGame(player: Player, game: Game): boolean {
        return this.playerPlaysGameByTeam(player, game.teams[0]) || this.playerPlaysGameByTeam(player, game.teams[1]);
    }

    playerPlaysGameByTeam(player: Player, team: Team): boolean {
        return team.players.map(({ id }) => id).includes(player.id);
    }
}
