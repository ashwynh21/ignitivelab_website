import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import anime from 'animejs';
import {Observable} from 'rxjs';
import {PagerService} from './pager.service';

@Component({
  selector: 'app-pager',
  templateUrl: './pager.component.html',
  styleUrls: ['./pager.component.scss']
})
export class PagerComponent implements AfterViewInit {
  @ViewChild('red') red: ElementRef<HTMLDivElement>;
  @ViewChild('center') center: ElementRef<HTMLDivElement>;

  private cursor: {x: number, y: number} = {x: 0, y: 0};
  private page: Observable<number>;

  constructor(private element: ElementRef) { }

  ngAfterViewInit(): void {
    this.initialize();
    this.prime();

    this.page = PagerService.events;
    this.page.subscribe((page) => {
      if (page === 1) {
        anime({
          targets: this.red.nativeElement,
          translateX: window.innerWidth / 2 - this.red.nativeElement.getBoundingClientRect().width * 0.64,
          translateY: window.innerHeight / 2,
          scale: 1.64
        });
      } else if (page === 0) {
        anime({
          targets: this.red.nativeElement,
          translateX: 0,
          translateY: 0,
          scale: 1
        });
      } else {
        anime({
          targets: this.red.nativeElement,
          scale: [1.8, 1.64],
          duration: 1800,
        });
      }
    });
  }

  /*
  so we need to make a gravity system that works with a spring effect
   */

  initialize() {
    const target = (this.center.nativeElement as any);
    const margin = this.red.nativeElement.getBoundingClientRect();

    /*
    let us initialize the component element with the position given;
     */
    target.px = (margin.left + margin.width / 2);
    target.py = (margin.top + margin.height / 2);

    target.vx = 0;
    target.vy = 0;

    document.addEventListener('mousemove', (event) => {
      /*
      now let us create a force equation
       */
      this.cursor = {x: event.clientX, y: event.clientY};
    });
  }

  prime() {
    const margin = this.red.nativeElement.getBoundingClientRect();
    const target = (this.center.nativeElement as any);

    const hookes = () => {
      const padding = target.getBoundingClientRect();
      const k = 1.42E1;

      const position = {
        x: (margin.left + margin.width / 2) - this.cursor.x,
        y: (margin.top + margin.height / 2) - this.cursor.y
      };

      const spring = {
        x: ((margin.left + margin.width / 2) - (target.px + padding.width / 2)) * k,
        y: ((margin.top + margin.height / 2) - (target.py + padding.height / 2)) * k * 0.5
      };
      const cursor = {
        x: -position.x,
        y: -position.y
      };

      const helper = (axis: 'x' | 'y') => {
        let result = 0;

        /*
        we need to convert the square to a circle using the general circle equation
        x**2 + y**2 = r**2
         */
        const circle = (y: number) => {
          const r = margin.width / 2;
          const a  = margin.left + margin.width / 2;
          const b = margin.top + margin.height / 2;

          const q = Math.sqrt(r**2 - (y - b)**2);

          return [
            q + a,

          ];
        }

        if (axis === 'x') {
          if (target.px <= margin.left) { result += margin.left - target.px; }
          else if (target.px >= (margin.right - padding.width)) { result += ((margin.right - padding.width) - target.px); }

          return result;
        } else {
          if (target.py <= margin.top) { result += margin.top - target.py; }
          else if (target.py >=( margin.bottom - padding.height)) { result += ((margin.bottom - padding.height) - target.py); }

          return result;
        }
      }
      const boundary = {
        x: helper('x'),
        y: helper('y'),
      };

      return {
        x: (spring.x + cursor.x) * 1E-3 + boundary.x,
        y: (spring.y + cursor.y) * 1E-3 + boundary.y
      };
    };

    setInterval(() => {

      target.px = target.px + target.vx;
      target.py = target.py + target.vy;

      target.vx = target.vx * 0.97 + hookes().x;
      target.vy = target.vy * 0.97 + hookes().y;

      this.center.nativeElement.setAttribute('style', `left: ${target.px}px; top: ${target.py}px;`);

    }, 32);
  }

  /*
  now let us make a function that will move the circle to a paging state...
   */
  next() {
    PagerService.next();
  }
}
