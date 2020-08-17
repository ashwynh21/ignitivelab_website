
import {Component, ElementRef, OnInit} from '@angular/core';

import anime from 'animejs';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  state = false;

  constructor(private element: ElementRef) { }

  ngOnInit(): void {
  }

  togglemenu() {
    const menu = this.element.nativeElement.children.menu;
    const svg = menu.children.SVG;
    const bottom = svg.children.bottom;
    const top = svg.children.top;

    function open() {
      anime({
        duration: 750,
        stroke: '#BA1700',
        targets: [bottom],
        points: '11.4,11.4,22,22 32.6,32.6'
      });
      anime({
        duration: 750,
        stroke: '#BA1700',
        targets: [top],
        points: '11.4,32.6 22,22 32.8,11.2'
      });

      anime({
        targets: [menu],
        duration: 250,
        delay: 250,
        easing: 'linear'
      });
      anime({
        targets: [svg],
        delay: 250,
        duration: 1000,
      });
    }
    function close() {
      anime({
        duration: 750,
        stroke: '#BA1700',
        targets: [bottom],
        points: '2.1,17.2,21.3,17.2 40.6,17.2'
      });
      anime({
        duration: 750,
        stroke: '#BA1700',
        targets: [top],
        points: '24.1,28.2 32.3,28.2 40.6,28.2'
      });

      anime({
        targets: [menu],
        duration: 250,
        easing: 'linear'
      });
      anime({
        targets: [svg],
        duration: 1000,
      });
    }

    if(!this.state) {
      this.state = true;
      open();
    } else {
      this.state = false;
      close();
    }
  }
}
