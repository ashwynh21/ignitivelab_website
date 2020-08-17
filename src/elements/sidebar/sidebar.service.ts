import { Injectable } from '@angular/core';
import {Observable, ReplaySubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  private static toggler = false;
  private static emitter = new ReplaySubject<boolean>();

  constructor() { }

  static toggle() {
    this.emitter.next(!this.toggler);

    this.toggler = !this.toggler;
  }
  static get events(): Observable<boolean> {
    return SidebarService.emitter.asObservable();
  }
}
