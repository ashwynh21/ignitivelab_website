import {Component, OnInit, ViewChild} from '@angular/core';
import {ShuffleComponent} from '../../elements/shuffle/shuffle.component';
import {PagerService} from '../../elements/pager/pager.service';

@Component({
  selector: 'app-greeting',
  templateUrl: './greeting.component.html',
  styleUrls: ['./greeting.component.scss']
})
export class GreetingComponent implements OnInit {
  @ViewChild('greet') greet: ShuffleComponent;
  @ViewChild('ignite') ignite: ShuffleComponent;

  constructor() { }

  ngOnInit(): void {
  }

  page() {
    PagerService.next();
  }
}
