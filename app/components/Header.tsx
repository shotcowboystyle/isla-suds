import {Suspense, useEffect, useState} from 'react';
import {
  Await,
  NavLink,
  useAsyncValue,
  useLocation,
  useNavigate,
  useRouteLoaderData,
} from 'react-router';
import {useOptimisticCart} from '@shopify/hydrogen';
import {ShoppingBag} from 'lucide-react';
import {useAside} from '~/components/Aside';
import {Logo} from '~/components/Logo';
import {useHomeScroll} from '~/contexts/home-scroll-context';
import {useExplorationStore} from '~/stores/exploration';
import {cn} from '~/utils/cn';
import type {HeaderQuery, CartApiQueryFragment} from 'storefrontapi.generated';
import type {RootLoader} from '~/root';

interface HeaderProps {
  header: HeaderQuery;
  cart: Promise<CartApiQueryFragment | null>;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
}

type Viewport = 'desktop' | 'mobile';

export function Header({
  header,
  isLoggedIn,
  cart,
  publicStoreDomain,
}: HeaderProps) {
  const location = useLocation();
  const {shop, menu} = header;
  const isPathNotShowCloseButton =
    ['/'].includes(location.pathname) ||
    location.pathname.startsWith('/products');
  const navigate = useNavigate();

  // Story 2.5: Scroll-aware header on home page only
  const isHomePage = location.pathname === '/';
  const homeScroll = useHomeScroll();
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check for prefers-reduced-motion preference
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(mediaQuery.matches);

      const handleChange = (e: MediaQueryListEvent) => {
        setPrefersReducedMotion(e.matches);
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, []);

  // On home page: hide header when at hero (isPastHero = false)
  // On other pages: always show header
  const shouldShowHeader = !isHomePage || homeScroll?.isPastHero;

  return (
    <header
      className={cn(
        'sticky top-0 w-full z-20 bg-[var(--canvas-base)]/95 dark:bg-[var(--canvas-elevated)]/95 border-b sm:border-b-2 border-neutral-300 dark:border-[#2D2D2D] -mb-[2px]',
        // Story 2.5: GPU-composited fade for scroll-triggered visibility
        // Only apply transitions if NOT prefers-reduced-motion
        !prefersReducedMotion && 'transition-all duration-300',
        // When on home and not past hero, use GPU-composited properties to hide
        isHomePage && !shouldShowHeader && 'opacity-0 pointer-events-none',
      )}
      style={
        isHomePage && !shouldShowHeader && !prefersReducedMotion
          ? {
              // GPU-composited transform for smooth fade
              transform: 'translateY(-100%)',
            }
          : undefined
      }
    >
      <div className="h-[4.5rem] sm:h-24 px-[1.05rem] sm:px-6 flex items-center justify-end sm:justify-between relative gap-3">
        <NavLink
          prefetch="intent"
          to="/"
          style={activeLinkStyle}
          end
          className="absolute top-1/2 left-5 sm:left-1/2 transform sm:-translate-x-1/2 -translate-y-1/2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] focus-visible:ring-offset-2"
        >
          <div className="w-[8.13rem] sm:w-[16.06rem] aspect-[1/0.21] h-[2.19rem] sm:h-[3.44rem] dark:invert transition duration-300">
            <Logo />
          </div>
          <strong>{shop.name}</strong>
        </NavLink>

        <HeaderMenu
          menu={menu}
          viewport="desktop"
          primaryDomainUrl={header.shop.primaryDomain.url}
          publicStoreDomain={publicStoreDomain}
        />
        <HeaderCtas isLoggedIn={isLoggedIn} />

        {/* Story 5.10: Cart icon with badge */}
        <Suspense fallback={<CartIconButton itemCount={0} />}>
          <Await resolve={cart}>
            <CartIconButtonWrapper />
          </Await>
        </Suspense>

        {!isPathNotShowCloseButton && (
          <button
            className="group relative shrink-0 cursor-pointer"
            onClick={() => {
              if (location.pathname.startsWith('/order-succes')) {
                void navigate('/');
                return;
              }
              void navigate(-1);
              // if (location.pathname !== '/cart') {
              //   navigate('/');
              //   return;
              // }
              // document.referrer
              //   ? (window.location.href = document.referrer)
              //   : navigate('/');
            }}
          >
            <div className="absolute z-10 size-2 top-1/2 left-0 transform -translate-x-[35%] -translate-y-1/2 bg-white dark:bg-black group-hover:bg-black dark:group-hover:bg-white transition duration-300 border sm:border-2 border-neutral-300 rounded-full"></div>
            <div className="size-8 sm:size-9 bg-white dark:bg-black group-hover:bg-black dark:group-hover:bg-white transition duration-300 border sm:border-2 border-neutral-300 rounded-full relative">
              <div className="size-3 scale-110 leading-none absolute top-1/2 left-1/2 -translate-x-[30%] -translate-y-[55%] rotate-45 text-black dark:text-white group-hover:text-white dark:group-hover:text-black transition duration-300 flex">
                +
                {/* <svg
                  width="100%"
                  height="100%"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7.94548 6.49768L13.4949 0.948308L15.2258 2.6793L9.67647 8.22868L15.2513 13.8035L13.5203 15.5345L7.94548 9.95968L2.3961 15.5091L0.665105 13.7781L6.21448 8.22868L0.639648 2.65385L2.37065 0.922852L7.94548 6.49768Z"
                    fill="currentColor"
                  />
                </svg> */}
              </div>
            </div>
            <div className="sm:hidden h-[1px] sm:h-[2px] bg-neutral-300 w-3 absolute top-1/2 -translate-y-1/2 -left-3"></div>
            <div className="absolute z-10 size-2 top-1/2 right-0 transform translate-x-2/5 -translate-y-1/2 bg-white dark:bg-black group-hover:bg-black dark:group-hover:bg-white transition duration-300 border sm:border-2 border-neutral-300 rounded-full"></div>
          </button>
        )}
      </div>

      {/* dots */}
      <div className="absolute -bottom-[0.275rem] w-full flex items-center justify-between pl-[1.775rem] pr-[1.715rem] sm:pl-9 sm:pr-9">
        <div className="size-2 bg-white dark:bg-black border sm:border-2 border-neutral-300 dark:border-[#2D2D2D] transition duration-300 rounded-full"></div>
        {location.pathname === '/' && (
          <>
            <div className="size-2 bg-white dark:bg-black border sm:border-2 border-neutral-300 dark:border-[#2D2D2D] transition duration-300 rounded-full hidden sm:block"></div>
            <div className="size-2 bg-white dark:bg-black border sm:border-2 border-neutral-300 dark:border-[#2D2D2D] transition duration-300 rounded-full hidden sm:block"></div>
          </>
        )}
        <div className="size-2 bg-white dark:bg-black border sm:border-2 border-neutral-300 dark:border-[#2D2D2D] transition duration-300 rounded-full hidden sm:block"></div>
        <div className="size-2 bg-white dark:bg-black border sm:border-2 border-neutral-300 dark:border-[#2D2D2D] transition duration-300 rounded-full"></div>
      </div>
    </header>
  );
}

