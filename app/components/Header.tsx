import {lazy, Suspense, useEffect, useRef, useState} from 'react';
import {Await, NavLink, useAsyncValue, useLocation, useNavigate, useRouteLoaderData} from 'react-router';
import {useOptimisticCart} from '@shopify/hydrogen';
import type gsap from 'gsap';
import {ShoppingBag, User} from 'lucide-react';
// import {useAside} from '~/components/Aside';
import {Logo} from '~/components/Logo';
import {useHomeScroll} from '~/contexts/home-scroll-context';
import {useIsMobile} from '~/hooks/use-is-mobile';
import {useExplorationStore} from '~/stores/exploration';
import {cn} from '~/utils/cn';
import styles from './Header.module.css';
import type {HeaderQuery, CartApiQueryFragment} from 'storefrontapi.generated';

const LazyHeaderMenu = lazy(() => import('./HeaderMenu'));
// import type {RootLoader} from '~/root';

function useMenuToggle() {
  const [open, setOpen] = useState(false);

  const toggleMenu = () => {
    setOpen((prev) => !prev);
  };

  return {
    open,
    toggleMenu,
  };
}

interface HeaderProps {
  header: HeaderQuery;
  cart: Promise<CartApiQueryFragment | null>;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
}

type Viewport = 'desktop' | 'mobile';

