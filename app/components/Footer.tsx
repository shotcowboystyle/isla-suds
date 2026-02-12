import {Suspense} from 'react';
import {useNavigate, useLocation, Await, NavLink} from 'react-router';
import {Picture} from './Picture';
import {NewsletterSignup} from './ui/NewsletterSignup';
import {SocialLinks} from './ui/SocialLinks';
import SliderDipImage from '../assets/images/slider-dip.png?responsive';
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
    <Suspense>
      <Await resolve={footerPromise}>
        {(footer) => (
          <footer className="flex min-h-screen flex-col bg-canvas-base text-text-muted -z-1 fixed bottom-0">
            <Picture src={SliderDipImage} alt="Slider Dip" loading="lazy" />

            <div className="flex flex-1 flex-col items-center justify-center px-6 py-20">
              <h2 className="mb-16 text-center text-8xl font-black tracking-tight max-md:text-6xl max-sm:text-4xl">
                #SOAP_IS_DOPE
              </h2>

              <SocialLinks />
              <NewsletterSignup />

              <div className="border-t border-gray-800 px-6 py-8">
                <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 md:flex-row md:items-center">
                  {/* Left Side - Logo and Links */}
                  <div className="flex flex-col gap-8 md:flex-row md:gap-16">
                    <div>
                      <h3 className="mb-4 text-2xl font-bold">Isla Suds</h3>
                    </div>
                  </div>

                  {/* Right Side*/}
                  <FooterMenu
                    menu={footer?.menu || null}
                    primaryDomainUrl={header.shop.primaryDomain?.url ?? ''}
                    publicStoreDomain={publicStoreDomain}
                  />

                  <button
                    onClick={() => {
                      const currentPath = location.pathname;
                      const newUrl = `${currentPath}?select-store=true`;
                      void navigate(newUrl, {replace: true});
                    }}
                    className="text-left cursor-pointer inline-block uppercase text-xs text-black dark:text-white opacity-50 hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] focus-visible:ring-offset-2 duration-300 transition"
                  >
                    SELECT STORE
                  </button>
                </div>

                <div className="mx-auto mt-8 max-w-7xl text-sm text-gray-500">
                  © {new Date().getFullYear()} Isla Suds
                </div>
              </div>

              <div className="grid gap-2 sm:gap-2">
                <button
                  onClick={() => {
                    const currentPath = location.pathname;
                    const newUrl = `${currentPath}?select-store=true`;
                    void navigate(newUrl, {replace: true});
                  }}
                  className="text-left cursor-pointer inline-block uppercase text-xs text-black dark:text-white opacity-50 hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] focus-visible:ring-offset-2 duration-300 transition"
                >
                  SELECT STORE
                </button>
                <div className="inline-block uppercase text-xs" style={{color: 'var(--text-muted)'}}>
                  © {new Date().getFullYear()} Isla Suds
                </div>
              </div>
            </div>
          </footer>
        )}
      </Await>
    </Suspense>
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
