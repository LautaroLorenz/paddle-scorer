import { Player } from "./player.model";
import { Score } from "./score.model";

export interface Game {
    participants: Player[];
    scoreSettings: Score;
    players: Player[];
    currentScore: Score;
}