import { SnapshotStatus } from '../core/snapshot.core';
import { PlayerSnapshotStatus, RequiredPlayers } from './player.model';
import { Team, TeamIndex } from './team.model';

export const DEFAULT_GAME: (players: RequiredPlayers) => Game = (players) => ({
    teams: [
        {
            players: [players[0], players[1]],
            score: {
                points: 0,
                sets: 0,
                counter: 0
            }
        },
        {
            players: [players[2], players[3]],
            score: {
                points: 0,
                sets: 0,
                counter: 0
            }
        }
    ],
    isGoldenPoint: false,
    winnerTeamIndex: null
});

export interface Game {
    teams: [Team, Team];
    isGoldenPoint: boolean;
    winnerTeamIndex: TeamIndex | null;
}

export class GameSnapshotStatus implements SnapshotStatus<Game> {
    private playerSnapshotStatus: PlayerSnapshotStatus;

    constructor() {
        this.playerSnapshotStatus = new PlayerSnapshotStatus();
    }

    clone(game: Game): Game {
        const {
            isGoldenPoint,
            winnerTeamIndex,
            teams: [team1, team2]
        } = game;
        const { score: score1, players: players1 } = team1;
        const { score: score2, players: players2 } = team2;

        return {
            isGoldenPoint: isGoldenPoint,
            winnerTeamIndex: winnerTeamIndex,
            teams: [
                {
                    score: {
                        counter: score1.counter,
                        points: score1.points,
                        sets: score1.sets
                    },
                    players: [
                        this.playerSnapshotStatus.clone(players1[0]),
                        this.playerSnapshotStatus.clone(players1[1])
                    ]
                },
                {
                    score: {
                        counter: score2.counter,
                        points: score2.points,
                        sets: score2.sets
                    },
                    players: [
                        this.playerSnapshotStatus.clone(players2[0]),
                        this.playerSnapshotStatus.clone(players2[1])
                    ]
                }
            ]
        };
    }
}
