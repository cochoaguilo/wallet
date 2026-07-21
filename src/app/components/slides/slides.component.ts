import { CommonModule } from '@angular/common';
import { AfterViewChecked, AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, ViewChild, input } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { register } from 'swiper/element/bundle';
import type { SwiperContainer } from 'swiper/element';
export interface SlideItem {
  title?: string;
  description?: string;
  content?: string;
}

@Component({
  selector: 'app-slides',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './slides.component.html',
  styleUrls: ['./slides.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SlidesComponent implements AfterViewInit, AfterViewChecked {
  slides = input<SlideItem[]>([]);
  initialSlide = input(0);
  autoplay = input(true);
  pagination = input(false);

  @ViewChild('swiperRef', { static: false }) swiperRef?: ElementRef<SwiperContainer>;

  private hasConfiguredSwiper = false;

  ngAfterViewInit(): void {
    this.configureSwiper();
  }

  ngAfterViewChecked(): void {
    this.configureSwiper();
  }

  private configureSwiper(): void {
    if (this.hasConfiguredSwiper) {
      return;
    }

    const swiperEl = this.swiperRef?.nativeElement;

    if (!swiperEl) {
      return;
    }

    register();

    swiperEl.setAttribute('slides-per-view', '1');
    swiperEl.setAttribute('space-between', '16');
    swiperEl.setAttribute('initial-slide', `${this.initialSlide()}`);

    if (this.pagination()) {
      swiperEl.setAttribute('pagination', 'true');
    } else {
      swiperEl.removeAttribute('pagination');
    }

    if (this.autoplay()) {
      swiperEl.setAttribute('autoplay', 'true');
    } else {
      swiperEl.removeAttribute('autoplay');
    }

    this.hasConfiguredSwiper = true;
  }
}
