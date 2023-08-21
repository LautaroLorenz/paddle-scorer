export interface Player {
    id: number;
    name: string;
    color: string;
}

export type PlayerIndex = 0 | 1;
export type Players = [Player, Player, Player, Player];