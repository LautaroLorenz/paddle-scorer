import { Player } from "./player.model";
import { Point } from "./point.model";
import { Score } from "./score.model";
import { Team, TeamIndex } from "./team.model";

export interface Game {
    participants: Player[];
    score: Score;
    teams: [Team, Team];
    points: [Point, Point];
    isGoldenPoint: boolean;
    isGoldenSet: boolean;
    isGoldenGame: boolean;
    isEndGame: TeamIndex | false;
}