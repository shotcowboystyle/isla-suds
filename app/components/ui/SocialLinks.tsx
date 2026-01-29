/**
 * SocialLinks Component
 * Displays placeholder social media icons for Instagram, Facebook, and Twitter/X
 * Icons are disabled until real social links are configured
 */

interface SocialLink {
  platform: string;
  name: string;
  ariaLabel: string;
  icon: React.ReactNode;
}

const SOCIAL_LINKS: SocialLink[] = [
  {
    platform: 'instagram',
    name: 'Instagram',
    ariaLabel: 'Isla Suds on Instagram (coming soon)',
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <rect
          x="2"
          y="2"
          width="20"
          height="20"
          rx="5"
          stroke="currentColor"
          strokeWidth="2"
        />
        <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
        <circle cx="18" cy="6" r="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    platform: 'facebook',
    name: 'Facebook',
    ariaLabel: 'Isla Suds on Facebook (coming soon)',
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    platform: 'twitter',
    name: 'Twitter / X',
    ariaLabel: 'Isla Suds on X (coming soon)',
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

export function SocialLinks() {
  return (
    <div
      data-testid="social-icons"
      className="flex gap-4"
      role="list"
      aria-label="Social media links"
    >
      {SOCIAL_LINKS.map((link) => (
        <div
          key={link.platform}
          className="w-11 h-11 flex items-center justify-center rounded-full bg-[var(--canvas-elevated)] opacity-50 cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] focus-visible:ring-offset-2"
          role="listitem"
          aria-label={link.ariaLabel}
          aria-disabled="true"
          title="Coming soon"
          data-platform={link.platform}
          tabIndex={0}
        >
          {link.icon}
        </div>
      ))}
    </div>
  );
}
