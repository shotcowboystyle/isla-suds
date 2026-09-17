import {ChapterInheritance, ChapterTurn} from '~/components/about/AboutChapters';
import {AboutHero} from '~/components/about/AboutHero';
import {CureScene} from '~/components/about/CureScene';
import {AboutClose, IslaMoment} from '~/components/about/IslaMoment';
import {ABOUT_PAGE} from '~/content/about';
import {createMeta} from '~/utils/meta';
import type {Route} from './+types/about';

export const meta: Route.MetaFunction = createMeta(ABOUT_PAGE.meta);

/**
 * The story is told in time order, not in the order the copy file lists it.
 *
 * The grandmother's Depression-era recipe is the oldest thing here, so it opens
 * the argument; the corporate-desk turn is what happens to it; the cure is how
 * it is made now; and the reason for all of it lands last, on its own screen.
 *
 * Six acts, six different devices, none repeated back to back: a layered hero,
 * ink that arrives word by word, a heading dragged sideways, the pinned cure
 * (the one bespoke move on the site), the quiet peak, and a close that stops.
 * Every section renders eagerly, for the same reason the home page does:
 * ScrollTrigger has to measure a document that already exists.
 */
export default function AboutPage() {
  return (
    <article>
      <AboutHero />
      <ChapterInheritance />
      <ChapterTurn />
      <CureScene />
      <IslaMoment />
      <AboutClose />
    </article>
  );
}
