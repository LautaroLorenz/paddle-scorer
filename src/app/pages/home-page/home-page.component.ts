import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { getRandomBrightHexColor } from 'src/app/core/color-generator.core';

@Component({
    templateUrl: './home-page.component.html',
    styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {
    form!: FormGroup;

    private readonly INIT_PLAYERS = 4;

    constructor(private fb: FormBuilder) {
        this.buildForm();
    }

    ngOnInit(): void {
        this.loadFormValue();
    }

    get players(): FormArray {
        return this.form.get('players') as FormArray;
    }

    addPlayerControl(): void {
        this.players.controls.push(
            this.fb.group({
                name: this.fb.control('', [Validators.required]),
                color: this.fb.control(getRandomBrightHexColor(), [Validators.required])
            })
        );
        this.players.updateValueAndValidity();
    }

    removePlayerControl(controlIndex: number): void {
        this.players.removeAt(controlIndex);
        this.players.updateValueAndValidity();
    }

    refreshColors(): void {
        for (let index = 0; index < this.players.controls.length; index++) {
            const playerControl = this.players.controls[index];
            playerControl.get('color')?.setValue(getRandomBrightHexColor());
        }
    }

    startGame(): void {
        this.saveFormValue();
    }

    private loadFormValue(): void {
        const playersLength = +localStorage.getItem('playersLength')! ?? this.INIT_PLAYERS;
        const savedValue = localStorage.getItem('value');
        this.generateInitPlayers(playersLength);
        if (savedValue) {
            const value = JSON.parse(savedValue);
            this.form.setValue(value);
        }
    }

    private saveFormValue(): void {
        localStorage.setItem('playersLength', JSON.stringify(this.players.length));
        localStorage.setItem('value', JSON.stringify(this.form.getRawValue()));
    }

    private buildForm(): void {
        this.form = this.fb.group({
            players: this.fb.array([]),
            score: this.fb.group({
                points: this.fb.control(6, [Validators.min(1), Validators.max(6)]),
                sets: this.fb.control(3, [Validators.min(1), Validators.max(3)])
            })
        });
    }

    private generateInitPlayers(players: number): void {
        for (let index = 0; index < players; index++) {
            this.addPlayerControl();
        }
    }
}
