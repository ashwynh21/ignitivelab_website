import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from './loader/loader.component';
import { InitializerRouter } from './initializer.router';
import { LogoComponent } from './logo/logo.component';

@NgModule({
  declarations: [LoaderComponent, LogoComponent],
  imports: [
    CommonModule,

    InitializerRouter
  ],
  exports: [
    LogoComponent
  ]
})
export class InitializerModule { }
