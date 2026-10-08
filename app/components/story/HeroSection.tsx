import {useRef, useEffect} from 'react';
import {useGSAP} from '@gsap/react';
import GSAP from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {SplitText} from 'gsap/SplitText';
import BarEucalyptusSmall from '~/assets/images/home/bar-eucalyptus-480.webp';
import BarEucalyptus from '~/assets/images/home/bar-eucalyptus.webp';
import BarLavenderSmall from '~/assets/images/home/bar-lavender-480.webp';
import BarLavender from '~/assets/images/home/bar-lavender.webp';
import BarLemongrassSmall from '~/assets/images/home/bar-lemongrass-480.webp';
import BarLemongrass from '~/assets/images/home/bar-lemongrass.webp';
import BarRosemarySmall from '~/assets/images/home/bar-rosemary-480.webp';
import BarRosemary from '~/assets/images/home/bar-rosemary.webp';
import HeroFoam from '~/assets/images/home/hero-foam.webp';
import HeroPlateMobile from '~/assets/images/home/hero-plate-m.webp';
import HeroPlate from '~/assets/images/home/hero-plate.webp';
import {LiquidButton} from '~/components/ui/LiquidButton';
import {HERO_CONTENT, HERO_TAGLINE_START, HERO_TAGLINE_END} from '~/content/story';
import {usePreloader} from '~/contexts/preloader-context';
import {prefersReducedMotion} from '~/lib/motion';
import {useHeroLean, useHeroTravel} from '~/lib/motion/hero-planes';
import {CHAR_STAGGER, ENTER_EASE} from '~/lib/motion/tokens';
import {cn} from '~/utils/cn';
import styles from './HeroSection.module.css';

if (typeof document !== 'undefined') {
  GSAP.registerPlugin(ScrollTrigger, SplitText, useGSAP);
}

type Depth = 'far' | 'mid' | 'near';

/**
 * The floating bars, back to front. `slot` names the CSS position; `depth`
 * decides how far the bar travels on scroll and how hard it leans toward the
 * pointer. Far bars sit behind the headline, mid and near bars in front of it.
 *
 * `small` is a 480w copy (scripts/resize-home-images.mjs) and `sizes` mirrors
 * the slot widths in HeroSection.module.css, so most screens skip the full
 * ~1100px source. Keep `sizes` in step with the CSS.
 */
const BARS: {src: string; small: string; slot: string; depth: Depth; w: number; h: number; sizes: string}[] = [
  {src: BarRosemary, small: BarRosemarySmall, slot: 'far-a', depth: 'far', w: 906, h: 1100, sizes: '(min-width: 768px) 8vw, 13vw'},
  {src: BarLemongrass, small: BarLemongrassSmall, slot: 'far-b', depth: 'far', w: 932, h: 1100, sizes: '(min-width: 768px) 6.5vw, 10vw'},
  {src: BarEucalyptus, small: BarEucalyptusSmall, slot: 'far-c', depth: 'far', w: 1100, h: 875, sizes: '8vw'},
  {src: BarLavender, small: BarLavenderSmall, slot: 'mid-a', depth: 'mid', w: 1037, h: 1100, sizes: '(min-width: 768px) 21vw, 44vw'},
  {src: BarLemongrass, small: BarLemongrassSmall, slot: 'mid-b', depth: 'mid', w: 932, h: 1100, sizes: '(min-width: 768px) 14vw, 36vw'},
  {src: BarRosemary, small: BarRosemarySmall, slot: 'near', depth: 'near', w: 906, h: 1100, sizes: '(min-width: 768px) 22vw, 36vw'},
];

/** Scroll travel per plane across the hero's exit, in viewport heights. */
const SCROLL_TRAVEL: Record<Depth | 'plate' | 'foam', number> = {
  plate: 10,
  far: -8,
  mid: -30,
  foam: -22,
  near: -70,
};

/** Pointer lean per plane, in px at the edge of the viewport. */
const POINTER_LEAN: Record<Depth, number> = {far: 8, mid: 20, near: 38};

interface HeroSectionProps {
  className?: string;
}

