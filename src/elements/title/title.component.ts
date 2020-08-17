import {AfterViewInit, Component, ElementRef, HostBinding, Input, OnInit} from '@angular/core';
import {CursorService} from '../cursor/cursor.service';

@Component({
  selector: 'app-title',
  templateUrl: './title.component.html',
  styleUrls: ['./title.component.scss', '../reveal.component.scss']
})
export class TitleComponent implements AfterViewInit, OnInit {
  @Input()
  delay;
  /* This variable will be used to set the cursor highlight. */
  @Input()
  highlight: boolean;
  /* We now need a variable that will allow the user to set a light version
  * of the element. That is, remove the left tag. */
  @Input()
  left = true;

  @HostBinding('style.--animation-delay')
  private animation;

  @Input()
  @HostBinding('class')
  private color = 'accent';

  constructor(private element: ElementRef) {}

  ngOnInit(): void {
    this.animation = `var(--delay, ${this.delay}ms)`;
  }

  ngAfterViewInit(): void {
    if (this.highlight) {
      CursorService.initialize(this.element.nativeElement as HTMLElement);
    }
  }

}
