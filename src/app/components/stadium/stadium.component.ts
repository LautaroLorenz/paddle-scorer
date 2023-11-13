import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { PLAYER_POSITIONS, PlayerPosition } from 'src/app/models/player-position.model';
import { Player } from 'src/app/models/player.model';
import { Score } from 'src/app/models/score.model';
import { Team, TeamIndex } from 'src/app/models/team.model';

@Component({
    selector: 'app-stadium',
    templateUrl: './stadium.component.html',
    styleUrls: ['./stadium.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class StadiumComponent {
    @Input() player1!: Player;
    @Input() player2!: Player;
    @Input() player3!: Player;
    @Input() player4!: Player;
    @Input() team1!: Team;
    @Input() team2!: Team;
    @Input() scoreTeam1!: Score;
    @Input() scoreTeam2!: Score;
    @Input() hasSpecialEffects!: boolean;

    @Output() playerClick = new EventEmitter<PlayerPosition>();
    @Output() scoreClick = new EventEmitter<TeamIndex>();

    PLAYER_POSITIONS = PLAYER_POSITIONS;
}
