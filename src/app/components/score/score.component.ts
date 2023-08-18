import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { Score } from 'src/app/models/score.model';

@Component({
    selector: 'app-score',
    templateUrl: './score.component.html',
    styleUrls: ['./score.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScoreComponent {
    @Input() score!: Score;
    @Output() scoreClick = new EventEmitter<Score>();
}
