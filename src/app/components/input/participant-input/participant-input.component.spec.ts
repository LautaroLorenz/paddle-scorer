import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipantInputComponent } from './participant-input.component';

describe('ParticipantInputComponent', () => {
    let component: ParticipantInputComponent;
    let fixture: ComponentFixture<ParticipantInputComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ParticipantInputComponent]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ParticipantInputComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
