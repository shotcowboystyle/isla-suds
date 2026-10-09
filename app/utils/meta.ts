type MetaTag = Record<string, unknown>;

export const SITE_NAME = 'Isla Suds';

/**
 * Title, description and their Open Graph twins. og:url, og:site_name, the
 * twitter card and the fallback og:image come from the root layout.
 */
export function seoTags({
  title,
  description,
  image,
  type = 'website',
}: {
  title: string;
  description?: string | null;
  image?: string | null;
  type?: string;
}): MetaTag[] {
  const tags: MetaTag[] = [
    {title},
    {property: 'og:title', content: title},
    {property: 'og:type', content: type},
  ];
  if (description) {
    tags.push({name: 'description', content: description}, {property: 'og:description', content: description});
  }
  if (image) tags.push({property: 'og:image', content: image});
  return tags;
}

/**
 * Factory for creating static route meta functions.
 * Eliminates the repeated `() => [{title: ...}, {name: 'description', ...}]` pattern.
 */
export function createMeta(meta: {title: string; description?: string}) {
  return () => seoTags(meta);
}

// Private, transactional or dev-only paths: kept out of search results.
const NOINDEX_PREFIXES = ['/account', '/wholesale', '/cart', '/search', '/dev', '/discount'];

export function isNoindexPath(pathname: string) {
  return NOINDEX_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

/** Absolute, query-free, trailing-slash-free URL for the page. */
export function canonicalUrl(origin: string, pathname: string) {
  const path = pathname.replace(/\/+$/, '');
  return `${origin}${path || '/'}`;
}
