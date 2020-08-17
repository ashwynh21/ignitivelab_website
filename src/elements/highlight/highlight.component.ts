import {AfterViewInit, Component, ElementRef, OnInit} from '@angular/core';
import {CursorService} from '../cursor/cursor.service';

@Component({
  selector: 'app-highlight',
  templateUrl: './highlight.component.html',
  styleUrls: ['./highlight.component.scss']
})
export class HighlightComponent implements AfterViewInit {

  constructor(private element: ElementRef) { }

  ngAfterViewInit(): void {
    CursorService.initialize(this.element.nativeElement);
  }

}
