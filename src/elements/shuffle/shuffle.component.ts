import {AfterViewInit, Component, ElementRef, HostBinding, Input, OnInit} from '@angular/core';

import anime from 'animejs';
import {CursorService} from '../cursor/cursor.service';

@Component({
  selector: 'app-shuffle',
  templateUrl: './shuffle.component.html',
  styleUrls: ['./shuffle.component.scss', '../reveal.component.scss']
})
export class ShuffleComponent implements OnInit, AfterViewInit {
  @Input()
  delay;
  @Input()
  highlight: boolean;
  @Input()
  cards: string[];

  @HostBinding('style.--animation-delay')
  private animation;

  @Input()
  @HostBinding('class')
  private color = 'accent';

  private currentword = 0;
  /*
  * Here we want to create the same animation system but we also want to add a few more functionality
  * to enhance the animation system*/
  constructor(private element: ElementRef) {}

  ngOnInit(): void {
    this.animation = `var(--delay, ${this.delay}ms)`;
  }
  ngAfterViewInit(): void {
    if (this.highlight) { CursorService.initialize(this.element.nativeElement as HTMLElement); }
  }

  /*
  * We create another function next that will simply trigger the animation to the next word in the
  * card list.
  * */
  async next() {
    if (!this.cards) { return; }

    if (this.currentword >= this.cards.length - 1) {
      this.currentword = 0;
    } else {
      this.currentword += 1;
    }

    await this.word_shuffle(this.cards[this.currentword]);
  }

  private async word_shuffle(card: string) {
    /* We need to take each character in the word and animate its character randomly for a variant duration */
    const word = Array.from(card);

    for (const [index, c] of word.entries()) {
      /* Right, so then here we begin by creating an animation for each character */
      await this.char_shuffle(index, card, word, c);
    }
  }
  private async char_shuffle(index: number, card: string, word: string[], c: string) {
    const element = this.element.nativeElement as HTMLElement;
    let iteration = 0;
    /* For some weird reason the delay option isn't working so i have to make a synchronous timeout */
    await new Promise(resolve => setTimeout(resolve, Math.random() * 2 ** 8));

    anime({
      targets: [element],
      duration: Math.floor(Math.random() * 2 ** 10 + 2 ** 9),

      update: () => {
        if (iteration % 28 === 0) {
          /* Then here we generate random characters between frames and end by placing the actual character */
          c = String.fromCharCode(Math.floor(Math.random() * 86 + 40));

          word[index] = c;
          element.innerText = word.join('');
        }
        iteration++;
      },
      complete: () => {
        word[index] = card[index];
        element.innerText = word.join('');
      }
    });
  }
}
