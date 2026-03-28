import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';

export type PromoSlideSmall = {
  // URL de la imagen en versión “small” (el contenido del nodo <slidesmall>).
  url: string
  // Atributos que vienen en <slidesmall dias=".." noches=".." desde=".." imp="..">.
  dias?: string
  noches?: string
  desde?: number
  imp?: number
}

export type MegaPromo = {
  // <nombre>
  nombre: string
  // <clv>
  clv: string
  // <slide> (normalmente una imagen horizontal)
  slide: string
  // <slidemobil> (normalmente una imagen vertical)
  slidemobil: string
  // Puede venir 1+ veces en el XML.
  slidesmall: PromoSlideSmall[]
}

@Injectable({
  providedIn: 'root'
})
export class AppService {

  private readonly http = inject(HttpClient);

  // Usamos la ruta local para que pase por el proxy del dev-server y evitar CORS.
  private readonly promosXmlUrl = '/mtmediacafe/mega-slider/xml/promos.xml'

  // Convierte strings numéricos del XML a number.
  // Ejemplos que soporta: "1900", "1,900", "$1,900", " 1,900 ".
  private parseNumber(value: string | null): number | undefined {
    if (!value) return undefined
    const cleaned = value.replaceAll(',', '').replace(/[^\d.-]/g, '').trim()
    if (!cleaned) return undefined
    const parsed = Number(cleaned)
    return Number.isFinite(parsed) ? parsed : undefined
  }

  // Consume el XML del mega-slider y lo transforma a JSON (MegaPromo[]).
  // Retorna un Observable para integrarlo fácil con Angular/RxJS.
  getMegaSliderPromos(): Observable<MegaPromo[]> {
    return this.http.get(this.promosXmlUrl, { responseType: 'text' }).pipe(
      map((xmlText) => this.parsePromosXml(xmlText)),
      // tap((promos) => console.log('promos', promos))
    )
  }

  // Parsea el string XML a un arreglo de objetos (JSON).
  // - DOMParser convierte el XML en un Document.
  // - Si hay parsererror, devolvemos [] para evitar romper la UI.
  private parsePromosXml(xmlText: string): MegaPromo[] {
    const doc = new DOMParser().parseFromString(xmlText, 'text/xml')
    if (doc.getElementsByTagName('parsererror').length > 0) return []

    // Tomamos cada <megapromo> y lo convertimos a un objeto MegaPromo.
    const promos = Array.from(doc.getElementsByTagName('megapromo'))
    return promos.map((promo) => {
      const result = {} as MegaPromo
      for (const child of Array.from(promo.children)) {
        const tagName = child.tagName.toLowerCase()
        const text = child.textContent?.trim()
        if (!text) continue

        // <slidesmall> puede venir varias veces y además trae atributos.
        if (tagName === 'slidesmall') {
          const item: PromoSlideSmall = {
            url: text,
            dias: child.getAttribute('dias') ?? undefined,
            noches: child.getAttribute('noches') ?? undefined,
            desde: this.parseNumber(child.getAttribute('desde')),
            imp: this.parseNumber(child.getAttribute('imp')),
          }
          if (!result.slidesmall) result.slidesmall = []
          result.slidesmall.push(item)
          continue
        }

        // Mapeos directos de nodos simples a propiedades del objeto.
        if (tagName === 'nombre') {
          result.nombre = text
          continue
        }

        if (tagName === 'clv') {
          result.clv = text
          continue
        }

        if (tagName === 'slide') {
          result.slide = text
          continue
        }

        if (tagName === 'slidemobil') {
          result.slidemobil = text
        }
      }
      return result
    })
  }

}
