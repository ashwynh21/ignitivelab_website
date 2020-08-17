import {AfterViewInit, Component, ElementRef, HostBinding, Input, OnInit} from '@angular/core';
import {CursorService} from '../cursor/cursor.service';

@Component({
  selector: 'app-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.scss', '../reveal.component.scss']
})
export class TextComponent implements OnInit, AfterViewInit {
  @Input()
  delay;
  @Input()
  highlight: boolean;
  @Input()
  @HostBinding('class')
  private color = 'accent';

  @HostBinding('style.--animation-delay')
  private animation;

  constructor(private element: ElementRef) {}

  ngOnInit(): void {
    this.animation = `var(--delay, ${this.delay}ms)`;
  }
  ngAfterViewInit(): void {
    if (this.highlight) { CursorService.initialize(this.element.nativeElement as HTMLElement); }
  }

}
