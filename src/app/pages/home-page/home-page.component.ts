import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { getRandomBrightHexColor } from 'src/app/core/color-generator.core';
import { GameService } from 'src/app/services/game.service';

@Component({
    templateUrl: './home-page.component.html',
    styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {
    form!: FormGroup;

    private readonly INIT_PLAYERS = 4;

    constructor(
        private fb: FormBuilder,
        private gameService: GameService,
        private router: Router
    ) {
        this.buildForm();
    }

    ngOnInit(): void {
        this.loadFormValue();
    }

    get participants(): FormArray {
        return this.form.get('participants') as FormArray;
    }

    addParticipantControl(): void {
        this.participants.controls.push(
            this.fb.group({
                id: this.fb.control(this.participants.controls.length, [Validators.required]),
                name: this.fb.control('', [Validators.required]),
                color: this.fb.control(getRandomBrightHexColor(), [Validators.required])
            })
        );
        this.participants.updateValueAndValidity();
    }

    removeParticipantControl(controlIndex: number): void {
        this.participants.removeAt(controlIndex);
        this.participants.updateValueAndValidity();
    }

    refreshColors(): void {
        for (let index = 0; index < this.participants.controls.length; index++) {
            const participantControl = this.participants.controls[index];
            participantControl.get('color')?.setValue(getRandomBrightHexColor());
        }
    }

    startGame(): void {
        this.saveFormValue();
        const { participants, goalScore } = this.form.getRawValue();
        this.gameService.initGame(participants, goalScore);
        this.router.navigate(['game']);
    }

    private loadFormValue(): void {
        const participantsLength = localStorage.getItem('participantsLength');
        const savedValue = localStorage.getItem('settings');
        this.generateParticipants(participantsLength ? +participantsLength : this.INIT_PLAYERS);
        if (savedValue) {
            const value = JSON.parse(savedValue);
            this.form.setValue(value);
        }
    }

    private saveFormValue(): void {
        localStorage.setItem('participantsLength', JSON.stringify(this.participants.length));
        localStorage.setItem('settings', JSON.stringify(this.form.getRawValue()));
    }

    private buildForm(): void {
        this.form = this.fb.group({
            participants: this.fb.array([]),
            goalScore: this.fb.group({
                points: this.fb.control(6, [Validators.min(1), Validators.max(6)]),
                sets: this.fb.control(3, [Validators.min(1), Validators.max(3)]),
                counter: this.fb.control(0, [Validators.required])
            })
        });
    }

    private generateParticipants(participantsLength: number): void {
        for (let index = 0; index < participantsLength; index++) {
            this.addParticipantControl();
        }
    }
}
