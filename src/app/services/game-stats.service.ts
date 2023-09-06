import { Injectable } from '@angular/core';
import { Stats, TimesPlayedPerPlayer, TimesWinnedPerPlayer } from '../models/stats.model';
import { Game } from '../models/game.model';
import { Player } from '../models/player.model';
import { TeamIndex } from '../models/team.model';

@Injectable({
    providedIn: 'root'
})
export class GameStatsService {
    getStats(games: Game[], participants: Player[]): Stats {
        // inicializar estadísticas en cero para todos
        const stats: Stats = this.getEmptyStats(participants);
        const { timesPlayedPerPlayer, timesWinnedPerPlayer } = stats;

        for (let index = 0; index < games.length; index++) {
            const game = games[index];
            const player1 = game.teams[0].players[0];
            const player2 = game.teams[0].players[1];
            const player3 = game.teams[1].players[0];
            const player4 = game.teams[1].players[1];

            // cantidad de veces que jugó cada jugador
            timesPlayedPerPlayer[player1.id] = this.calculateTimesPlayedPerPlayer(player1, timesPlayedPerPlayer, game);
            timesPlayedPerPlayer[player2.id] = this.calculateTimesPlayedPerPlayer(player2, timesPlayedPerPlayer, game);
            timesPlayedPerPlayer[player3.id] = this.calculateTimesPlayedPerPlayer(player3, timesPlayedPerPlayer, game);
            timesPlayedPerPlayer[player4.id] = this.calculateTimesPlayedPerPlayer(player4, timesPlayedPerPlayer, game);

            // cantidad de veces que ganó cada jugador
            timesWinnedPerPlayer[player1.id] = this.calculateTimesWinnedPerPlayer(player1, timesWinnedPerPlayer, game);
            timesWinnedPerPlayer[player2.id] = this.calculateTimesWinnedPerPlayer(player2, timesWinnedPerPlayer, game);
            timesWinnedPerPlayer[player3.id] = this.calculateTimesWinnedPerPlayer(player3, timesWinnedPerPlayer, game);
            timesWinnedPerPlayer[player4.id] = this.calculateTimesWinnedPerPlayer(player4, timesWinnedPerPlayer, game);
        }

        return stats;
    }

    private getEmptyStats(participants: Player[]): Stats {
        const stats: Stats = {
            timesPlayedPerPlayer: {},
            timesWinnedPerPlayer: {}
        };
        const { timesPlayedPerPlayer, timesWinnedPerPlayer } = stats;

        for (let index = 0; index < participants.length; index++) {
            const participant = participants[index];
            timesPlayedPerPlayer[participant.id] = 0;
            timesWinnedPerPlayer[participant.id] = 0;
        }

        return stats;
    }

    private calculateTimesPlayedPerPlayer(
        player: Player,
        timesPlayedPerPlayer: TimesPlayedPerPlayer,
        game: Game
    ): number {
        const increment: boolean = this.playerPlaysGame(player, game);
        const isSet: boolean = !isNaN(timesPlayedPerPlayer[player.id]);

        if (increment && isSet) {
            return timesPlayedPerPlayer[player.id] + 1;
        } else if (!increment && isSet) {
            return timesPlayedPerPlayer[player.id];
        } else if (increment && !isSet) {
            return 1;
        } else {
            return 0;
        }
    }

    private calculateTimesWinnedPerPlayer(
        player: Player,
        timesWinnedPerPlayer: TimesWinnedPerPlayer,
        game: Game
    ): number {
        const increment: boolean = this.playerPlaysGameByTeam(player, game, game.winnerTeamIndex!);
        const isSet: boolean = !isNaN(timesWinnedPerPlayer[player.id]);

        if (increment && isSet) {
            return timesWinnedPerPlayer[player.id] + 1;
        } else if (!increment && isSet) {
            return timesWinnedPerPlayer[player.id];
        } else if (increment && !isSet) {
            return 1;
        } else {
            return 0;
        }
    }

    private playerPlaysGame(player: Player, game: Game): boolean {
        return this.playerPlaysGameByTeam(player, game, 0) || this.playerPlaysGameByTeam(player, game, 1);
    }

    private playerPlaysGameByTeam(player: Player, game: Game, teamIndex: TeamIndex): boolean {
        return game.teams[teamIndex].players.map(({ id }) => id).includes(player.id);
    }
}
