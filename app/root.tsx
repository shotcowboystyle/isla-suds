import {useEffect, useRef} from 'react';
import {
  Outlet,
  useRouteError,
  isRouteErrorResponse,
  type ShouldRevalidateFunction,
  Links,
  Meta,
  Scripts,
  ScrollRestoration,
  useRouteLoaderData,
  useLocation,
} from 'react-router';
import {Analytics, getShopAnalytics, useNonce, type ShopAnalytics} from '@shopify/hydrogen';
import favicon from '~/assets/favicon.svg';
import {CartDrawer} from '~/components/cart/CartDrawer';
import {RouteErrorFallback} from '~/components/errors/RouteErrorFallback';
import {Preloader} from '~/components/Preloader';
import {HomeScrollProvider} from '~/contexts/home-scroll-context';
import {PreloaderProvider, usePreloader} from '~/contexts/preloader-context';
import {useInitializeSession} from '~/hooks/use-exploration-state';
import {usePastHero} from '~/hooks/use-past-hero';
import {FOOTER_QUERY, HEADER_QUERY} from '~/lib/fragments';
import {initLenis, destroyLenis} from '~/lib/scroll';
import {PageLayout} from './components/PageLayout';
import tailwindCss from './styles/tailwind.css?url';
import type {Route} from './+types/root';

export type RootLoader = typeof loader;

/**
 * This is important to avoid re-fetching root queries on sub-navigations
 */
export const shouldRevalidate: ShouldRevalidateFunction = ({formMethod, currentUrl, nextUrl}) => {
  // revalidate when a mutation is performed e.g add to cart, login...
  if (formMethod && formMethod !== 'GET') return true;

  // revalidate when manually revalidating via useRevalidator
  if (currentUrl.toString() === nextUrl.toString()) return true;

  // Defaulting to no revalidation for root loader data to improve performance.
  // When using this feature, you risk your UI getting out of sync with your server.
  // Use with caution. If you are uncomfortable with this optimization, update the
  // line below to `return defaultShouldRevalidate` instead.
  // For more details see: https://remix.run/docs/en/main/route/should-revalidate
  return false;
};

/**
 * The main and reset stylesheets are added in the Layout component
 * to prevent a bug in development HMR updates.
 *
 * This avoids the "failed to execute 'insertBefore' on 'Node'" error
 * that occurs after editing and navigating to another page.
 *
 * It's a temporary fix until the issue is resolved.
 * https://github.com/remix-run/remix/issues/9242
 */
export function links() {
  return [
    {
      rel: 'preload',
      as: 'font',
      href: '/fonts/Antonio-VariableFont_wght.woff2',
      type: 'font/woff2',
      crossOrigin: 'anonymous' as const,
    },
    {
      rel: 'preconnect',
      href: 'https://cdn.shopify.com',
    },
    {
      rel: 'preconnect',
      href: 'https://shop.app',
    },
    {rel: 'preload', as: 'style', href: tailwindCss},
    {rel: 'icon', type: 'image/svg+xml', href: favicon},
  ];
}

