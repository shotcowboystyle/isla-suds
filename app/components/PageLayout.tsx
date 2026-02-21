import {Suspense, useState} from 'react';
import {Await, useLocation} from 'react-router';
import {Aside} from '~/components/Aside';
import {CartMain} from '~/components/CartMain';
import {Footer} from '~/components/Footer';
import {Header} from '~/components/Header';
import type {CartApiQueryFragment, FooterQuery, HeaderQuery} from 'storefrontapi.generated';

interface PageLayoutProps {
  cart: Promise<CartApiQueryFragment | null>;
  footer: Promise<FooterQuery | null>;
  header: HeaderQuery;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
  children?: React.ReactNode;
  theme: any;
  setTheme: any;
}

export function PageLayout({
  cart,
  children = null,
  footer,
  header,
  isLoggedIn,
  publicStoreDomain,
  theme,
  setTheme,
}: PageLayoutProps) {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const [footerHeight, setFooterHeight] = useState(0);

  return (
    <Aside.Provider>
      {/* Skip link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-(--accent-primary) focus:text-white focus:rounded focus:outline-2 focus:outline-offset-2 focus:outline-(--accent-primary)"
      >
        Skip to main content
      </a>

      <div className="z-20">
        <CartAside cart={cart} />
      </div>

      {header && <Header header={header} cart={cart} isLoggedIn={isLoggedIn} publicStoreDomain={publicStoreDomain} />}

      {/* Story 2.2: scroll-snap-type is on html (app.css) for mobile—viewport is scroll container.
          Sections (hero, featured, etc.) use snap-start. Desktop: Lenis handles scroll. */}
      {/* Footer reveal: main needs z-index > footer (0 or 1) and background color to cover footer. */}

      {isHome ? (
        <>
          <div id="smooth-wrapper" className="relative z-10">
            <div id="smooth-content" className="relative">
              <main id="main-content" className="relative overflow-hidden z-10 bg-black">
                {children}
              </main>
              <Footer
                footer={footer}
                header={header}
                publicStoreDomain={publicStoreDomain}
                // disableSpacer
                onHeightChange={setFooterHeight}
              />
            </div>
          </div>
        </>
      ) : (
        <>
          <main id="main-content" className="relative overflow-hidden z-10 bg-black">
            {children}
          </main>
          <Footer footer={footer} header={header} publicStoreDomain={publicStoreDomain} />
        </>
      )}
    </Aside.Provider>
  );
}

function CartAside({cart}: {cart: PageLayoutProps['cart']}) {
  return (
    <Aside type="cart" heading="CART">
      <Suspense fallback={<p>Loading cart ...</p>}>
        <Await resolve={cart}>
          {(cart) => {
            return <CartMain cart={cart} layout="aside" />;
          }}
        </Await>
      </Suspense>
    </Aside>
  );
}
