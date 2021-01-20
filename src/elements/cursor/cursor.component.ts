import {Component, ElementRef, OnInit} from '@angular/core';
import {CursorService} from './cursor.service';

import {fromEvent} from 'rxjs';
import {filter} from 'rxjs/operators';

import anime from 'animejs';

@Component({
	selector: 'app-cursor',
	templateUrl: './cursor.component.html',
	styleUrls: ['./cursor.component.scss']
})
export class CursorComponent implements OnInit {
	/*
  * To begin, since we want to get the motion of the custom cursor system going here
  * we will need to create an event listener for mousing to be able to get the cursor
  * of the event object
  * */

  /*
  * Let us keep a global of the animation object so we dont have overlapping animations
  * and before we start a new one we are able to kill the old one.
  * */
  private animation: anime.AnimeInstance;

  constructor(private element: ElementRef) { }

  ngOnInit(): void {
  	this.initialize();
  }

  private initialize() {
  	/* Here we setup a listener on the body for mouse motion to be able to animate the artificial cursor
    * properly
    * */
  	this.docmousemove();
  	this.docmouseclick();

  	/*
    * We now need to subscribe to the cursor service
    * */
  	this.mouseover();
  	this.mouseout();

  	/* We need to trigger the animation to get it transformed out smoothly */
  	document.body.click();
  }

  private mouseover() {
  	const halo = this.element.nativeElement.children.halo as HTMLElement;

  	CursorService.events.
  		pipe(filter((event: any) => event.type === 'mouseover'))
  		.subscribe(
  			() => {
  				this.kill();

  				this.animation = anime({targets: [halo], width: 48, height: 48, translateX: -24, translateY: -24});
  			}, e => console.error(e)
  		);
  }
  private mouseout() {
  	const halo = this.element.nativeElement.children.halo as HTMLElement;

  	CursorService.events.
  		pipe(filter((event: any) => event.type === 'mouseout'))
  		.subscribe(
  			() => {
  				this.kill();

  				this.animation = anime({targets: [halo], width: 20, height: 20, translateX: -12, translateY: -12});
  			}, e => console.error(e)
  		);
  }

  private docmousemove() {
  	const halo = this.element.nativeElement.children.halo as HTMLElement;
  	const pointer = this.element.nativeElement.children.pointer as HTMLElement;

  	fromEvent(document.body, 'mousemove')
  		.subscribe((event: any) => {
  			/* Then this will be the tail halo that we have made also */
  			anime({
  				targets: [halo],
  				left: event.pageX,
  				top: event.pageY,
  				easing: 'cubicBezier(0,.7,.3,1)',
  				duration: 720,
  			});
  			/* moving cursor pointer */
  			anime({
  				targets: [pointer],
  				left: event.pageX,
  				top: event.pageY,
  				duration: 0
  			});
  		});
  }
  private docmouseclick() {
  	const halo = this.element.nativeElement.children.halo as HTMLElement;

  	let oldsize = halo.getBoundingClientRect().width;
  	let newsize = halo.getBoundingClientRect().width;

  	const mousedown = (a: number, b: number) => {
  		return [
  			{value: b, easing: 'easeOutCubic', duration: 144}
  		];
  	};
  	const mouseup = (a: number) => {
  		return [
  			{value: a, easing: 'easeOutCubic', duration: 144},
  		];
  	};

  	document.body.addEventListener('mousedown', () => {
  		oldsize = halo.getBoundingClientRect().width;

  		this.kill();

  		this.animation = anime({
  			targets: [halo],
  			width: mousedown(oldsize, oldsize + 20),
  			height: mousedown(oldsize, oldsize + 20),
  			translateX: mousedown(-oldsize / 2, -(oldsize + 20) / 2),
  			translateY: mousedown(-oldsize / 2, -(oldsize + 20) / 2),
  		});
  	}, true);
  	document.body.addEventListener('mouseup', () => {
  		newsize = halo.getBoundingClientRect().width;

  		this.kill();

  		this.animation = anime({
  			targets: [halo],
  			width: mouseup(oldsize),
  			height: mouseup(oldsize),
  			translateX: mouseup(-(oldsize) / 2),
  			translateY: mouseup(-(oldsize) / 2),
  		});
  	}, true);
  }

  private kill() {
  	if (this.animation) { this.animation.pause(); }
  }
}
