import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-details.page',
  imports: [],
  templateUrl: './details.page.html',
  styleUrl: './details.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailsPage { 
  private readonly route = inject(ActivatedRoute);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly clv = signal('');
  protected readonly urlIframe = signal<SafeResourceUrl | null>(null);

  constructor() {
    const sub = this.route.paramMap.subscribe((params) => {
      const normalized = this.normalizeClv(params.get('clv'));
      this.clv.set(normalized ?? '');

      if (!normalized) {
        this.urlIframe.set(null);
        return;
      }

      const url = this.buildMegaTravelUrl(normalized);
      this.urlIframe.set(this.sanitizer.bypassSecurityTrustResourceUrl(url));
    });

    this.destroyRef.onDestroy(() => sub.unsubscribe());
  }

  private normalizeClv(value: string | null): string | null {
    const trimmed = value?.trim();
    if (!trimmed) return null;
    if (!/^\d{1,10}$/.test(trimmed)) return null;
    return trimmed;
  }

  private buildMegaTravelUrl(clv: string): string {
    const url = new URL('https://www.megatravel.com.mx/tools/circuito.php');
    url.searchParams.set('viaje', clv);
    url.searchParams.set('txtColor', '000000');
    url.searchParams.set('thBG', '6B92E5');
    url.searchParams.set('thTxColor', '000000');
    url.searchParams.set('ff', '1');
    return url.toString();
  }

}
