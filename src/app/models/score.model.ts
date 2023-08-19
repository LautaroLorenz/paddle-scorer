import { Counter } from "./counter.model";
import { GoalScore } from "./goal-score.model";

export interface Score extends GoalScore {
    counter: Counter;
}
