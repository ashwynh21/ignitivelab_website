import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { HomeRouter } from './home.router';
import { NavigationComponent } from './navigation/navigation.component';
import { ElementsModule } from '../elements/elements.module';
import { GreetingComponent } from './greeting/greeting.component';
import {InitializerModule} from '../app/initializer/initializer.module';
import { ApplicationComponent } from './application/application.component';



@NgModule({
	declarations: [HomeComponent, NavigationComponent, GreetingComponent, ApplicationComponent],
	imports: [
		CommonModule,

		HomeRouter,
		ElementsModule,
		InitializerModule
	]
})
export class HomeModule { }
