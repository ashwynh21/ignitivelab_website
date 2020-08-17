import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { HomeRouter } from './home.router';
import { NavigationComponent } from './home/navigation/navigation.component';
import { ElementsModule } from '../elements/elements.module';
import { GreetingComponent } from './home/greeting/greeting.component';
import {InitializerModule} from '../app/initializer/initializer.module';



@NgModule({
  declarations: [HomeComponent, NavigationComponent, GreetingComponent],
    imports: [
        CommonModule,

        HomeRouter,
        ElementsModule,
        InitializerModule
    ]
})
export class HomeModule { }
