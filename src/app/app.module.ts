import { BrowserModule } from '@angular/platform-browser';
import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';

import { AppComponent } from './app.component';
import {ElementsModule} from '../elements/elements.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AppRouter} from './app.router';
import {HashLocationStrategy, LocationStrategy} from '@angular/common';

@NgModule({
	declarations: [
		AppComponent,
	],
	imports: [
		BrowserModule,
		AppRouter,
		BrowserAnimationsModule,
		ElementsModule,
	],
	providers: [
		{provide: LocationStrategy, useClass: HashLocationStrategy}
	],
	bootstrap: [AppComponent],

	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