export function Header({header, isLoggedIn, cart, publicStoreDomain}: HeaderProps) {
  const location = useLocation();
  const {shop, menu} = header;
  const isPathNotShowCloseButton = ['/'].includes(location.pathname) || location.pathname.startsWith('/products');
  const navigate = useNavigate();

  const {open, toggleMenu} = useMenuToggle();
  const {isMobile, isLoading} = useIsMobile();

  // Story 2.5: Scroll-aware header on home page only
  const isHomePage = location.pathname === '/';
  const homeScroll = useHomeScroll();
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const buttonRef = useRef<HTMLButtonElement>(null);
  const line1Ref = useRef<HTMLDivElement>(null);
  const line2Ref = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const tlButton = useRef<gsap.core.Timeline | null>(null);
  const tlMenu = useRef<gsap.core.Timeline | null>(null);

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

  useEffect(() => {
    if (!buttonRef.current || !line1Ref.current || !line2Ref.current) {
      return;
    }

    let cancelled = false;
    const btn = buttonRef.current;
    const line1 = line1Ref.current;
    const line2 = line2Ref.current;

    import('gsap').then(({default: gsap}) => {
      if (cancelled) return;

      gsap.set(line1, {y: -4, rotate: 0});
      gsap.set(line2, {y: 4, rotate: 0});
      gsap.set(btn, {
        backgroundColor: '#fef3f0',
        cursor: 'pointer',
        borderRadius: '9999px',
      });

      tlButton.current = gsap.timeline({paused: true});

      tlButton.current
        .to(btn, {
          backgroundColor: '#ede7e6',
          borderRadius: '9999px',
          duration: 0.35,
          ease: 'power3.out',
        })
        .to(line1, {y: 0, rotate: 45, duration: 0.35, ease: 'power3.out'}, 0)
        .to(line2, {y: 0, rotate: -45, duration: 0.35, ease: 'power3.out'}, 0);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!menuRef.current) {
      return;
    }

    let cancelled = false;
    const menu = menuRef.current;

    import('gsap').then(({default: gsap}) => {
      if (cancelled) return;

      gsap.set(menu, {yPercent: -100, autoAlpha: 0});

      tlMenu.current = gsap.timeline({paused: true});
      tlMenu.current.to(menu, {
        yPercent: 0,
        autoAlpha: 1,
        duration: 0.8,
        ease: 'power3.out',
      });

      if (open) {
        tlMenu.current.play();
      }
    });

    return () => {
      cancelled = true;
    };
  }, [open]);

  useEffect(() => {
    if (!tlButton.current || !tlMenu.current) {
      return;
    }

    if (open) {
      tlButton.current.play();
      tlMenu.current.play();
    } else {
      tlButton.current.reverse();
      tlMenu.current.reverse();
    }
  }, [open]);

  useEffect(() => {
    if (!buttonRef.current) {
      return;
    }

    const button = buttonRef.current;
    let gsapModule: typeof gsap | null = null;

    // Pre-load gsap on first interaction
    const loadGsap = () => {
      if (!gsapModule) {
        import('gsap').then(({default: gsap}) => {
          gsapModule = gsap;
        });
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!gsapModule) {
        loadGsap();
        return;
      }

      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const strength = 0.5;
      const rotateStrength = 10;

      gsapModule.to(button, {
        x: x * strength,
        y: y * strength,
        rotationX: (-y / rect.height) * rotateStrength,
        rotationY: (x / rect.width) * rotateStrength,
        duration: 0.3,
        ease: 'power3.out',
        transformPerspective: 500,
      });
    };

    const handleMouseLeave = () => {
      if (!gsapModule) return;

      gsapModule.to(button, {
        x: 0,
        y: 0,
        rotationX: 0,
        rotationY: 0,
        duration: 0.5,
        ease: 'power3.out',
        transformPerspective: 500,
      });
    };

    // Start loading gsap eagerly on mouseenter
    button.addEventListener('mouseenter', loadGsap, {once: true});
    button.addEventListener('mousemove', handleMouseMove);
    button.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      button.removeEventListener('mouseenter', loadGsap);
      button.removeEventListener('mousemove', handleMouseMove);
      button.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <header
      className={styles['navigation-menu']}
      // className={cn(
      //   'fixed top-0 left-0 w-full py-4 px-5 md:px-10 z-100',
      //   // 'sticky top-0 w-full z-20 bg-(--canvas-base)/95 dark:bg-(--canvas-elevated)/95 border-b sm:border-b-2 border-neutral-300 dark:border-[#2D2D2D] -mb-[2px]',
      //   // Story 2.5: GPU-composited fade for scroll-triggered visibility
      //   // Only apply transitions if NOT prefers-reduced-motion
      //   // !prefersReducedMotion && 'transition-all duration-300',
      //   // When on home and not past hero, use GPU-composited properties to hide
      //   // isHomePage && !shouldShowHeader && 'opacity-0 pointer-events-none',
      // )}
      // style={
      //   isHomePage && !shouldShowHeader && !prefersReducedMotion
      //     ? {
      //         // GPU-composited transform for smooth fade
      //         transform: 'translateY(-100%)',
      //       }
      //     : undefined
      // }
    >
      {open && (
        <div ref={menuRef} className={styles['navigation-menu']}>
          <Suspense fallback={null}>
            <LazyHeaderMenu
              menu={menu}
              viewport="desktop"
              primaryDomainUrl={header.shop.primaryDomain.url}
              publicStoreDomain={publicStoreDomain}
            />
          </Suspense>
        </div>
      )}

      <div className={styles['navbar']}>
        <NavLink prefetch="intent" to="/" style={activeLinkStyle} end className={styles['navbar-logo-link']}>
          <Logo className={styles['navbar-logo']} />
          <strong className="sr-only">{shop.name}</strong>
        </NavLink>

        <div className={styles['menu-button-wrapper']}>
          {!isMobile && (
            <button
              ref={buttonRef}
              onClick={toggleMenu}
              className={styles['menu-button']}
              aria-expanded={open}
              aria-label="Toggle menu"
            >
              <div ref={line1Ref} className={styles['menu-button-line']} />
              <div ref={line2Ref} className={cn(styles['menu-button-line'], styles['menu-button-line-2'])} />
              <span className="sr-only">Menu</span>
            </button>
          )}
        </div>

        {/* <div className="h-18 sm:h-24 px-[1.05rem] sm:px-6 flex items-center justify-end sm:justify-between relative gap-3"> */}
        <div className={styles['menu-cta-buttons-wrapper']}>
          <Logo className={cn(styles['navbar-logo'], styles['navbar-logo-transparency-off'])} />

          <div className={styles['cta-buttons']}>
            {isMobile && (
              <button
                ref={buttonRef}
                onClick={toggleMenu}
                className={cn(styles['menu-button-mobile'], styles['menu-button-abs'])}
                aria-expanded={open}
                aria-label="Toggle menu"
              >
                <div ref={line1Ref} className={cn(styles['menu-button-line'], styles['menu-button-line-mobile'])} />
                <div
                  ref={line2Ref}
                  className={cn(
                    styles['menu-button-line'],
                    styles['menu-button-line-2'],
                    styles['menu-button-line-mobile'],
                    styles['menu-button-line-2-mobile'],
                  )}
                />
              </button>
            )}

            <div className={cn(styles['menu-buttons-wrapper'], styles['menu-button-abs'])}>
              <button className={styles['navbar-button']}>Find in stores</button>

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
                    if (location.pathname.startsWith('/order-success')) {
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
                    <div className="size-3 scale-110 leading-none absolute top-1/2 left-1/2 -translate-x-[30%] -translate-y-[55%] rotate-45 text-black dark:text-secondary group-hover:text-secondary dark:group-hover:text-black transition duration-300 flex">
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
                  <div className="sm:hidden h-px sm:h-[2px] bg-neutral-300 w-3 absolute top-1/2 -translate-y-1/2 -left-3"></div>
                  <div className="absolute z-10 size-2 top-1/2 right-0 transform translate-x-2/5 -translate-y-1/2 bg-white dark:bg-black group-hover:bg-black dark:group-hover:bg-white transition duration-300 border sm:border-2 border-neutral-300 rounded-full"></div>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function HeaderCtas({isLoggedIn}: Pick<HeaderProps, 'isLoggedIn'>) {
  return (
    <nav className="header-ctas" role="navigation" aria-label="Header CTAs">
      {/* <HeaderMenuMobileToggle /> */}
      <NavLink
        prefetch="intent"
        to="/account"
        style={activeLinkStyle}
        className={cn(styles['navbar-button'], styles['navbar-icon-button'])}
        aria-label="Account"
      >
        <Suspense fallback="Sign in">
          <Await resolve={isLoggedIn} errorElement="Sign in">
            <User className="size-6" />
            {/* {(isLoggedIn) => (isLoggedIn ? 'Account' : 'Sign in')} */}
          </Await>
        </Suspense>
      </NavLink>
      {/* <SearchToggle /> */}
    </nav>
  );
}

// function HeaderMenuMobileToggle() {
//   const {open} = useAside();
//   return (
//     <button
//       type="button"
//       className="header-menu-mobile-toggle reset focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--accent-primary) focus-visible:ring-offset-2"
//       onClick={() => open('mobile')}
//       aria-label="Open menu"
//     >
//       <h3>☰</h3>
//     </button>
//   );
// }

// function SearchToggle() {
//   const {open} = useAside();
//   return (
//     <button className="reset" onClick={() => open('search')}>
//       Search
//     </button>
//   );
// }

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
      className={cn(styles['navbar-button'], styles['navbar-icon-button'])}
      // className={cn(
      //   'relative',
      //   'p-2.5', // 10px padding = 44px touch target with 24px icon
      //   'text-(--text-primary)',
      //   'hover:text-(--accent-primary)',
      //   'transition-colors',
      //   'rounded',
      //   'focus:outline-none focus:ring-2 focus:ring-(--accent-primary)',
      // )}
      aria-label={
        hasItems ? `Shopping cart, ${itemCount} ${itemCount === 1 ? 'item' : 'items'}` : 'Shopping cart, empty'
      }
    >
      <ShoppingBag className="size-6" />

      {/* Badge - only show if has items (AC2, AC3) */}
      {hasItems && (
        <span
          className={cn(
            'absolute -top-1 -right-1',
            'min-w-[20px] h-5 px-1.5',
            'bg-(--accent-primary) text-secondary',
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

function activeLinkStyle({isActive, isPending}: {isActive: boolean; isPending: boolean}) {
  return {
    fontWeight: isActive ? 'bold' : undefined,
    color: isPending ? 'var(--text-muted)' : 'var(--text-primary)',
  };
}
