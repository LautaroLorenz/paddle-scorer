import { Player } from "./player.model";
import { Score } from "./score.model";

export interface Team {
    player1?: Player;
    player2?: Player;
    score: Score;
}