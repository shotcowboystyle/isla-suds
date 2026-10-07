import {PostcardRack} from '~/components/locations/PostcardRack';
import {StoresClose} from '~/components/locations/StoresClose';
import {StoresHero} from '~/components/locations/StoresHero';
import {LOCATIONS_PAGE} from '~/content/stores';
import {createMeta} from '~/utils/meta';
import type {Route} from './+types/locations';

export const meta: Route.MetaFunction = createMeta(LOCATIONS_PAGE.meta);

/** The goat's handwriting on every postcard; preloaded so notes never swap font. */
export const links: Route.LinksFunction = () => [
  {rel: 'preload', href: '/fonts/Caveat-latin.woff2', as: 'font', type: 'font/woff2', crossOrigin: 'anonymous'},
];

export default function Locations() {
  return (
    <>
      <StoresHero />
      <PostcardRack />
      <StoresClose />
    </>
  );
}
