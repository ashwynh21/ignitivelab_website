import {AfterViewInit, Component, ElementRef, OnInit} from '@angular/core';
import {PagerService} from '../pager/pager.service';
import anime from 'animejs';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss']
})
export class SliderComponent implements AfterViewInit {

  constructor(private element: ElementRef) { }

  ngAfterViewInit(): void {
    PagerService.events.subscribe((page) => {
      anime.timeline({
        targets: this.element.nativeElement.children,
        duration: 280,
        easing: 'linear'
      })
        .add({
          opacity: 0,
        })
        .add({
          translateX: -window.innerWidth * page
        })
        .add({
          opacity: 1,
        });
    });
  }

}
