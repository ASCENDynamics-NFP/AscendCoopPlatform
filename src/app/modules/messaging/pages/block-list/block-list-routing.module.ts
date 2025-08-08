import {NgModule} from "@angular/core";
import {Routes, RouterModule} from "@angular/router";
import {BlockListPageComponent} from "./block-list.page";

const routes: Routes = [
  {
    path: "",
    component: BlockListPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BlockListPageRoutingModule {}
