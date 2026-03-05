import {LocalStores} from '~/components/LocalStores';
import {TestimonialsSection} from '~/components/Testimonials';
import {Hero} from './Hero';
import {IntroSection} from './IntroSection';
import {PerksSection} from './PerksSection';

export function PartnersLandingPage() {
  return (
    <main className="w-full">
      <Hero />
      <IntroSection />
      <PerksSection />
      <TestimonialsSection />
      <LocalStores />
    </main>
  );
}