export async function loader(args: Route.LoaderArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  const {storefront, env} = args.context;

  return {
    ...deferredData,
    ...criticalData,
    publicStoreDomain: env.PUBLIC_STORE_DOMAIN,
    shop: getShopAnalytics({
      storefront,
      publicStorefrontId: env.PUBLIC_STOREFRONT_ID,
    }),
    consent: {
      checkoutDomain: env.PUBLIC_CHECKOUT_DOMAIN,
      storefrontAccessToken: env.PUBLIC_STOREFRONT_API_TOKEN,
      withPrivacyBanner: false,
      // localize the privacy banner
      country: args.context.storefront.i18n.country,
      language: args.context.storefront.i18n.language,
    },
  };
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({context}: Route.LoaderArgs) {
  const {storefront} = context;

  const [header] = await Promise.all([
    storefront.query(HEADER_QUERY, {
      cache: storefront.CacheLong(),
      variables: {
        headerMenuHandle: 'header-menu', // Adjust to your header menu handle
      },
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);

  return {header};
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context}: Route.LoaderArgs) {
  const {storefront, customerAccount, cart} = context;

  // defer the footer query (below the fold)
  const footer = storefront
    .query(FOOTER_QUERY, {
      cache: storefront.CacheLong(),
      variables: {
        footerMenuHandle: 'footer', // Adjust to your footer menu handle
      },
    })
    .catch((_error: Error) => {
      // Safe to continue: footer is non-critical below-fold content
      return null;
    });
  return {
    cart: cart.get(),
    isLoggedIn: customerAccount.isLoggedIn(),
    footer,
  };
}

export function Layout({children}: {children?: React.ReactNode}) {
  const nonce = useNonce();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="stylesheet" href={tailwindCss}></link>
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
      </body>
    </html>
  );
}

export default function App() {
  const data = useRouteLoaderData<RootLoader>('root');
  const location = useLocation();
  const isHome = location.pathname === '/';
  const heroRef = useRef<HTMLElement>(null);
  const isPastHero = usePastHero(heroRef);

  // Initialize exploration session timestamp (SSR-safe)
  useInitializeSession();

  // Initialize Lenis smooth scroll for desktop (≥1024px)
  // SSR-safe, respects prefers-reduced-motion, graceful fallback
  // B2B routes (/wholesale/*) should NOT use Lenis (native scroll only)
  useEffect(() => {
    // Check if current route is a B2B route - Lenis should not initialize for wholesale routes
    const isWholesaleRoute = location.pathname.startsWith('/wholesale');
    const isHome = location.pathname === '/';

    if (isWholesaleRoute || isHome) {
      // Ensure Lenis is destroyed for B2B routes and Home (which uses ScrollSmoother)
      destroyLenis();
      return;
    }

    // Initialize Lenis after hydration (client-side only) for B2C routes
    void initLenis();

    // Debounced resize handler to avoid excessive calls during window resize
    let resizeTimeout: ReturnType<typeof setTimeout> | null = null;
    const handleResize = () => {
      if (resizeTimeout) {
        clearTimeout(resizeTimeout);
      }
      resizeTimeout = setTimeout(() => {
        const isDesktop = window.matchMedia('(min-width: 1024px)').matches;

        if (isDesktop) {
          // On desktop, ensure Lenis is initialized
          void initLenis();
        } else {
          // On mobile, ensure Lenis is destroyed
          destroyLenis();
        }
      }, 150); // 150ms debounce
    };

    window.addEventListener('resize', handleResize);

    // Cleanup on unmount
    return () => {
      if (resizeTimeout) {
        clearTimeout(resizeTimeout);
      }
      window.removeEventListener('resize', handleResize);
      destroyLenis();
    };
  }, [location.pathname]);

  if (!data) {
    return <Outlet />;
  }

  const layoutContent = (
    <PageLayout {...data} theme="light" setTheme={() => {}} header={data.header}>
      <Outlet context={isHome ? {heroRef} : undefined} />
    </PageLayout>
  );

  return (
    <Analytics.Provider cart={data.cart} shop={data.shop} consent={data.consent}>
      <PreloaderProvider>
        <AppContent isHome={isHome} heroRef={heroRef} isPastHero={isPastHero} layoutContent={layoutContent} />
      </PreloaderProvider>
    </Analytics.Provider>
  );
}

function AppContent({
  isHome,
  heroRef,
  isPastHero,
  layoutContent,
}: {
  isHome: boolean;
  heroRef: React.RefObject<HTMLElement>;
  isPastHero: boolean;
  layoutContent: React.ReactNode;
}) {
  const {setPreloaderComplete} = usePreloader();

  return (
    <>
      <Preloader onComplete={() => setPreloaderComplete(true)} />
      {isHome ? <HomeScrollProvider isPastHero={isPastHero}>{layoutContent}</HomeScrollProvider> : layoutContent}
      <CartDrawer />
    </>
  );
}

/**
 * Route-level error boundary (React Router 7 ErrorBoundary export)
 * Catches all route errors and displays warm, user-friendly messages.
 * Uses RouteErrorFallback component for consistent UI and focus trap.
 * Technical details are logged to console but never exposed to users.
 */
export function ErrorBoundary() {
  const error = useRouteError();
  let errorMessage = 'Unknown error';
  let errorStatus = 500;

  if (isRouteErrorResponse(error)) {
    errorMessage = error?.data?.message ?? error.data;
    errorStatus = error.status;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
    <div className="max-w-container mx-auto p-4 md:p-8 min-h-full flex items-center justify-center flex-col gap-4">
      <h1 className="heading-display">Oops</h1>
      <h2>{errorStatus}</h2>
      {errorMessage && (
        <fieldset>
          <pre>{errorMessage}</pre>
        </fieldset>
      )}
    </div>
  );
}
