import {ABOUT_PAGE} from '~/content/about';
import {cn} from '~/utils/cn';
import type {Route} from './+types/about';

export const meta: Route.MetaFunction = () => {
  return [
    {title: ABOUT_PAGE.meta.title},
    {name: 'description', content: ABOUT_PAGE.meta.description},
  ];
};

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <article className="px-6 sm:px-10 py-12 sm:py-20 max-w-7xl mx-auto">
        {/* Hero Section */}
        <header className="mb-16 sm:mb-24 max-w-3xl">
          <h1 className="text-fluid-display mb-4 text-[var(--text-primary)]">
            {ABOUT_PAGE.hero.title}
          </h1>
          <p className="text-fluid-heading text-[var(--text-muted)]">
            {ABOUT_PAGE.hero.subtitle}
          </p>
        </header>

        {/* Founder Story Section */}
        <section className={cn('mb-16 sm:mb-20 max-w-3xl')}>
          <h2 className="text-fluid-heading mb-6 text-[var(--text-primary)]">
            {ABOUT_PAGE.founderStory.heading}
          </h2>
          {ABOUT_PAGE.founderStory.content.map((paragraph, i) => (
            <p
              key={i}
              className="text-fluid-body text-[var(--text-primary)] mb-4 leading-relaxed"
            >
              {paragraph}
            </p>
          ))}
        </section>

        {/* Placeholder for founder image */}
        <div className="mb-16 sm:mb-20 max-w-md ml-auto">
          <div
            className="aspect-[3/4] bg-[var(--canvas-elevated)] rounded-sm flex items-center justify-center"
            role="img"
            aria-label={ABOUT_PAGE.images.founder.alt}
          >
            <span className="text-fluid-small text-[var(--text-muted)]">
              Photo coming soon
            </span>
          </div>
        </div>

        {/* Isla's Namesake Section */}
        <section className={cn('mb-16 sm:mb-20 max-w-2xl mx-auto')}>
          <h2 className="text-fluid-heading mb-6 text-[var(--text-primary)]">
            {ABOUT_PAGE.islaNameSake.heading}
          </h2>
          {ABOUT_PAGE.islaNameSake.content.map((paragraph, i) => (
            <p
              key={i}
              className="text-fluid-body text-[var(--text-primary)] mb-4 leading-relaxed"
            >
              {paragraph}
            </p>
          ))}
        </section>

        {/* Placeholder for workshop image */}
        <div className="mb-16 sm:mb-20 max-w-xl">
          <div
            className="aspect-video bg-[var(--canvas-elevated)] rounded-sm flex items-center justify-center"
            role="img"
            aria-label={ABOUT_PAGE.images.workshop.alt}
          >
            <span className="text-fluid-small text-[var(--text-muted)]">
              Photo coming soon
            </span>
          </div>
        </div>

        {/* Recipe Heritage Section */}
        <section className={cn('mb-16 sm:mb-20 max-w-3xl ml-auto')}>
          <h2 className="text-fluid-heading mb-6 text-[var(--text-primary)]">
            {ABOUT_PAGE.recipeHeritage.heading}
          </h2>
          {ABOUT_PAGE.recipeHeritage.content.map((paragraph, i) => (
            <p
              key={i}
              className="text-fluid-body text-[var(--text-primary)] mb-4 leading-relaxed"
            >
              {paragraph}
            </p>
          ))}
        </section>

        {/* Craftsmanship Section */}
        <section className={cn('mb-16 sm:mb-20 max-w-3xl')}>
          <h2 className="text-fluid-heading mb-6 text-[var(--text-primary)]">
            {ABOUT_PAGE.craftsmanship.heading}
          </h2>
          {ABOUT_PAGE.craftsmanship.content.map((paragraph, i) => (
            <p
              key={i}
              className="text-fluid-body text-[var(--text-primary)] mb-4 leading-relaxed"
            >
              {paragraph}
            </p>
          ))}
        </section>

        {/* Placeholder for market booth image */}
        <div className="max-w-xl ml-auto">
          <div
            className="aspect-video bg-[var(--canvas-elevated)] rounded-sm flex items-center justify-center"
            role="img"
            aria-label={ABOUT_PAGE.images.market.alt}
          >
            <span className="text-fluid-small text-[var(--text-muted)]">
              Photo coming soon
            </span>
          </div>
        </div>
      </article>
    </div>
  );
}
