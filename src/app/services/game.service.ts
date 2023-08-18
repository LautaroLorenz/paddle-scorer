import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Game } from '../models/game.model';
import { Player, PlayerIndex } from '../models/player.model';
import { Score } from '../models/score.model';
import { Team, TeamIndex } from '../models/team.model';
import { Point } from '../models/point.model';

@Injectable({
    providedIn: 'root'
})
export class GameService {
    private game = new BehaviorSubject<Game>({
        score: {
            points: 6,
            sets: 3
        },
        participants: [],
        teams: [
            {
                players: [undefined, undefined],
                score: {
                    points: 0,
                    sets: 0
                }
            },
            {
                players: [undefined, undefined],
                score: {
                    points: 0,
                    sets: 0
                }
            }
        ],
        points: [0, 0],
        isGoldenPoint: false,
        isGoldenSet: false,
        isGoldenGame: false,
        isEndGame: false
    });

    constructor() {
        this.loadGameFromStorage();
    }

    get game$(): Observable<Game> {
        return this.game.asObservable();
    }

    setGamePlayerAt(teamIndex: TeamIndex, playerIndex: PlayerIndex, player: Player): void {
        const game: Game = this.game.value;
        for (let i = 0; i < game.teams.length; i++) {
            const team = game.teams[i];
            for (let f = 0; f < team.players.length; f++) {
                const splotPlayer = team.players[f];
                if (splotPlayer?.name === player?.name && splotPlayer?.color === player?.color) {
                    team.players[f] = undefined;
                }
            }
        }
        game.teams[teamIndex].players[playerIndex] = player;
        this.saveGameOnStorage(game, 'append');
    }

    initGame(participants: Player[], score: Score): void {
        const game: Game = {
            score,
            participants,
            teams: [
                {
                    players: [undefined, undefined],
                    score: {
                        points: 0,
                        sets: 0
                    }
                },
                {
                    players: [undefined, undefined],
                    score: {
                        points: 0,
                        sets: 0
                    }
                }
            ],
            points: [0, 0],
            isGoldenPoint: false,
            isGoldenSet: false,
            isGoldenGame: false,
            isEndGame: false
        };
        this.saveGameOnStorage(game, 'override');
    }

    incrementPointAt(gameStatus: Game, teamIndex: TeamIndex): void {
        const { points } = gameStatus;
        const newPoints: [Point, Point] = [points[0], points[1]];
        const otherTeamIndex = teamIndex === 0 ? 1 : 0;
        let { score: newScoreTeamIndex } = gameStatus.teams[teamIndex];
        let { score: newScoreOtherTeamIndex } = gameStatus.teams[otherTeamIndex];
        switch (points[teamIndex]) {
            case 0:
                newPoints[teamIndex] = 15;
                break;
            case 15:
                newPoints[teamIndex] = 30;
                break;
            case 30:
                newPoints[teamIndex] = 40;
                break;
            case 40:
                newPoints[teamIndex] = 0;
                newPoints[otherTeamIndex] = 0;
                newScoreTeamIndex.points = newScoreTeamIndex.points + 1;
                if (newScoreTeamIndex.points === gameStatus.score.points) {
                    newScoreTeamIndex = {
                        ...newScoreTeamIndex,
                        sets: newScoreTeamIndex.sets + 1
                    };
                    newScoreTeamIndex.points = 0;
                    newScoreOtherTeamIndex = {
                        ...newScoreOtherTeamIndex,
                        points: 0
                    };
                }
                break;
        }
        gameStatus.teams[teamIndex].score = newScoreTeamIndex;
        gameStatus.teams[otherTeamIndex].score = newScoreOtherTeamIndex;
        gameStatus.points = newPoints;
        gameStatus.isGoldenPoint = this.isGoldenPoint(gameStatus);
        gameStatus.isGoldenSet = this.isGoldenSet(gameStatus);
        gameStatus.isGoldenGame = this.isGoldenGame(gameStatus);
        gameStatus.isEndGame = this.isEndGame(gameStatus);
        this.saveGameOnStorage(gameStatus, 'append');
    }
    undoGameStatus(): void {
        const gameHistory: Game[] = this.getGameHistoryFromStorage();
        if (gameHistory.length === 1) {
            return;
        }
        const newGameHistory = gameHistory.slice(0, -1);
        this.setGameHistory(newGameHistory);
    }

    restartGame(): void {
        const gameHistory: Game[] = this.getGameHistoryFromStorage();
        if (gameHistory.length === 1) {
            return;
        }
        const newGameHistory = gameHistory.slice(0, 1);
        this.setGameHistory(newGameHistory);
    }

    private isEndGame(game: Game): TeamIndex | false {
        if (this.isTeamWinner(game.score, game.teams[0])) {
            return 0;
        }
        if (this.isTeamWinner(game.score, game.teams[1])) {
            return 1;
        }
        return false;
    }

    private isGoldenPoint(game: Game): boolean {
        return game.points[0] === 40 && game.points[1] === 40;
    }

    private isGoldenSet(game: Game): boolean {
        return (
            this.isGoldenPoint(game) &&
            game.teams[0].score.points + 1 === game.score.points &&
            game.teams[1].score.points + 1 === game.score.points
        );
    }

    private isGoldenGame(game: Game): boolean {
        return (
            this.isGoldenSet(game) &&
            game.teams[0].score.sets + 1 === game.score.sets &&
            game.teams[1].score.sets + 1 === game.score.sets
        );
    }

    private isTeamWinner(gameScore: Score, team: Team): boolean {
        return team.score.sets === gameScore.sets;
    }

    private saveGameOnStorage(gameStatus: Game, mode: 'append' | 'override'): void {
        let newGameHistory: Game[] = [];
        if (mode === 'override') {
            newGameHistory = [gameStatus];
        }
        if (mode === 'append') {
            const gameHistory: Game[] = this.getGameHistoryFromStorage();
            newGameHistory = gameHistory.concat(gameStatus);
        }
        this.setGameHistory(newGameHistory);
    }

    private loadGameFromStorage(): void {
        const gameHistory: Game[] = this.getGameHistoryFromStorage();
        this.game.next(gameHistory[gameHistory.length - 1]);
    }

    private getGameHistoryFromStorage(): Game[] {
        const history = localStorage.getItem('gameHistory');
        if (history) {
            return JSON.parse(history);
        }
        return [];
    }

    private setGameHistory(gameHistory: Game[]): void {
        localStorage.setItem('gameHistory', JSON.stringify(gameHistory));
        this.game.next(gameHistory[gameHistory.length - 1]);
    }
}