export function HeaderMenu({
  menu,
  primaryDomainUrl,
  viewport,
  publicStoreDomain,
}: {
  menu: HeaderProps['header']['menu'];
  primaryDomainUrl: HeaderProps['header']['shop']['primaryDomain']['url'];
  viewport: Viewport;
  publicStoreDomain: HeaderProps['publicStoreDomain'];
}) {
  const className = `header-menu-${viewport}`;
  const {close} = useAside();

  return (
    <nav className={className} role="navigation">
      {viewport === 'mobile' && (
        <NavLink
          end
          onClick={close}
          prefetch="intent"
          style={activeLinkStyle}
          to="/"
        >
          Home
        </NavLink>
      )}
      {(menu || FALLBACK_HEADER_MENU).items.map((item) => {
        if (!item.url) return null;

        // if the url is internal, we strip the domain
        const url =
          item.url.includes('myshopify.com') ||
          item.url.includes(publicStoreDomain) ||
          item.url.includes(primaryDomainUrl)
            ? new URL(item.url).pathname
            : item.url;
        return (
          <NavLink
            className="header-menu-item"
            end
            key={item.id}
            onClick={close}
            prefetch="intent"
            style={activeLinkStyle}
            to={url}
          >
            {item.title}
          </NavLink>
        );
      })}
    </nav>
  );
}

