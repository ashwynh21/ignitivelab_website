import {Component, ElementRef, OnInit} from '@angular/core';
import {SidebarService} from './sidebar.service';
import anime from 'animejs';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  constructor(private element: ElementRef) { }

  ngOnInit(): void {
    anime({
      targets: this.element.nativeElement,
      translateX: 0.76 * window.innerWidth,
      easing: 'easeOutElastic',
      duration: 0,
    });
    SidebarService.events.subscribe((toggle) => {
      anime({
        targets: this.element.nativeElement,
        translateX: (!toggle ? 0.76 : 0.38) * window.innerWidth,
        easing: 'easeOutElastic'
      })
    })
  }

}
