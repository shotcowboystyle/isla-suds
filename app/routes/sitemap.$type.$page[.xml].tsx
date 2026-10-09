import {getSitemap} from '@shopify/hydrogen';
import type {Route} from './+types/sitemap.$type.$page[.xml]';

// Custom routes with no Shopify resource behind them, so getSitemap can't list them.
const STATIC_SITEMAP_PATHS = ['/', '/about', '/contact', '/locations', '/partners'];

export async function loader({
  request,
  params,
  context: {storefront},
}: Route.LoaderArgs) {
  if (params.type === 'static') {
    if (params.page !== '1') throw new Response('Not found', {status: 404});
    const {origin} = new URL(request.url);
    const urls = STATIC_SITEMAP_PATHS.map((path) => `  <url><loc>${origin}${path}</loc></url>`).join('\n');
    return new Response(
      `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`,
      {headers: {'Content-Type': 'application/xml', 'Cache-Control': `max-age=${60 * 60 * 24}`}},
    );
  }

  // English-only storefront with no locale-prefixed routes: no hreflang alternates.
  const response = await getSitemap({
    storefront,
    request,
    params,
    getLink: ({type, baseUrl, handle}) => `${baseUrl}/${type}/${handle}`,
  });

  response.headers.set('Cache-Control', `max-age=${60 * 60 * 24}`);

  return response;
}
