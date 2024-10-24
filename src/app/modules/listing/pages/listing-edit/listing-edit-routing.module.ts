import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListingEditPage } from './listing-edit.page';

const routes: Routes = [
  {
    path: '',
    component: ListingEditPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListingEditPageRoutingModule {}
