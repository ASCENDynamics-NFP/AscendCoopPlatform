import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ContactInformationComponent } from './contact-information.component';

@NgModule({
  declarations: [ContactInformationComponent],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [ContactInformationComponent]
})
export class ContactInformationModule { }
