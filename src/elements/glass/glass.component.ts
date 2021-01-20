import {AfterViewInit, Component, ContentChild, ElementRef, Input, OnInit} from '@angular/core';
import {distinctUntilChanged} from 'rxjs/operators';
import anime from 'animejs';
import {fromEvent, merge} from 'rxjs';

@Component({
	selector: 'app-glass',
	templateUrl: './glass.component.html',
	styleUrls: ['./glass.component.scss']
})
export class GlassComponent implements OnInit, AfterViewInit {
  @ContentChild('content') content: ContentChild;

  @Input('focus') focus;
  @Input('dampener') dampener: number;
  /*
  * The content child that we have above here will be used to reveal when the user mouses over a said component.
  * */

  constructor(private element: ElementRef) {
  	/**/
  }

  ngOnInit(): void {
  	/**/
  }
  ngAfterViewInit(): void {
  	this.mousemove();
  }

  private mousemove() {
  	const content = this.element.nativeElement as HTMLElement;
  	const focal = this.focus.element.nativeElement as HTMLElement;

  	fromEvent(document.body, 'mousemove')
  		.subscribe((event: any) => {

  			anime({
  				targets: [content],
  				left: event.pageX - content.getBoundingClientRect().width / 2,
  				top: event.pageY - content.getBoundingClientRect().height / 2,
  				easing: 'cubicBezier(0,.7,.3,1)',
  				duration: 720,
  			});
  		});

  	merge(
  		fromEvent(document.body, 'mousemove'),
  		fromEvent(document.body, 'mouseover'),
  		fromEvent(document.body, 'mouseout')
  	)
  		.pipe(distinctUntilChanged())
  		.subscribe(() => {

  			/*
        * so here we check if the cursor if over the focus element and then decide to reveal or not...
        * */
  			if(this.within(content.getBoundingClientRect(), focal.getBoundingClientRect(), this.dampener)) {
  				anime({
  					targets: [content],
  					duration: 320,
  					easing: 'easeOutCubic',
  					scale: 1,
  					opacity: 1,
  				});
  			} else {
  				anime({
  					targets: [content],
  					duration: 320,
  					easing: 'easeOutCubic',
  					scale: 0,
  					opacity: 0,
  				});
  			}
  		});
  }

  private within(a: DOMRect, b: DOMRect, dampener: number): boolean {
  	return a.left > (b.left - dampener) && a.right < (b.right + dampener) && a.top < (b.top + dampener) && a.bottom > (b.bottom - dampener);
  }
}
