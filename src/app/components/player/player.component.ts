import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { Player } from 'src/app/models/player.model';
import { Team } from 'src/app/models/team.model';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlayerComponent {
  @Input() player!: Player;
  @Input() team!: Team;
  @Output() playerClick = new EventEmitter<Player>(); 
}
