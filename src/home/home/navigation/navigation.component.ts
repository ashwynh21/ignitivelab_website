import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {PagerService} from '../../../elements/pager/pager.service';
import {Observable} from 'rxjs';
import anime from 'animejs';
import {SidebarService} from '../../../elements/sidebar/sidebar.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit, AfterViewInit {
  page: Observable<number>;

  @Input()
  items: string[];

  @ViewChild('bar') bar: ElementRef<HTMLDivElement>;

  constructor() { }

  ngOnInit(): void {
    this.page = PagerService.events;
  }

  ngAfterViewInit(): void {
    this.page.subscribe((page) => {

      if (page > 0) {
        anime.timeline({
          targets: this.bar.nativeElement.children,
          duration: 512,
        })
          .add({
            opacity: (t, i) => {
              if(i === page) {
                return 1;
              }
              return 0;
            },
            easing: 'linear'
          })
          .add({
            translateY: -128 * page,
          });
      } else {
        anime.timeline({
          targets: this.bar.nativeElement.children,
          duration: 512,
        })
          .add({
            opacity: 0,
            easing: 'linear'
          })
          .add({
            translateY: 0,
          });

        anime({
          targets: this.bar.nativeElement.children[0],
          duration: 320,
          opacity: 1,
          easing: 'linear',
          delay: 600
        });
      }
    });
  }

  previous() {
    PagerService.previous();
  }

  toggle() {
    SidebarService.toggle();
  }
}
