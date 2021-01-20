import {Injectable} from '@angular/core';
import {Observable, ReplaySubject} from 'rxjs';

@Injectable()
export class CursorService {
  private static emitter = new ReplaySubject<Event>();
  constructor() {
  	/**/
  }

  static emit(event: Event) {
  	this.emitter.next(event);
  }
  static initialize(element: HTMLElement) {
  	['mouseover', 'mouseout']
  		.forEach(
  			(type: string) => (element)
  				.addEventListener(type, (e) => CursorService.emit(e))
  		);
  }
  static get events(): Observable<Event> {
  	return CursorService.emitter.asObservable();
  }
}
