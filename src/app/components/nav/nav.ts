import { ChangeDetectionStrategy, Component, DestroyRef, effect, ElementRef, HostListener, inject, signal } from '@angular/core';
import { NgOptimizedImage, NgClass } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBars, faGlobe, faHouse, faPlane, faTags } from '@fortawesome/free-solid-svg-icons';
import {  TmButton } from '../tm-button/tm-button';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ViewChild } from '@angular/core';
import { navArray } from './navArray';

@Component({
  standalone: true,
  selector: 'app-nav',
  imports: [NgOptimizedImage, FontAwesomeModule, NgClass, TmButton, RouterLink, RouterLinkActive],
  templateUrl: './nav.html',
  styleUrl: './nav.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Nav{
   readonly faBars = faBars;
   readonly heroBackgroundImage = 'url("img/banners/hero-image.jpg")';

   readonly objectIcons: any = {
    faHouse: faHouse,
    faGlobe: faGlobe,
    faTags: faTags,
    faPlane: faPlane,
   }
  
  @ViewChild('hero') hero!: ElementRef;
  
  isScrolled = signal(false);

  protected readonly isHome = signal(false);
  protected readonly navArray = navArray;



  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);



  constructor() {
    this.setIsHomeFromUrl(this.router.url);

    const sub = this.router.events.subscribe((event) => {
      if (!(event instanceof NavigationEnd)) return;
      this.setIsHomeFromUrl(event.urlAfterRedirects);
    });

    this.destroyRef.onDestroy(() => sub.unsubscribe());
  }

  private setIsHomeFromUrl(url: string) {
    this.isHome.set(url === '/home' || url.startsWith('/home?') || url.startsWith('/home#'));
  }

  @HostListener('window:scroll')
  onWindowScroll() {
    const scrollY = window.scrollY;
    const heroHeight = this.hero?.nativeElement?.offsetHeight ?? 510;
    this.isScrolled.set(scrollY > heroHeight - 84);
  }
  
  closeDrawer() {
    document.getElementById('my-drawer-5')?.click();
  }
}
