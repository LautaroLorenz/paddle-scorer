import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { Point } from 'src/app/models/point.model';
import { Score } from 'src/app/models/score.model';

@Component({
    selector: 'app-score',
    templateUrl: './score.component.html',
    styleUrls: ['./score.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScoreComponent {
    @Input() score!: Score;
    @Input() point!: Point;
    @Output() scoreClick = new EventEmitter<void>();
}
