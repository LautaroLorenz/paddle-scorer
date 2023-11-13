import { SnapshotStatus } from "../core/snapshot.core";

export interface Player {
    id: number;
    name: string;
}

export type PlayerIndex = 0 | 1;
export type RequiredPlayers = [Player, Player, Player, Player];

export class PlayerSnapshotStatus implements SnapshotStatus<Player> {
    clone(player: Player): Player {
        return {
            id: player.id,
            name: player.name
        };
    }
}