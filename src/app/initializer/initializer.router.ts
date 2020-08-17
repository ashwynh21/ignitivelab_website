import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {LoaderComponent} from './loader/loader.component';

const routes: Routes = [
  {
    path: '',
    component: LoaderComponent
  },
] as Routes;

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InitializerRouter { }
