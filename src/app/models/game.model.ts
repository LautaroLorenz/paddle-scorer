import { Player } from "./player.model";
import { Score } from "./score.model";
import { Team } from "./team.model";

export interface Game {
    participants: Player[];
    score: Score;
    team1: Team;
    team2: Team;
}