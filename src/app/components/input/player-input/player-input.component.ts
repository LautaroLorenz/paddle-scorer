import { Component, ChangeDetectionStrategy, SkipSelf, Input, OnInit, OnDestroy } from '@angular/core';
import { ControlValueAccessor, FormArrayName, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'app-player-input',
    templateUrl: './player-input.component.html',
    styleUrls: ['./player-input.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: PlayerInputComponent,
            multi: true
        }
    ]
})
export class PlayerInputComponent implements ControlValueAccessor, OnInit, OnDestroy {
    formGroup!: FormGroup;
    @Input() public formGroupName!: string;

    private _onChange!: (value: any) => void;
    private _onTouched!: (value: any) => void;
    private _onDestroy = new Subject<void>();

    constructor(@SkipSelf() public formArranyName: FormArrayName) {}

    ngOnInit(): void {
        if (!this.formGroupName) {
            throw new Error('undefined @Input formGroupName');
        }
        if (!this.formArranyName) {
            throw new Error('undefined container formArranyName');
        }
        this.formGroup = this.formArranyName.control.get(this.formGroupName) as FormGroup;
        if (!this.formGroup) {
            throw new Error(`undefined control ${this.formGroupName} of array ${this.formArranyName}`);
        }
        this.formGroup.valueChanges.pipe(takeUntil(this._onDestroy)).subscribe(() => {
            this.formArranyName.control.updateValueAndValidity();
        });
    }

    writeValue(value: any) {}

    registerOnChange(fn: (value: any) => void) {
        this._onChange = fn;
    }

    registerOnTouched(fn: (value: any) => void) {
        this._onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {}

    ngOnDestroy(): void {
        this._onDestroy.next();
        this._onDestroy.complete();
    }
}
