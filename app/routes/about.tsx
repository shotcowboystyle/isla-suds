import {AboutHero} from '~/components/about/AboutHero';
import {FridgeClose} from '~/components/about/FridgeClose';
import {Inspection} from '~/components/about/Inspection';
import {MadeByHand} from '~/components/about/MadeByHand';
import {MarketTrack} from '~/components/about/MarketTrack';
import {RecipeAct} from '~/components/about/RecipeCard';
import {ABOUT_PAGE} from '~/content/about';
import {createMeta} from '~/utils/meta';
import type {Route} from './+types/about';

export const meta: Route.MetaFunction = createMeta(ABOUT_PAGE.meta);

/** The recipe card's two hands; preloaded so the writing never swaps font mid-stroke. */
export const links: Route.LinksFunction = () =>
  ['/fonts/HomemadeApple-latin.woff2', '/fonts/Caveat-latin.woff2'].map((href) => ({
    rel: 'preload',
    href,
    as: 'font',
    type: 'font/woff2',
    crossOrigin: 'anonymous' as const,
  }));

/**
 * The family scrapbook. Each act is one keepsake, in the order it happened:
 * our kitchen, the family recipe card (written on by three generations), the
 * polaroids of how it's made, the market snapshots, the inspection that every
 * batch has to pass, and the fridge where the finished card ends up.
 */
export default function AboutPage() {
  return (
    <article>
      <AboutHero />
      <RecipeAct />
      <MadeByHand />
      <MarketTrack />
      <Inspection />
      <FridgeClose />
    </article>
  );
}
