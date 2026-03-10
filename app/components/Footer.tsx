import {Suspense, useEffect, useRef, useState} from 'react';
import {useNavigate, useLocation, Await, NavLink} from 'react-router';
import {AnimatedBubbles} from '~/components/AnimatedBubbles';
import {cn} from '~/utils/cn';
// import {Picture} from './Picture';
import styles from './Footer.module.css';
import {FooterLogo} from './FooterLogo';
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

  return (
    <>
      <div id="footer-wrapper" className="relative w-full z-1">
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
                    <div className="w-full">
                      <FooterMenu
                        menu={footer?.menu}
                        primaryDomainUrl={header.shop.primaryDomain.url}
                        publicStoreDomain={publicStoreDomain}
                      />
                    </div>

                    <NewsletterSignup />

                    <div className={styles['policies-wrapper']}>
                      {FALLBACK_FOOTER_POLICIES.items.map((item) => (
                        <a href={item.url} className={styles['footer-link-muted']} key={item.id}>
                          {item.title}
                        </a>
                      ))}
                    </div>

                    <div className={styles['copyright-wrapper']}>
                      <p className={styles['copyright-text']}>
                        © {new Date().getFullYear()} Isla Suds - All Rights Reserved
                      </p>
                    </div>
                  </div>
                </div>

                {/* <div className="footer-logo-wrapper">
                  <FooterLogo />
                  <AnimatedBubbles />
                </div> */}
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
    'transition-colors inline-block text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-secondary)] focus-visible:ring-offset-2 transition duration-300';
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
            className={cn(styles['footer-link'], classes)}
          >
            {item.title}
          </a>
        ) : (
          <NavLink
            className={cn(styles['footer-link'], classes)}
            end
            key={item.id}
            prefetch="intent"
            style={({isPending}) => ({
              fontWeight: isActive ? 'bold' : undefined,
              color: isPending ? 'var(--color-neutral-400)' : 'var(--color-secondary)',
            })}
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
