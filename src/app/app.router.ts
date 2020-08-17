import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {PreloadService} from './preloader/preload.service';

/* To be able to get this working we are going to need to create ProxyComponents in the application */
const routes: Routes = [
  {
    path: '',
    loadChildren: () => import(/* webpackChunkName: "initializer" */ './initializer/initializer.module').then(m => m.InitializerModule),
  },
  {
    path: 'home',
    loadChildren: () => import(/* webpackChunkName: "home" */ '../home/home.module').then(m => m.HomeModule),
    data: {
      preload: true
    }
  },
] as Routes;

@NgModule({
  imports: [RouterModule.forRoot(
    routes,
    {
      initialNavigation: 'enabled',
      relativeLinkResolution: 'corrected',
      preloadingStrategy: PreloadService
    }
  )],
  exports: [RouterModule]
})
export class AppRouter { }
