import { Player } from "./player.model";
import { Score } from "./score.model";

export interface Team {
    players: [Player, Player];
    score: Score;
    color: string;
}

export type TeamIndex = 0 | 1;