import BarEucalyptus from '~/assets/images/home/bar-eucalyptus.webp';
import BarLavender from '~/assets/images/home/bar-lavender.webp';
import BarLemongrass from '~/assets/images/home/bar-lemongrass.webp';
import BarRosemary from '~/assets/images/home/bar-rosemary.webp';
import BotanicalsEucalyptus from '~/assets/images/home/botanicals-eucalyptus.webp';
import BotanicalsLavender from '~/assets/images/home/botanicals-lavender.webp';
import BotanicalsLemongrass from '~/assets/images/home/botanicals-lemongrass.webp';
import BotanicalsRosemary from '~/assets/images/home/botanicals-rosemary.webp';
import CutEucalyptus from '~/assets/images/product/eucalyptus-cut.webp';
import GoatEucalyptus from '~/assets/images/product/eucalyptus-goat.webp';
import HeroEucalyptusMobile from '~/assets/images/product/eucalyptus-hero-m.webp';
import HeroEucalyptus from '~/assets/images/product/eucalyptus-hero.webp';
import TapEucalyptus from '~/assets/images/product/eucalyptus-tap.webp';
import CutLavender from '~/assets/images/product/lavender-cut.webp';
import GoatLavender from '~/assets/images/product/lavender-goat.webp';
import HeroLavenderMobile from '~/assets/images/product/lavender-hero-m.webp';
import HeroLavender from '~/assets/images/product/lavender-hero.webp';
import TapLavender from '~/assets/images/product/lavender-tap.webp';
import CutLemongrass from '~/assets/images/product/lemongrass-cut.webp';
import GoatLemongrass from '~/assets/images/product/lemongrass-goat.webp';
import HeroLemongrassMobile from '~/assets/images/product/lemongrass-hero-m.webp';
import HeroLemongrass from '~/assets/images/product/lemongrass-hero.webp';
import TapLemongrass from '~/assets/images/product/lemongrass-tap.webp';
import CutRosemary from '~/assets/images/product/rosemary-cut.webp';
import GoatRosemary from '~/assets/images/product/rosemary-goat.webp';
import HeroRosemaryMobile from '~/assets/images/product/rosemary-hero-m.webp';
import HeroRosemary from '~/assets/images/product/rosemary-hero.webp';
import TapRosemary from '~/assets/images/product/rosemary-tap.webp';
import LatherEucalyptusMobile from '~/assets/video/product/eucalyptus-lather-m.mp4';
import LatherEucalyptus from '~/assets/video/product/eucalyptus-lather.mp4';
import LatherLavenderMobile from '~/assets/video/product/lavender-lather-m.mp4';
import LatherLavender from '~/assets/video/product/lavender-lather.mp4';
import LatherLemongrassMobile from '~/assets/video/product/lemongrass-lather-m.mp4';
import LatherLemongrass from '~/assets/video/product/lemongrass-lather.mp4';
import LatherRosemaryMobile from '~/assets/video/product/rosemary-lather-m.mp4';
import LatherRosemary from '~/assets/video/product/rosemary-lather.mp4';

export interface Scent {
  /** Short display name; the full Shopify title still renders as the h1's tail. */
  name: string;
  /** Product handle in Shopify. */
  handle: string;
  /** The hero one-liner. */
  line: string;
  /** The collection page's "pick by mood" chip for this bar. */
  mood: string;
  /** What the essential oil brings, for the "inside" act. */
  oil: string;
  /** CSS colour token for this bar. */
  color: string;
  /** Rotation that turns this bar's art so its label reads upright (the art is shot at an angle). */
  barRot: number;
  bar: string;
  botanicals: string;
  hero: string;
  heroMobile: string;
  cut: string;
  tapPoster: string;
  goatPoster: string;
  lather: string;
  latherMobile: string;
}

