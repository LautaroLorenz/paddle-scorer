import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { Player } from 'src/app/models/player.model';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlayerComponent {
  @Input() player!: Player;
  @Output() playerClick = new EventEmitter<Player>(); 
}
