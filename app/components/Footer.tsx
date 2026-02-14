import {Suspense, useEffect, useRef, useState} from 'react';
import {useNavigate, useLocation, Await, NavLink} from 'react-router';
import {cn} from '~/utils/cn';
// import {Picture} from './Picture';
import styles from './Footer.module.css';
import {NewsletterSignup} from './ui/NewsletterSignup';
import {SocialLinks} from './ui/SocialLinks';
// import SliderDipImage from '../assets/images/slider-dip.png?responsive';
import type {FooterQuery, HeaderQuery} from 'storefrontapi.generated';

interface FooterProps {
  footer: Promise<FooterQuery | null>;
  header: HeaderQuery;
  publicStoreDomain: string;
}

export function Footer({footer: footerPromise, header, publicStoreDomain}: FooterProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const footerRef = useRef<HTMLDivElement>(null);
  const [footerHeight, setFooterHeight] = useState(0);

  useEffect(() => {
    if (!footerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        // use borderBoxSize if available for precise outer height (including padding/borders), fallback to contentRect
        const height = entry.borderBoxSize?.[0]?.blockSize ?? entry.contentRect.height;
        setFooterHeight(height);
      }
    });
    observer.observe(footerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div style={{height: footerHeight}} />
      <div ref={footerRef} className="fixed bottom-0 w-full z-1" style={{zIndex: 1}}>
        <Suspense>
          <Await resolve={footerPromise}>
            {(footer) => (
              <footer className={cn(styles['footer'], `${styles.footer}`)}>
                {/* <Picture src={SliderDipImage} alt="Slider Dip" loading="lazy" /> */}

                <div className={styles['footer-content-container']}>
                  <h2 className={styles['heading-teg-wrapper']}>
                    <div className={styles['header-tag']}>#SOAP_IS_DOPE</div>
                  </h2>

                  <SocialLinks />

                  <div className={styles['footer-grid']}>
                    <div className={styles['grid-column']}>
                      <a href="/products" className={styles['footer-link']}>
                        Products
                      </a>
                    </div>

                    <div className={styles['grid-column']}>
                      <a href="/stores" className={styles['footer-link']}>
                        Stores
                      </a>
                      <a href="/wholesale" className={styles['footer-link']}>
                        Wholesale
                      </a>
                    </div>

                    <div className={styles['grid-column']}>
                      <a href="/about-us" className={styles['footer-link']}>
                        About Us
                      </a>
                      <a href="/contact-us" className={styles['footer-link']}>
                        Contact
                      </a>
                    </div>

                    <div className={styles['grid-spacer']}></div>

                    <NewsletterSignup />

                    <div className={styles['copyright-wrapper']}>
                      <p className={styles['copyright-text']}>
                        © {new Date().getFullYear()} Isla Suds - All Rights Reserved
                      </p>
                    </div>

                    <div className={styles['policies-wrapper']}>
                      <a href="/privacy-policy" className={styles['footer-link-muted']}>
                        Privacy Policy
                      </a>
                      <a href="/terms-of-use" className={styles['footer-link-muted']}>
                        Terms of Service
                      </a>
                    </div>
                  </div>
                </div>
              </footer>
            )}
          </Await>
        </Suspense>
      </div>
    </>
  );
}

function FooterMenu({
  menu,
  primaryDomainUrl,
  publicStoreDomain,
}: {
  menu: FooterQuery['menu'];
  primaryDomainUrl: FooterProps['header']['shop']['primaryDomain']['url'];
  publicStoreDomain: string;
}) {
  const classes =
    'transition-colors inline-block uppercase text-xs text-[var(--text-primary)] opacity-50 hover:text-[var(--accent-primary)] hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] focus-visible:ring-offset-2 transition duration-300';
  return (
    <nav className="flex gap-6 text-sm text-gray-400" role="navigation" aria-label="Footer navigation">
      {(menu || FALLBACK_FOOTER_MENU).items.map((item) => {
        if (!item.url) return null;
        // if the url is internal, we strip the domain (only when we have a base URL)
        const hasAbsoluteUrl =
          item.url.includes('myshopify.com') ||
          item.url.includes(publicStoreDomain) ||
          (primaryDomainUrl && item.url.includes(primaryDomainUrl));
        const url = hasAbsoluteUrl ? new URL(item.url, primaryDomainUrl || 'https://localhost').pathname : item.url;
        const isExternal = !url.startsWith('/');
        return isExternal ? (
          <a href={url} key={item.id} rel="noopener noreferrer" target="_blank" className={classes}>
            {item.title}
          </a>
        ) : (
          <NavLink className={classes} end key={item.id} prefetch="intent" style={activeLinkStyle} to={url}>
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
    {
      id: 'footer-wholesale',
      resourceId: null,
      tags: [],
      title: 'Wholesale',
      type: 'PAGE',
      url: '/wholesale/login',
      items: [],
    },
    // Legal links
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

function activeLinkStyle({isActive, isPending}: {isActive: boolean; isPending: boolean}) {
  return {
    fontWeight: isActive ? 'bold' : undefined,
    color: isPending ? 'var(--text-muted)' : 'var(--text-primary)',
  };
}
