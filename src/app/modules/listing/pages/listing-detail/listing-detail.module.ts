import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListingDetailPageRoutingModule } from './listing-detail-routing.module';

import { ListingDetailPage } from './listing-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListingDetailPageRoutingModule
  ],
  declarations: [ListingDetailPage]
})
export class ListingDetailPageModule {}
