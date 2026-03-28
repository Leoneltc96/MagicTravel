import { NgClass } from '@angular/common';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { ChangeDetectionStrategy, Component, DestroyRef, HostListener, computed, inject, signal } from '@angular/core';
import { slides } from "./flayers";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'carousel-flayers',
  imports: [NgClass, FontAwesomeModule],
  templateUrl: './carousel-flayers.html',
  styleUrl: './carousel-flayers.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarouselFlayers {

  protected readonly chevronLeft = faChevronLeft;
  protected readonly chevronRight = faChevronRight;
  protected readonly slides = slides

  private readonly destroyRef = inject(DestroyRef);

 

  protected readonly intervalMs = 4000;
  private intervalId: number | null = null;

  protected readonly slidesPerView = signal(1);
  protected readonly transitionEnabled = signal(true);
  protected readonly trackIndex = signal(0);
  protected readonly isAnimating = signal(false);

  protected readonly viewerOpen = signal(false);
  protected readonly viewerIndex = signal(0);

  protected readonly slidesForRender = computed(() => {
    const slidesPerView = this.slidesPerView();
    if (this.slides.length === 0) return [];
    const prefix = this.slides.slice(-slidesPerView);
    const suffix = this.slides.slice(0, slidesPerView);
    return [...prefix, ...this.slides, ...suffix];
  });

  protected readonly viewerSrc = computed(() => this.slides[this.viewerIndex()] ?? '');

  protected readonly trackWidth = computed(
    () => `${(this.slidesForRender().length * 100) / this.slidesPerView()}%`
  );

  protected readonly itemFlex = computed(() => `0 0 ${100 / this.slidesForRender().length}%`);

  protected readonly trackTransform = computed(
    () => `translateX(-${this.trackIndex() * (100 / this.slidesForRender().length)}%)`
  );

  protected readonly trackClass = computed(() =>
    this.transitionEnabled() ? 'transition-transform duration-500 ease-in-out' : 'transition-none'
  );

  constructor() {
    this.updateSlidesPerView();
    this.trackIndex.set(this.slidesPerView());
    this.startAutoplay();
    this.destroyRef.onDestroy(() => this.stopAutoplay());
  }

  @HostListener('window:keydown', ['$event'])
  protected onWindowKeydown(event: KeyboardEvent) {
    if (!this.viewerOpen()) return;
    if (event.key === 'Escape') {
      this.closeViewer();
      return;
    }
    if (event.key === 'ArrowLeft') {
      this.prevViewer();
      return;
    }
    if (event.key === 'ArrowRight') {
      this.nextViewer();
    }
  }

  @HostListener('window:resize')
  protected onResize() {
    const prev = this.slidesPerView();
    this.updateSlidesPerView();
    if (this.slidesPerView() === prev) return;
    this.isAnimating.set(false);
    this.transitionEnabled.set(false);
    this.trackIndex.set(this.slidesPerView());
    requestAnimationFrame(() => this.transitionEnabled.set(true));
  }

  protected onTrackTransitionEnd(event: TransitionEvent) {
    if (event.propertyName !== 'transform') return;
    const slidesPerView = this.slidesPerView();
    const count = this.slides.length;
    if (count === 0) return;
    let index = this.trackIndex();
    let needsJump = false;
    while (index < slidesPerView) {
      index += count;
      needsJump = true;
    }
    while (index >= count + slidesPerView) {
      index -= count;
      needsJump = true;
    }
    if (needsJump) {
      this.transitionEnabled.set(false);
      this.trackIndex.set(index);
      requestAnimationFrame(() => this.transitionEnabled.set(true));
    }
    this.isAnimating.set(false);
  }

  protected next() {
    if (this.slides.length <= 1) return;
    if (this.isAnimating()) return;
    this.isAnimating.set(true);
    this.transitionEnabled.set(true);
    this.trackIndex.update((i) => i + 1);
  }

  protected prev() {
    if (this.slides.length <= 1) return;
    if (this.isAnimating()) return;
    this.isAnimating.set(true);
    this.transitionEnabled.set(true);
    this.trackIndex.update((i) => i - 1);
  }

  protected pauseAutoplay() {
    this.stopAutoplay();
  }

  protected resumeAutoplay() {
    this.startAutoplay();
  }

  protected openViewerFromRenderIndex(renderIndex: number) {
    if (this.slides.length === 0) return;
    const baseIndex = this.toBaseIndex(renderIndex);
    this.viewerIndex.set(baseIndex);
    this.viewerOpen.set(true);
    this.pauseAutoplay();
  }

  protected closeViewer() {
    this.viewerOpen.set(false);
    this.resumeAutoplay();
  }

  protected nextViewer() {
    if (this.slides.length <= 1) return;
    this.viewerIndex.update((i) => (i + 1) % this.slides.length);
  }

  protected prevViewer() {
    if (this.slides.length <= 1) return;
    this.viewerIndex.update((i) => (i - 1 + this.slides.length) % this.slides.length);
  }

  private startAutoplay() {
    if (this.intervalId !== null) return;
    if (this.slides.length <= 1) return;
    this.intervalId = window.setInterval(() => this.next(), this.intervalMs);
  }

  private stopAutoplay() {
    if (this.intervalId === null) return;
    clearInterval(this.intervalId);
    this.intervalId = null;
  }

  private updateSlidesPerView() {
    const count = this.slides.length;
    const width = window.innerWidth;
    if (width < 640) {
      this.slidesPerView.set(Math.min(1, Math.max(1, count)));
      return;
    }
    if (width < 1024) {
      this.slidesPerView.set(Math.min(2, Math.max(1, count)));
      return;
    }
    if (width < 1280) {
      this.slidesPerView.set(Math.min(3, Math.max(1, count)));
      return;
    }
    this.slidesPerView.set(Math.min(4, Math.max(1, count)));
  }

  private toBaseIndex(renderIndex: number) {
    const slidesPerView = this.slidesPerView();
    const raw = renderIndex - slidesPerView;
    const mod = ((raw % this.slides.length) + this.slides.length) % this.slides.length;
    return mod;
  }
}
