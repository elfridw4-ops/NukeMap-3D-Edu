export interface SeoSnapshotInput {
  tab: 'landing' | 'simulator';
  originUrl: string;
  target?: { lat: number; lng: number } | null;
  cityName?: string;
  countryName?: string;
}

export interface SeoSnapshot {
  title: string;
  description: string;
  canonicalUrl: string;
  geoPosition: string;
  icbm: string;
  geoPlacename: string;
}

const DEFAULT_ORIGIN = 'https://ais-pre-3myvpudpehnkhkhtlwgvz4-156867150624.europe-west1.run.app';

/**
 * Construit un instantané déterministe de métadonnées SEO/GEO selon l'onglet actif
 * et la cible géographique sélectionnée (testable hors navigateur).
 */
export function buildSeoSnapshot(input: SeoSnapshotInput): SeoSnapshot {
  const cleanOrigin = (input.originUrl || DEFAULT_ORIGIN).replace(/\/+$/, '');
  const lat = input.target && Number.isFinite(input.target.lat) ? input.target.lat : 48.8566;
  const lng = input.target && Number.isFinite(input.target.lng) ? input.target.lng : 2.3522;
  const latStr = lat.toFixed(4);
  const lngStr = lng.toFixed(4);

  const city = input.cityName?.trim() || 'Paris';
  const country = input.countryName?.trim();
  const geoPlacename = country && country !== 'Inconnu' ? `${city}, ${country}` : city;

  if (input.tab === 'simulator') {
    return {
      title: `Console Tactique (${city}) — NUKEMAP EDU`,
      description: `Analyse en direct sur ${geoPlacename} [${latStr}°, ${lngStr}°] : surpression Glasstone & Dolan, bilan démographique vérifié et vents Open-Meteo.`,
      canonicalUrl: `${cleanOrigin}/?autostart=1`,
      geoPosition: `${latStr};${lngStr}`,
      icbm: `${latStr}, ${lngStr}`,
      geoPlacename,
    };
  }

  return {
    title: 'NUKEMAP EDU — Simulateur Nucléaire 3D & Impacts Physiques',
    description:
      'Simulateur scientifique et pédagogique 2D/3D d\'impacts nucléaires : surpression Glasstone & Dolan, trajectoires balistiques, tsunami côtier et bilan vérifié.',
    canonicalUrl: `${cleanOrigin}/`,
    geoPosition: `${latStr};${lngStr}`,
    icbm: `${latStr}, ${lngStr}`,
    geoPlacename,
  };
}

function upsertMetaTag(attr: 'name' | 'property', key: string, content: string): void {
  if (typeof document === 'undefined') return;
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertCanonicalLink(href: string): void {
  if (typeof document === 'undefined') return;
  let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', href);
}

/**
 * Synchronise dynamiquement le titre HTML, les balises OpenGraph/Twitter, l'URL canonique
 * et les coordonnées GEO dans le <head> du document.
 */
export function updateRuntimeSeoMetadata(input: Omit<SeoSnapshotInput, 'originUrl'> & { originUrl?: string }): SeoSnapshot {
  const originUrl =
    input.originUrl ||
    (typeof window !== 'undefined' && window.location?.origin ? window.location.origin : DEFAULT_ORIGIN);

  const snapshot = buildSeoSnapshot({ ...input, originUrl });

  if (typeof document !== 'undefined') {
    document.title = snapshot.title;
    upsertCanonicalLink(snapshot.canonicalUrl);

    upsertMetaTag('name', 'description', snapshot.description);
    upsertMetaTag('name', 'geo.placename', snapshot.geoPlacename);
    upsertMetaTag('name', 'geo.position', snapshot.geoPosition);
    upsertMetaTag('name', 'ICBM', snapshot.icbm);
    upsertMetaTag('name', 'DC.title', snapshot.title);

    upsertMetaTag('property', 'og:title', snapshot.title);
    upsertMetaTag('property', 'og:description', snapshot.description);
    upsertMetaTag('property', 'og:url', snapshot.canonicalUrl);

    upsertMetaTag('name', 'twitter:title', snapshot.title);
    upsertMetaTag('name', 'twitter:description', snapshot.description);
  }

  return snapshot;
}