function HeaderCtas({
  isLoggedIn,
}: Pick<HeaderProps, 'isLoggedIn'>) {
  return (
    <nav className="header-ctas" role="navigation" aria-label="Header CTAs">
      <HeaderMenuMobileToggle />
      <NavLink prefetch="intent" to="/account" style={activeLinkStyle}>
        <Suspense fallback="Sign in">
          <Await resolve={isLoggedIn} errorElement="Sign in">
            {(isLoggedIn) => (isLoggedIn ? 'Account' : 'Sign in')}
          </Await>
        </Suspense>
      </NavLink>
      <SearchToggle />
    </nav>
  );
}

function HeaderMenuMobileToggle() {
  const {open} = useAside();
  return (
    <button
      type="button"
      className="header-menu-mobile-toggle reset focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] focus-visible:ring-offset-2"
      onClick={() => open('mobile')}
      aria-label="Open menu"
    >
      <h3>☰</h3>
    </button>
  );
}

function SearchToggle() {
  const {open} = useAside();
  return (
    <button className="reset" onClick={() => open('search')}>
      Search
    </button>
  );
}

/**
 * Story 5.10: Cart Icon Button Wrapper
 * Wraps CartIconButton with cart data from useOptimisticCart
 */
function CartIconButtonWrapper() {
  const originalCart = useAsyncValue() as CartApiQueryFragment | null;
  const cart = useOptimisticCart(originalCart);
  return <CartIconButton itemCount={cart?.totalQuantity ?? 0} />;
}

/**
 * Story 5.10: Cart Icon Button
 * Cart icon with badge that opens CartDrawer via Zustand
 */
function CartIconButton({itemCount}: {itemCount: number}) {
  const setCartDrawerOpen = useExplorationStore((state) => state.setCartDrawerOpen);

  const hasItems = itemCount > 0;

  const handleCartClick = () => {
    setCartDrawerOpen(true);
  };

  return (
    <button
      type="button"
      onClick={handleCartClick}
      className={cn(
        'relative',
        'p-2.5', // 10px padding = 44px touch target with 24px icon
        'text-[var(--text-primary)]',
        'hover:text-[var(--accent-primary)]',
        'transition-colors',
        'rounded',
        'focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]',
      )}
      aria-label={
        hasItems
          ? `Shopping cart, ${itemCount} ${itemCount === 1 ? 'item' : 'items'}`
          : 'Shopping cart, empty'
      }
    >
      <ShoppingBag className="h-6 w-6" />

      {/* Badge - only show if has items (AC2, AC3) */}
      {hasItems && (
        <span
          className={cn(
            'absolute -top-1 -right-1',
            'min-w-[20px] h-5 px-1.5',
            'bg-[var(--accent-primary)] text-white',
            'rounded-full',
            'text-xs font-medium',
            'flex items-center justify-center',
          )}
          aria-hidden="true" // Screen reader gets count from button aria-label
        >
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
    </button>
  );
}

const FALLBACK_HEADER_MENU = {
  id: 'gid://shopify/Menu/199655587896',
  items: [
    {
      id: 'gid://shopify/MenuItem/461609500728',
      resourceId: null,
      tags: [],
      title: 'Collections',
      type: 'HTTP',
      url: '/collections',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609533496',
      resourceId: null,
      tags: [],
      title: 'Blog',
      type: 'HTTP',
      url: '/blogs/journal',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609566264',
      resourceId: null,
      tags: [],
      title: 'Policies',
      type: 'HTTP',
      url: '/policies',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609599032',
      resourceId: 'gid://shopify/Page/92591030328',
      tags: [],
      title: 'About',
      type: 'PAGE',
      url: '/about', // Hydrogen route (Story 4.4), not Shopify CMS /pages/about
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/wholesale-portal',
      resourceId: null,
      tags: [],
      title: 'Wholesale',
      type: 'HTTP',
      url: '/wholesale/login',
      items: [],
    },
  ],
};

function activeLinkStyle({
  isActive,
  isPending,
}: {
  isActive: boolean;
  isPending: boolean;
}) {
  return {
    fontWeight: isActive ? 'bold' : undefined,
    color: isPending ? 'var(--text-muted)' : 'var(--text-primary)',
  };
}
