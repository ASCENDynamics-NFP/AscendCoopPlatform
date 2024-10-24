import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListingEditPageRoutingModule } from './listing-edit-routing.module';

import { ListingEditPage } from './listing-edit.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListingEditPageRoutingModule
  ],
  declarations: [ListingEditPage]
})
export class ListingEditPageModule {}
