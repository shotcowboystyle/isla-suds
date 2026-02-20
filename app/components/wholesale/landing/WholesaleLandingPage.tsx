import {LocalStores} from '~/components/story/LocalStores';
import {TestimonialsSection} from '~/components/story/Testimonials';
import {Hero} from './Hero';
import {IntroSection} from './IntroSection';
import {PerksSection} from './PerksSection';

export function WholesaleLandingPage() {
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
