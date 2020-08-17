import {Component, ElementRef, Input, OnInit} from '@angular/core';

import anime from 'animejs';

@Component({
  selector: 'app-particles',
  templateUrl: './particles.component.html',
  styleUrls: ['./particles.component.scss']
})
export class ParticlesComponent implements OnInit {
  /*
  * In this component we want to create a particle system that has a natural inverse square
  * physics functionality to the cursor and with the configurable option on the interaction
  * with each other.
  *
  * Ofcourse the interaction between point particles with have a performance overhead with
  * the application which is why we should analyze and constraint as seen necessary.
  * */

  /* Let us begin by allowing the configuration of each particle
  * 1. we will allow the particle to have a size in pixels.
  * 2. we will allow the particle to be described by an icon which we will render as an img
  * tag.
  *
  * The particles inertia will be determined as a derivation of the size of the particle
  * definition. */

  /* So if instead the user of the component defines the particles as a number then we will
  * create the defined number of particles using a default configuration */
  @Input()
  builder: () => Promise<any>;

  particles: object[];
  /* Here the user will specify the general center in percentage of the particle generation */
  @Input()
  center: {x: number, y: number};

  private minions: Element[];
  private cursor: {x: number, y: number} = {x: 0, y: 0};

  constructor(private element: ElementRef) { }

  ngOnInit(): void {
    this.builder()
      .then(async (particles) => {
        this.particles = particles;

        /**
         * We need to provide this await call to allow the DOM to update
         */
        await new Promise((resolve) => (setTimeout(resolve, 8)));

        return this.initialize().then(() => this.primephysics());
      });
  }

  private async initialize() {
    /*
    * We will use this function to establish the physics on each particle generated in the ngFor
    * loop.
    * */
    const element = this.element.nativeElement as HTMLElement;
    this.minions = Array.from(element.children);

    /* Okay let us start by dispersing the particles across a small space to make sure we do not
    * encounter any errors.
    * */
    anime({
      targets: [this.minions],
      left: (_) => Math.random() * 512 - 256 + window.innerWidth * 0.8,
      top: (_) => Math.random() * 512 - 256 + window.innerHeight * 0.4,

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
      const r = Math.sqrt((pointa.px - pointb.px) ** 2 +  (pointa.py - pointb.py) ** 2);

      const h = 1;
      const g = 1e1;
      const e = 1e1;
      const x = 1e-10;
      const dx = axis ? pointa.px - pointb.px : pointa.py - pointb.py;
      /*
      * Here we separate the responsible forces into components using arrow functions. */
      const repulsive = () => {
        return 5 * h ** 2 * (g * (dx / r ** 3)) - dx * r ** 2 * x + dx * (Math.random() - 0.5) * 1e-4;
      };
      const cursive = () => {
        const cr = Math.sqrt((pointa.px - this.cursor.x) ** 2 +  (pointa.py - this.cursor.y) ** 2);
        const cx = axis ? pointa.px - this.cursor.x : pointa.py - this.cursor.y;

        return cr > 440 ? 0 : e * (h ** 2) * (g * (cx / cr ** 3));
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
      const friction = 0.99;

      particle.thread = setInterval((_) => {
        /* So here we need to get the position of this particle as well as the position of other
        * particles to begin our computation. */

        this.minions.filter((p: any) => p !== particle)
          .forEach((partner: any) => {

            particle.px = particle.px + particle.vx;
            particle.py = particle.py + particle.vy;

            particle.vx = particle.vx * friction + force(particle, partner, true) + boundary(particle, true);
            particle.vy = particle.vy * friction + force(particle, partner, false) + boundary(particle, false);

            particle.setAttribute('style', `left: ${particle.px}px; top: ${particle.py}px`);
          });
      }, 32);

      return particle;
    });
  }
}
