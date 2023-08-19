import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParticipantInputComponent } from './participant-input.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
    declarations: [ParticipantInputComponent],
    imports: [CommonModule, SharedModule],
    exports: [ParticipantInputComponent]
})
export class ParticipantInputModule {}
