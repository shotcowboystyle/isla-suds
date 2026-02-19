import {Hero} from './Hero';
import {IntroSection} from './IntroSection';
import {StatementSection} from './StatementSection';
import {PerksSection} from './PerksSection';

export function WholesaleLandingPage() {
  return (
    <main className="w-full">
      <Hero />
      <IntroSection />
      <StatementSection />
      <PerksSection />
    </main>
  );
}
