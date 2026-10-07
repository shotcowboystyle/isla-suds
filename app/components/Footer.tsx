import {Suspense, useRef} from 'react';
import {Await, NavLink, useLocation} from 'react-router';
import {useGSAP} from '@gsap/react';
import GSAP from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {FOOTER} from '~/content/footer';
import {MOTION_QUERY, REVEAL_START} from '~/lib/motion/tokens';
import {cn} from '~/utils/cn';
import styles from './Footer.module.css';
import {FooterBath} from './FooterBath';
import {NewsletterSignup} from './ui/NewsletterSignup';
import {SocialLinks} from './ui/SocialLinks';
import type {FooterQuery, HeaderQuery} from 'storefrontapi.generated';

if (typeof document !== 'undefined') {
  GSAP.registerPlugin(ScrollTrigger, useGSAP);
}

interface FooterProps {
  footer: Promise<FooterQuery | null>;
  header: HeaderQuery;
  publicStoreDomain: string;
}

export function Footer({footer: footerPromise, header, publicStoreDomain}: FooterProps) {
  return (
    <div id="footer-wrapper" className="relative w-full z-1">
      <Suspense>
        <Await resolve={footerPromise}>
          {(footer) => (
            <FooterBody
              menu={footer?.menu}
              primaryDomainUrl={header.shop.primaryDomain.url}
              publicStoreDomain={publicStoreDomain}
            />
          )}
        </Await>
      </Suspense>
    </div>
  );
}

/**
 * The close of every page. Lives inside `Await` so its `useGSAP` runs once the
 * `<footer>` actually exists.
 */
function FooterBody({
  menu,
  primaryDomainUrl,
  publicStoreDomain,
}: {
  menu: FooterQuery['menu'] | undefined;
  primaryDomainUrl: string;
  publicStoreDomain: string;
}) {
  const footerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = GSAP.matchMedia();

      // The sticker and the hashtag slap onto the sign-off. CSS holds the landed state.
      mm.add(MOTION_QUERY, () => {
        GSAP.fromTo(
          '[data-slap]',
          {scale: 1.6, opacity: 0, rotate: -8},
          {
            scale: 1,
            opacity: 1,
            rotate: 0,
            duration: 0.55,
            ease: 'back.out(2.4)',
            stagger: 0.2,
            scrollTrigger: {
              trigger: '[data-signoff]',
              start: `clamp(${REVEAL_START})`,
              toggleActions: 'play none none reverse',
            },
          },
        );
      });

      return () => mm.revert();
    },
    {scope: footerRef},
  );

  return (
    <footer ref={footerRef} className={styles.footer}>
      <div className={styles.top}>
        <div data-signoff className={styles.signoff}>
          <h2 className={styles.heading}>
            <span className={styles.lead}>{FOOTER.signoff.lead}</span>{' '}
            <span className={styles['sticker-tilt']}>
              <span data-slap className={styles.sticker}>
                {FOOTER.signoff.sticker}
              </span>
            </span>
          </h2>
          <p className={styles['hashtag-tilt']}>
            <span data-slap className={styles.hashtag}>
              {FOOTER.hashtag}
            </span>
          </p>
        </div>

        <NewsletterSignup />
      </div>

      {/* The last screen of the visit: links up top, the tub landing at the bottom. */}
      <div className={styles.finale}>
        <div className={styles.links}>
          <FooterMenu menu={menu} primaryDomainUrl={primaryDomainUrl} publicStoreDomain={publicStoreDomain} />
          <SocialLinks />
        </div>

        <FooterBath>
          <p className={styles.legal}>
            <span>© {new Date().getFullYear()} Isla Suds</span>
            {FALLBACK_FOOTER_POLICIES.items.map((item) => (
              <a href={item.url} className={styles['legal-link']} key={item.id}>
                {item.title}
              </a>
            ))}
            <span className={styles['made-by']}>{FOOTER.madeBy}</span>
          </p>
        </FooterBath>
      </div>
    </footer>
  );
}

function FooterMenu({
  menu,
  primaryDomainUrl,
  publicStoreDomain,
}: {
  menu: FooterQuery['menu'] | undefined;
  primaryDomainUrl: string;
  publicStoreDomain: string;
}) {
  const classes =
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-secondary)] focus-visible:ring-offset-2 focus-visible:ring-offset-black';
  const location = useLocation();

  return (
    <nav className={styles['links-grid']} role="navigation" aria-label="Footer navigation">
      {/* {(menu || FALLBACK_FOOTER_MENU).items.map((item) => { */}
      {FALLBACK_FOOTER_MENU.items.map((item) => {
        if (!item.url) {
          return null;
        }

        // if the url is internal, we strip the domain (only when we have a base URL)
        const hasAbsoluteUrl =
          item.url.includes('myshopify.com') ||
          item.url.includes(publicStoreDomain) ||
          (primaryDomainUrl && item.url.includes(primaryDomainUrl));
        const url = hasAbsoluteUrl ? new URL(item.url, primaryDomainUrl || 'https://localhost').pathname : item.url;
        const isExternal = !url.startsWith('/');

        let isActive = false;
        if (url === '/') {
          isActive = location.pathname === '/';
        } else if (url.startsWith('/collections')) {
          isActive = location.pathname.startsWith('/collections') || location.pathname.startsWith('/products');
        } else {
          isActive = location.pathname.startsWith(url);
        }

        return isExternal ? (
          <a
            href={url}
            key={item.id}
            rel="noopener noreferrer"
            target="_blank"
            className={cn(styles.link, classes)}
          >
            {item.title}
          </a>
        ) : (
          <NavLink
            className={cn(styles.link, classes, isActive && styles.active)}
            end
            key={item.id}
            prefetch="intent"
            to={url}
          >
            {item.title}
          </NavLink>
        );
      })}
    </nav>
  );
}

const FALLBACK_FOOTER_MENU = {
  id: 'gid://shopify/Menu/199655620664',
  items: [
    // Navigation links
    {
      id: 'footer-home',
      resourceId: null,
      tags: [],
      title: 'Home',
      type: 'FRONTPAGE',
      url: '/',
      items: [],
    },
    {
      id: 'footer-shop',
      resourceId: null,
      tags: [],
      title: 'Shop',
      type: 'PAGE',
      url: '/collections/frontpage',
      items: [],
    },
    {
      id: 'footer-stores',
      resourceId: null,
      tags: [],
      title: 'Stores',
      type: 'PAGE',
      url: '/locations',
      items: [],
    },
    {
      id: 'footer-partners',
      resourceId: null,
      tags: [],
      title: 'Wholesale',
      type: 'PAGE',
      url: '/partners',
      items: [],
    },
    {
      id: 'footer-about',
      resourceId: null,
      tags: [],
      title: 'About',
      type: 'PAGE',
      url: '/about',
      items: [],
    },
    {
      id: 'footer-contact',
      resourceId: null,
      tags: [],
      title: 'Contact',
      type: 'PAGE',
      url: '/contact',
      items: [],
    },
  ],
};
const FALLBACK_FOOTER_POLICIES = {
  id: 'footer-policies',
  items: [
    {
      id: 'gid://shopify/MenuItem/461633060920',
      resourceId: 'gid://shopify/ShopPolicy/23358046264',
      tags: [],
      title: 'Privacy Policy',
      type: 'SHOP_POLICY',
      url: '/policies/privacy-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633159224',
      resourceId: 'gid://shopify/ShopPolicy/23358079032',
      tags: [],
      title: 'Terms of Service',
      type: 'SHOP_POLICY',
      url: '/policies/terms-of-service',
      items: [],
    },
  ],
};
