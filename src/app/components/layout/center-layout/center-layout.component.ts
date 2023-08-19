import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-center-layout',
  templateUrl: './center-layout.component.html',
  styleUrls: ['./center-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CenterLayoutComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
