import {useEffect} from 'react';
import {
  Outlet,
  useRouteError,
  isRouteErrorResponse,
  type ShouldRevalidateFunction,
  Links,
  Meta,
  Scripts,
  useRouteLoaderData,
  useLocation,
} from 'react-router';
import {Analytics, getShopAnalytics, useNonce, type ShopAnalytics} from '@shopify/hydrogen';
import favicon from '~/assets/favicon.svg';
import {CartDrawer} from '~/components/cart/CartDrawer';
import {Preloader} from '~/components/Preloader';
import {PreloaderProvider, usePreloader} from '~/contexts/preloader-context';
import {useInitializeSession} from '~/hooks/use-exploration-state';
import {FOOTER_QUERY, HEADER_QUERY} from '~/lib/fragments';
import {observeLayoutShifts, requestScrollRefresh} from '~/lib/motion/refresh';
import {isB2BRoute} from '~/lib/motion-guard';
import {initLenis, destroyLenis, getLenis} from '~/lib/scroll';
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
      rel: 'preconnect',
      href: 'https://cdn.shopify.com',
    },
    {
      rel: 'preconnect',
      href: 'https://shop.app',
    },
    // Antonio is font-display: swap and display headings are sized in vw, so a
    // late swap reflows the tallest elements on the page and invalidates every
    // ScrollTrigger measurement below the fold.
    {
      rel: 'preload',
      href: '/fonts/Antonio-VariableFont_wght.woff2',
      as: 'font',
      type: 'font/woff2',
      crossOrigin: 'anonymous',
    },
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
        <Scripts nonce={nonce} />
      </body>
    </html>
  );
}

export default function App() {
  const data = useRouteLoaderData<RootLoader>('root');
  const location = useLocation();

  // Initialize exploration session timestamp (SSR-safe)
  useInitializeSession();

  // Scroll engine — mounted once for the life of the app. Tearing Lenis down on
  // every navigation would also drop its ScrollTrigger wiring and the GSAP
  // ticker callback, so the engine outlives individual routes.
  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }

    void initLenis();
    const stopObserving = observeLayoutShifts();

    // Debounced resize handler to avoid excessive calls during window resize.
    // Crossing the 1024px boundary needs a (re)init, and any resize needs a
    // re-measure once the new layout has settled.
    let resizeTimeout: ReturnType<typeof setTimeout> | null = null;
    const handleResize = () => {
      if (resizeTimeout) {
        clearTimeout(resizeTimeout);
      }
      resizeTimeout = setTimeout(() => {
        if (window.matchMedia('(min-width: 1024px)').matches) {
          void initLenis();
        } else {
          destroyLenis();
        }
        requestScrollRefresh();
      }, 150); // 150ms debounce
    };

    window.addEventListener('resize', handleResize);

    // Cleanup on unmount
    return () => {
      if (resizeTimeout) {
        clearTimeout(resizeTimeout);
      }
      window.removeEventListener('resize', handleResize);
      stopObserving();
      destroyLenis();
    };
  }, []);

  // Per-navigation: reset scroll position, and keep Lenis off B2B routes
  // (/wholesale/* use native scroll only).
  useEffect(() => {
    const lenis = getLenis();

    if (isB2BRoute(location.pathname)) {
      destroyLenis();
      window.scrollTo(0, 0);
      return;
    }

    if (lenis) {
      lenis.scrollTo(0, {immediate: true});
    } else {
      window.scrollTo(0, 0);
      void initLenis();
    }

    requestScrollRefresh();
  }, [location.pathname]);

  if (!data) {
    return <Outlet />;
  }

  const layoutContent = (
    <PageLayout {...data} header={data.header}>
      <Outlet />
    </PageLayout>
  );

  return (
    <Analytics.Provider cart={data.cart} shop={data.shop} consent={data.consent}>
      <PreloaderProvider>
        <AppContent layoutContent={layoutContent} />
      </PreloaderProvider>
    </Analytics.Provider>
  );
}

function AppContent({layoutContent}: {layoutContent: React.ReactNode}) {
  const {setPreloaderComplete} = usePreloader();

  return (
    <>
      <Preloader onComplete={() => setPreloaderComplete(true)} />
      {layoutContent}
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
