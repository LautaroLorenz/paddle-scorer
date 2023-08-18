import { NgModule } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { ColorPickerModule } from 'primeng/colorpicker';
import { DragDropModule } from 'primeng/dragdrop';

@NgModule({
    declarations: [],
    imports: [],
    exports: [ButtonModule, InputNumberModule, InputTextModule, ColorPickerModule, DragDropModule]
})
export class PrimengModule {}
