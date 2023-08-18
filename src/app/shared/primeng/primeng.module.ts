import { NgModule } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { ColorPickerModule } from 'primeng/colorpicker';
import { DialogModule } from 'primeng/dialog';
import { ListboxModule } from 'primeng/listbox';

@NgModule({
    declarations: [],
    imports: [],
    exports: [ButtonModule, InputNumberModule, InputTextModule, ColorPickerModule, DialogModule, ListboxModule]
})
export class PrimengModule {}
