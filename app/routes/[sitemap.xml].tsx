import {getSitemapIndex} from '@shopify/hydrogen';
import type {Route} from './+types/[sitemap.xml]';

export async function loader({
  request,
  context: {storefront},
}: Route.LoaderArgs) {
  const response = await getSitemapIndex({
    storefront,
    request,
    // Shopify `pages` are left out: the storefront's real pages are custom
    // routes (listed in the static child), and the Shopify ones are either
    // placeholders or redirect to those routes (see pages.$handle.tsx).
    types: ['products', 'collections', 'blogs', 'articles'],
    customChildSitemaps: ['/sitemap/static/1.xml'],
  });

  response.headers.set('Cache-Control', `max-age=${60 * 60 * 24}`);

  return response;
}
