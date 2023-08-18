import { NgModule } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { ColorPickerModule } from 'primeng/colorpicker';
import { DialogModule } from 'primeng/dialog';
import { ListboxModule } from 'primeng/listbox';
import { MenuModule } from 'primeng/menu';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';

@NgModule({
    declarations: [],
    imports: [],
    exports: [
        ButtonModule,
        InputNumberModule,
        InputTextModule,
        ColorPickerModule,
        DialogModule,
        ListboxModule,
        MenuModule,
        ConfirmDialogModule
    ],
    providers: [ConfirmationService]
})
export class PrimengModule {}
