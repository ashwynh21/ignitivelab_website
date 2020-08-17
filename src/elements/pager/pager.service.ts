import { Injectable } from '@angular/core';
import {Observable, ReplaySubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PagerService {
  static page = 0;

  private static emitter = new ReplaySubject<number>();
  constructor() { }

  static next() {
    this.page = this.page + 1;
    this.emitter.next(this.page);
  }
  static previous() {
    if(this.page > 0) {
      this.page = this.page - 1;
      this.emitter.next(this.page);
    }
  }

  static get events(): Observable<number> {
    return PagerService.emitter.asObservable();
  }
}
