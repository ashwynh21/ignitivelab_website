import {Component, ElementRef, ViewChild} from '@angular/core';
import {RouteConfigLoadEnd, Router, RouterEvent} from '@angular/router';

import {filter} from 'rxjs/operators';
import {LogoComponent} from '../logo/logo.component';
import anime from 'animejs';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent {
  /*
  * Let us get the instance of the logo so we can start animating it.
  * */
  @ViewChild('logo') logo: LogoComponent;
  @ViewChild('text') text: ElementRef<HTMLParagraphElement>;

  loadstring = 'LOADING';
  timer: any;

  constructor(private router: Router) {
    const events = router.events;
    /* So here let us start the logo animation */

    events.pipe(filter(event => event instanceof RouteConfigLoadEnd))
      .subscribe(
      async (_: RouterEvent) => {
        setTimeout(() => {
          this.loaded();
          this.logo.stopanimation()
            .then(() => {
              this.navigate();
            });
        }, 2400);
      },
      (e) => console.error(e),
      );

    this.initload();
  }

  /*
  * We thus create a callback function that will be parsed to the logo so that when the observable triggers
  * the animation is let down properly and the call is made to navigate once the preload for the next
  * module is done.
  * */
  navigate(): Promise<boolean> {
    /*
    * So we then use the router to say that after this component has completed loading we then begin routing to the other module
    * which in this case is the home module.
    */
    return this.router.navigate(['home']);
  }

  initload() {
    this.timer = setInterval(() => {
      let count = this.loadstring.match(/\./g,);
      if(count === null) {
        count = [];
      }

      this.loadstring = `LOADING${'.'.repeat((count.length + 1) % 4)}`;
    }, 512);
  }
  loaded() {
    clearInterval(this.timer);

    return anime({
      targets: this.text.nativeElement,
      opacity: [1, 0],
      duration: 256,
      easing: 'linear'
    }).finished;
  }
}