export function HeroSection({className}: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const text1Ref = useRef<HTMLHeadingElement>(null);
  const clippedBox1Ref = useRef<HTMLDivElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const {preloaderComplete} = usePreloader();

  useHeroTravel(sectionRef, containerRef, SCROLL_TRAVEL);
  useHeroLean(sectionRef, POINTER_LEAN);

  // Entrance choreography, handed off from the preloader.
  //
  // The markup ships as `data-hero-state="pending"`, which hides the animated
  // copy and the bars in CSS. Nothing paints in its final position, so there is
  // no flash of finished text before the timeline takes over. The attribute only
  // flips to "ready" once the start states are set.
  useEffect(() => {
    const section = sectionRef.current;
    const text1 = text1Ref.current;
    const clippedBox1 = clippedBox1Ref.current;
    const paragraph = paragraphRef.current;
    const button = buttonRef.current;
    if (!section || !text1 || !clippedBox1 || !paragraph || !button || !preloaderComplete) return;

    if (prefersReducedMotion()) {
      section.dataset.heroState = 'ready';
      return;
    }

    let cancelled = false;
    let ctx: gsap.Context | undefined;

    // Splitting before the webfont resolves measures fallback glyphs, which
    // leaves every char box in the wrong place once Antonio swaps in.
    void document.fonts.ready.then(() => {
      if (cancelled) return;

      ctx = GSAP.context(() => {
        const titleSplit = SplitText.create(text1, {
          type: 'chars',
          mask: 'chars',
          autoSplit: true,
        });

        // The burst: every bar starts packed into the middle of the frame and
        // flies out to its slot, like the bars just popped out of one box.
        const bursts = Array.from(section.querySelectorAll<HTMLElement>('[data-burst]'));
        const centreX = window.innerWidth / 2;
        const centreY = window.innerHeight / 2;
        const offsets = bursts.map((el) => {
          const r = el.getBoundingClientRect();
          return {x: centreX - (r.left + r.width / 2), y: centreY - (r.top + r.height / 2)};
        });

        const tl = GSAP.timeline({paused: true});

        tl.fromTo(
          bursts,
          {
            x: (i) => offsets[i].x,
            y: (i) => offsets[i].y,
            scale: 0.15,
            rotation: () => GSAP.utils.random(-120, 120),
            autoAlpha: 0,
          },
          {
            x: 0,
            y: 0,
            scale: 1,
            rotation: 0,
            autoAlpha: 1,
            duration: 1.3,
            ease: 'expo.out',
            stagger: {each: 0.04, from: 'random'},
          },
        )
          .fromTo('[data-foam]', {yPercent: 60}, {yPercent: 0, duration: 1.2, ease: 'power3.out'}, 0.1)
          // A clip-path reveal grows the box from its centre like the old
          // `width: 0 → auto` tween, but without re-laying out the copy column
          // every frame (that tween also showed up as layout shift). The
          // negative inset keeps the outline, which sits outside the box, in.
          .fromTo(
            clippedBox1,
            {opacity: 0, clipPath: 'inset(-1vw 50%)'},
            {opacity: 1, clipPath: 'inset(-1vw -1vw)', duration: 0.5, ease: 'circ.out', clearProps: 'clipPath'},
            0.25,
          )
          .fromTo(
            titleSplit.chars,
            {yPercent: 120},
            {yPercent: 0, duration: 0.8, stagger: CHAR_STAGGER, ease: ENTER_EASE},
            0.35,
          )
          .fromTo(paragraph, {y: 20, opacity: 0}, {y: 0, opacity: 1, duration: 0.6, ease: ENTER_EASE}, '-=0.4')
          .fromTo(button, {y: 20, opacity: 0}, {y: 0, opacity: 1, duration: 0.6, ease: ENTER_EASE}, '-=0.4');

        // Start states are committed — safe to reveal, then play.
        section.dataset.heroState = 'ready';
        tl.play();
      }, section);
    });

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, [preloaderComplete]);

  const renderBar = (bar: (typeof BARS)[number]) => (
    <div key={bar.slot} data-travel={bar.depth} className={cn(styles['bar'], styles[`bar-${bar.slot}`])}>
      <div data-lean={bar.depth} className={styles['bar-lean']}>
        <div data-burst className={styles['bar-burst']}>
          <img
            src={bar.small}
            srcSet={`${bar.small} 480w, ${bar.src} ${bar.w}w`}
            sizes={bar.sizes}
            alt=""
            width={bar.w}
            height={bar.h}
            decoding="async"
            // The near bar is the largest paint in the first viewport.
            fetchPriority={bar.depth === 'near' ? 'high' : undefined}
            className={styles['bar-img']}
          />
        </div>
      </div>
    </div>
  );

  return (
    <section
      ref={sectionRef}
      data-testid="hero-section"
      data-hero-state="pending"
      className={cn(styles['hero-section'], className)}
      aria-label="Hero section"
    >
      <div ref={containerRef} className={styles['hero-section-container']}>
        <div className={styles['scene-back']} aria-hidden="true">
          <picture data-travel="plate" className={styles['plate']}>
            <source media="(max-width: 767px)" srcSet={HeroPlateMobile} width={1080} height={1944} />
            <img src={HeroPlate} alt="" width={2560} height={1430} fetchPriority="high" />
          </picture>
          {BARS.filter((bar) => bar.depth === 'far').map(renderBar)}
        </div>

        <div className={styles['hero-section-content']}>
          <div className={styles['letter-animation']}>
            <h1 ref={text1Ref} className={cn(styles['hero-text'], 'split-text')}>
              {HERO_TAGLINE_START}
            </h1>
          </div>

          <div ref={clippedBox1Ref} className={styles['clipped-text-box']}>
            <h1 className={styles['clipped-text']}>{HERO_TAGLINE_END}</h1>
          </div>

          <p ref={paragraphRef} className={styles['paragraph']}>
            {HERO_CONTENT}
          </p>

          <div ref={buttonRef} className={cn(styles['cta'], 'flex items-center justify-center mt-12')}>
            <LiquidButton href="/collections/frontpage" text="Shop Now" />
          </div>
        </div>

        <div className={styles['scene-front']} aria-hidden="true">
          {BARS.filter((bar) => bar.depth === 'mid').map(renderBar)}
          <div data-travel="foam" className={styles['foam']}>
            <img data-foam src={HeroFoam} alt="" width={2400} height={858} decoding="async" />
          </div>
          {BARS.filter((bar) => bar.depth === 'near').map(renderBar)}
        </div>
      </div>
    </section>
  );
}
