import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { take } from 'rxjs';
import { getRandomBrightHexColor } from 'src/app/core/color-generator.core';
import { GameSettings } from 'src/app/models/game-settings.model';
import { GameSettingsService } from 'src/app/services/game-settings.service';

@Component({
    templateUrl: './home-page.component.html',
    styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {
    gameSettingsForm!: FormGroup;

    constructor(
        private fb: FormBuilder,
        private gameSettingsService: GameSettingsService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.gameSettingsService.gameSettings$.pipe(take(1)).subscribe((gameSeetings: GameSettings) => {
            this.buildGameSettingsForm(gameSeetings);
        });
    }

    get participants(): FormArray {
        return this.gameSettingsForm.get('participants') as FormArray;
    }

    addParticipantControl(): void {
        let id: number = 0;
        if (this.participants.controls.length) {
            id = this.participants.controls[this.participants.controls.length - 1].get('id')?.value + 1;
        }
        this.participants.controls.push(
            this.fb.group({
                id: this.fb.control(id, [Validators.required]),
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
        const gameSettings: GameSettings = this.gameSettingsForm.getRawValue();
        this.gameSettingsService.saveGameSettingsOnStorage(gameSettings);
        this.router.navigate(['game']);
    }

    private buildGameSettingsForm({ participants, goalScore }: GameSettings): void {
        this.gameSettingsForm = this.fb.group({
            participants: this.fb.array([], [Validators.minLength(4)]),
            goalScore: this.fb.group({
                points: this.fb.control(goalScore.points, [Validators.min(1), Validators.max(6)]),
                sets: this.fb.control(goalScore.sets, [Validators.min(1), Validators.max(3)])
            })
        });
        for (let index = 0; index < participants.length; index++) {
            const participant = participants[index];
            this.addParticipantControl();
            this.participants.controls[index].setValue(participant);
        }
    }
}
