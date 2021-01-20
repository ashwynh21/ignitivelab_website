import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TitleComponent } from './title/title.component';
import { CursorComponent } from './cursor/cursor.component';
import { CursorService } from './cursor/cursor.service';
import { ShuffleComponent } from './shuffle/shuffle.component';
import { ParticlesComponent } from './particles/particles.component';
import { TextComponent } from './text/text.component';
import { HighlightComponent } from './highlight/highlight.component';
import { MenuComponent } from './menu/menu.component';
import { PagerComponent } from './pager/pager.component';
import { SliderComponent } from './slider/slider.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ButtonComponent } from './button/button.component';
import { GlassComponent } from './glass/glass.component';

@NgModule({
  declarations: [TitleComponent, CursorComponent, ShuffleComponent, ParticlesComponent, TextComponent, HighlightComponent, MenuComponent, PagerComponent, SliderComponent, SidebarComponent, ButtonComponent, GlassComponent],
    exports: [
        TitleComponent,
        CursorComponent,
        ShuffleComponent,
        ParticlesComponent,
        TextComponent,
        HighlightComponent,
        MenuComponent,
        PagerComponent,
        SliderComponent,
        SidebarComponent,
        ButtonComponent,
        GlassComponent
    ],
  imports: [
    CommonModule,
  ],
  providers: [
    CursorService
  ]
})
export class ElementsModule { }