export const SCENTS = {
  eucalyptus: {
    name: 'Eucalyptus',
    handle: 'eucalyptus',
    line: 'A spa day, minus the robe you have to give back.',
    mood: 'Spa day',
    oil: 'Eucalyptus essential oil',
    color: 'var(--color-eucalyptus)',
    barRot: 0,
    bar: BarEucalyptus,
    botanicals: BotanicalsEucalyptus,
    hero: HeroEucalyptus,
    heroMobile: HeroEucalyptusMobile,
    cut: CutEucalyptus,
    tapPoster: TapEucalyptus,
    goatPoster: GoatEucalyptus,
    lather: LatherEucalyptus,
    latherMobile: LatherEucalyptusMobile,
  },
  lavender: {
    name: 'Lavender',
    handle: 'lavender',
    line: 'Calm, in bar form. Naps sold separately.',
    mood: 'I need calm',
    oil: 'Lavender essential oil',
    color: 'var(--color-lavender)',
    barRot: 115,
    bar: BarLavender,
    botanicals: BotanicalsLavender,
    hero: HeroLavender,
    heroMobile: HeroLavenderMobile,
    cut: CutLavender,
    tapPoster: TapLavender,
    goatPoster: GoatLavender,
    lather: LatherLavender,
    latherMobile: LatherLavenderMobile,
  },
  lemongrass: {
    name: 'Lemongrass',
    handle: 'lemongrass',
    line: 'Bright like a lemon. Much nicer to your skin than one.',
    mood: 'Wake me up',
    oil: 'Lemongrass essential oil',
    color: 'var(--color-lemongrass)',
    barRot: 58,
    bar: BarLemongrass,
    botanicals: BotanicalsLemongrass,
    hero: HeroLemongrass,
    heroMobile: HeroLemongrassMobile,
    cut: CutLemongrass,
    tapPoster: TapLemongrass,
    goatPoster: GoatLemongrass,
    lather: LatherLemongrass,
    latherMobile: LatherLemongrassMobile,
  },
  rosemary: {
    name: 'Rosemary Sea Salt',
    handle: 'rosemary-sea-salt',
    line: 'A day at the beach, without sand in weird places.',
    mood: 'Beach brain',
    oil: 'Rosemary essential oil and sea salt',
    color: 'var(--color-sea-salt-dark)',
    barRot: 58,
    bar: BarRosemary,
    botanicals: BotanicalsRosemary,
    hero: HeroRosemary,
    heroMobile: HeroRosemaryMobile,
    cut: CutRosemary,
    tapPoster: TapRosemary,
    goatPoster: GoatRosemary,
    lather: LatherRosemary,
    latherMobile: LatherRosemaryMobile,
  },
} satisfies Record<string, Scent>;

export type ScentId = keyof typeof SCENTS;

export const SCENT_IDS = Object.keys(SCENTS) as ScentId[];

/** Product handle to scent, or null for anything that isn't one of the four bars. */
export function findScent(handle: string): ScentId | null {
  return SCENT_IDS.find((id) => SCENTS[id].handle === handle) ?? null;
}

/** Product handle to scent. Unknown products borrow eucalyptus's scenes. */
export function scentForHandle(handle: string): ScentId {
  return findScent(handle) ?? 'eucalyptus';
}

/** Facts printed on the real label and used across the page. */
export const BAR_FACTS = {
  weight: '6 oz',
};

/**
 * Shopify descriptions run 1,000 to 2,000 characters, and some carry pasted
 * citation junk like "[ppl-ai-file-upload.s3.amazonaws]". Strip bracketed
 * tokens and split into a two-sentence lede plus the rest.
 */
export function splitDescription(text: string): {lede: string; rest: string} {
  const clean = text
    .replace(/\[[^\]]*\]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  const end = /[.!?]+(?=\s|$)/g;
  let cut = clean.length;
  for (let count = 0, match = end.exec(clean); match; match = end.exec(clean)) {
    if (++count === 2) {
      cut = match.index + match[0].length;
      break;
    }
  }
  return {lede: clean.slice(0, cut).trim(), rest: clean.slice(cut).trim()};
}
