import { SnapshotStatus } from "../core/snapshot.core";

export interface Player {
    id: number;
    name: string;
    color: string;
}

export type PlayerIndex = 0 | 1;
export type Players = [Player, Player, Player, Player];

export class PlayerSnapshotStatus implements SnapshotStatus<Player> {
    clone(player: Player): Player {
        return {
            id: player.id,
            color: player.color,
            name: player.name
        };
    }
}