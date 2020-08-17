import {AfterViewInit, Component, ElementRef, HostBinding, Input} from '@angular/core';

import anime from 'animejs';

@Component({
  selector: 'app-logo',
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.scss']
})
export class LogoComponent implements AfterViewInit {

  /*
  * We are going to need reference to the component to be able to make and apply the animations.
  */
  constructor(private element: ElementRef) { }
  /*
  * The logo will first need to be sized out properly so let us have a size field input that will have a default value.
  */
  @Input()
  size = 64;
  @Input()
  animate = false;
  /* Here the user will specify the general center in percentage of the particle generation */
  @Input()
  center: {x: number, y: number};

  private minions: Element[];
  private cursor: {x: number, y: number} = {x: 0, y: 0};
  /*
  * We will also want to parse a customizable primary and accent color.
  */
  @Input() primary = '#4D4D4D';
  @Input() accent = '#3786E5';

  @HostBinding('style.width.px')
  private width = 102.7 / 71.7 * this.size;
  @HostBinding('style.height.px')
  private height = this.size;

  async ngAfterViewInit(): Promise<void> {
    if(this.animate) {
      this.initialize(this.element.nativeElement).then(() => this.primephysics());
    }
  }

  /*
  * This function we keep to initialize the logo, this is because we were able to expand the viewport to cover the screen, the problem
  * with this is that we now need to position the logo group so that it centers in the screen.
  */
  private async initialize(element: HTMLElement) {
    const group = (element.children as any).logo;

    /*
    * We will use this function to establish the physics on each particle generated in the ngFor
    * loop.
    * */
    this.minions = Array.from(group.children);

    /* Okay let us start by dispersing the particles across a small space to make sure we do not
    * encounter any errors.
    * */
    anime({
      targets: [this.minions],
      translateX: (_) => Math.random() * 256 - 128 + window.innerWidth * 0.46,
      translateY: (_) => Math.random() * 256 - 128 + window.innerHeight * 0.4,

      duration: 0
    });
    anime({
      targets: element,
      opacity: [0, 1],
      delay: 1024,
      duration: 2048
    });

    /* Then let us set the initial condition variables for each particle here */
    this.minions = this.minions.map((particle: any) => {
      /* Here we should set the initial conditions of the particle */
      particle.px = particle.getBoundingClientRect().x;
      particle.py = particle.getBoundingClientRect().y;
      particle.vx = 0;
      particle.vy = 0;
      particle.rotate = Math.random() * 360 - 180;

      return particle;
    });

    /* Let us also set the document cursor listener to update the cursor object */
    document.addEventListener('mousemove', (event) => {
      this.cursor = {x: event.clientX, y: event.clientY};
    });
  }

  private primephysics() {
    /* Here we need to create multiple asynchronous threads that will be assigned
    * to manage each particle. */

    const force = (pointa, pointb, axis: boolean) => {
      const r = Math.sqrt((pointa.px - pointb.px) ** 2 + (pointa.py - pointb.py) ** 2);

      const h = 1;
      const g = 1e1;
      const e = Math.random() * 1e1;
      const x = 1e-10;
      const dx = axis ? pointa.px - pointb.px : pointa.py - pointb.py;

      const center = () => {
        const c = Math.sqrt((window.innerWidth / 2 - pointa.px) ** 2 + (window.innerHeight / 2 - pointa.py));
        const cx = axis ? window.innerWidth / 2 - pointa.px : window.innerHeight / 2 - pointa.py;
        const result = cx / c ** 3;

        if(isNaN(result)) return 0;

        return -result;
      };
      /*
      * Here we separate the responsible forces into components using arrow functions. */
      const repulsive = () => {
        return h ** 2 * (g * (dx / r ** 3))
          - 1E1 * dx * r ** 2 * x + dx * (Math.random() - 0.5) * 1e-4;
      };
      const cursive = () => {
        const cr = Math.sqrt((pointa.px - this.cursor.x) ** 2 +  (pointa.py - this.cursor.y) ** 2);
        const cx = axis ? pointa.px - this.cursor.x : pointa.py - this.cursor.y;

        return cr > window.innerWidth * 0.2 ? 0 : 10 * e * (h ** 2) * (g * (cx / cr ** 3));
      };

      return repulsive() + cursive();
    };
    const boundary = (pointa, axis) => {
      let result = 0;
      const margin = 16;

      if (axis) {
        if (pointa.px <= margin) { result += margin - pointa.px; }
        else if (pointa.px >= window.innerWidth - margin) { result += (window.innerWidth - margin - pointa.px); }

        return result;
      }
      if (pointa.py <= margin) { result += margin - pointa.py; }
      else if (pointa.py >= window.innerHeight - margin) { result += (window.innerHeight - margin - pointa.py); }

      return result;
    };

    this.minions = this.minions.map((particle: any) => {
      const friction = 0.98;

      particle.thread = setInterval((_) => {
        /* So here we need to get the position of this particle as well as the position of other
        * particles to begin our computation. */

        this.minions.filter((p: any) => p !== particle)
          .forEach((partner: any) => {

            particle.px = particle.px + particle.vx;
            particle.py = particle.py + particle.vy;

            particle.vx = particle.vx * friction + force(particle, partner, true) + boundary(particle, true);
            particle.vy = particle.vy * friction + force(particle, partner, false) + boundary(particle, false);

            particle.rotate = particle.rotate + (particle.rotate < 0 ? -1 : 1) * ((Math.random()) * 0.1);

            particle.setAttribute('style', `transform: translateX(${particle.px}px) translateY(${particle.py}px) rotateZ(${particle.rotate}deg)`)

          });
      }, 32);

      return particle;
    });
  }

  public stopanimation() {
    return Promise.all(this.minions.reverse().map(m => {
      return new Promise((resolve) => {
        setTimeout(() => {
          clearInterval((m as any).thread);
          m.setAttribute('style', `transform: translateX(${window.innerWidth * 0.5 - 32 - 32}px) translateY(${window.innerHeight * 0.5 - 64}px) rotateZ(0deg); transition-duration: 0.32s;`);

          setTimeout(resolve, 256);
        }, (this.minions.indexOf(m) + 1) * 64 + 256);
      });
    }))
      .then(async () => {
        await anime({
          targets: this.minions,
          scale: [1, 0],
          opacity: [1, 0],
          translateX: window.innerWidth * 0.5,
          translateY: window.innerHeight * 0.5,
          duration: 256,
          delay: 128,
          easing: 'linear'
        }).finished;

        return new Promise(resolve => setTimeout(resolve, 388));
      });

  }
}
