import type {Route} from './+types/dev.typography';

export const meta: Route.MetaFunction = () => {
  return [{title: 'Typography Verification | Isla Suds'}];
};

export default function TypographyVerification() {
  const scales = [
    {
      name: 'Fluid Small',
      class: 'text-fluid-small',
      range: '0.75rem → 0.875rem',
      lh: '1.4',
    },
    {
      name: 'Fluid Body',
      class: 'text-fluid-body',
      range: '1rem → 1.25rem',
      lh: '1.6',
    },
    {
      name: 'Fluid Heading',
      class: 'text-fluid-heading',
      range: '1.5rem → 2.5rem',
      lh: '1.2',
    },
    {
      name: 'Fluid Display',
      class: 'text-fluid-display',
      range: '2.5rem → 6rem',
      lh: '1.1',
    },
  ];

  return (
    <div className="p-spacing-xl bg-canvas-base min-h-screen text-text-primary">
      <header className="mb-spacing-2xl border-b border-text-muted/20 pb-spacing-md">
        <h1 className="text-fluid-heading font-bold">Typography Verification</h1>
        <p className="text-fluid-body text-text-muted">
          Testing fluid scale from 320px to 2560px. Resize your browser to verify smooth scaling.
        </p>
      </header>

      <div className="space-y-spacing-2xl">
        {scales.map((scale) => (
          <section key={scale.name} className="space-y-spacing-sm">
            <div className="flex items-baseline justify-between border-b border-text-muted/10 pb-spacing-xs">
              <h2 className="text-sm font-mono uppercase tracking-wider text-text-muted">
                {scale.name} ({scale.range})
              </h2>
              <span className="text-xs font-mono text-text-muted">
                LH: {scale.lh}
              </span>
            </div>
            <p className={scale.class}>
              The quick brown fox jumps over the lazy dog. Isla Suds handcrafted soaps and sustainable suds for a cleaner tomorrow.
            </p>
          </section>
        ))}
      </div>

      <footer className="mt-spacing-2xl pt-spacing-md border-t border-text-muted/20 text-xs font-mono text-text-muted">
        <p>Target Viewports: 320px | 768px | 1440px | 2560px</p>
      </footer>
    </div>
  );
}
