import {useState} from 'react';
import {useSearchParams} from 'react-router';
import DripImage from '~/assets/images/slider-dip.png';
import {PartnersApplicationForm, type ApplicationResult} from '~/components/partners/register/PartnersApplicationForm';
import {VENUES, toVenue, type VenueId} from '~/content/partners';
import {prefersReducedMotion} from '~/lib/motion';
import {getLenis} from '~/lib/scroll';
import {BeforeAfter} from './BeforeAfter';
import {GoatDelivery} from './GoatDelivery';
import {Hero} from './Hero';
import styles from './PartnersLandingPage.module.css';
import {PerkTags} from './PerkTags';
import {SellsItself} from './SellsItself';
import {VenueChip} from './VenueChip';

interface PartnersLandingPageProps {
  actionData?: ApplicationResult;
}

/**
 * The wholesale pitch. One choice, the kind of shop the visitor runs, restyles
 * every act below it. The choice starts from `?shop=` (shareable, and the
 * server renders the same venue the client does) and after that lives in
 * state; the URL is kept in step with `replaceState`, so switching is not a
 * navigation (no Shopify page view, no scroll reset).
 */
export function PartnersLandingPage({actionData}: PartnersLandingPageProps) {
  const [params] = useSearchParams();
  const [venue, setVenue] = useState<VenueId>(() => toVenue(params.get('shop')));

  const choose = (next: VenueId) => {
    setVenue(next);
    const url = new URL(window.location.href);
    url.searchParams.set('shop', next);
    // Keep React Router's own history state ({usr, key, idx}) intact.
    window.history.replaceState(window.history.state, '', url);
  };

  const apply = () => {
    const target = document.getElementById('apply');
    if (!target) return;
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(target, {offset: -24});
    else target.scrollIntoView({behavior: prefersReducedMotion() ? 'auto' : 'smooth'});
    document.getElementById('apply-name')?.focus({preventScroll: true});
  };

  return (
    <>
      <Hero venue={venue} onChoose={choose} onApply={apply} />
      <BeforeAfter venue={venue} />
      <SellsItself />
      <PerkTags onApply={apply} />
      <GoatDelivery venue={venue} />

      <section id="apply" className={styles['apply']} aria-labelledby="apply-title">
        <img src={DripImage} alt="" width={1920} height={292} loading="lazy" className={styles['drip']} />
        <div className={styles['apply-inner']}>
          <h2 id="apply-title" className={styles['apply-title']}>
            <span className={styles['apply-title-line']}>Become a</span>
            <span className={styles['apply-sticker']}>Suds Seller</span>
          </h2>
          <p className={styles['apply-lede']}>
            Tell us about your {VENUES[venue].possessive}. We&apos;ll get back to you within 1-2 business days.
          </p>
          <div className={styles['apply-card']}>
            <PartnersApplicationForm
              actionData={actionData}
              shopType={VENUES[venue].label}
              placeholder={VENUES[venue].placeholder}
            />
          </div>
        </div>
      </section>

      <VenueChip venue={venue} onChoose={choose} />
    </>
  );
}
