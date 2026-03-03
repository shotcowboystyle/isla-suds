import {lazy, Suspense, useEffect, useRef, useState} from 'react';
import {Await, NavLink, useAsyncValue, useLocation, useNavigate, useRouteLoaderData} from 'react-router';
import {useOptimisticCart} from '@shopify/hydrogen';
import {ShoppingBag, User} from 'lucide-react';
// import {useAside} from '~/components/Aside';
import {Logo} from '~/components/Logo';
import {useHomeScroll} from '~/contexts/home-scroll-context';
import {useIsMobile} from '~/hooks/use-is-mobile';
import {useExplorationStore} from '~/stores/exploration';
import {cn} from '~/utils/cn';
import styles from './Header.module.css';
import type gsap from 'gsap';
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
  const tlButton = useRef<gsap.core.Timeline | null>(null);

  const [hasOpened, setHasOpened] = useState(false);
  useEffect(() => {
    if (open && !hasOpened) {
      setHasOpened(true);
    }
  }, [open, hasOpened]);

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

    void import('gsap').then(({default: gsap}) => {
      if (cancelled) return;

      gsap.set(line1, {y: -4, rotate: 0});
      gsap.set(line2, {y: 4, rotate: 0});
      gsap.set(btn, {
        cursor: 'pointer',
        borderRadius: '9999px',
      });

      tlButton.current = gsap.timeline({paused: true});

      tlButton.current
        .to(btn, {
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
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape' && open) {
        toggleMenu();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, toggleMenu]);

  useEffect(() => {
    if (!tlButton.current) {
      return;
    }

    if (open) {
      tlButton.current.play();
    } else {
      tlButton.current.reverse();
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
        void import('gsap').then(({default: gsap}) => {
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
      // style={
      //   isHomePage && !shouldShowHeader && !prefersReducedMotion
      //     ? {
      //         transform: 'translateY(-100%)',
      //       }
      //     : undefined
      // }
    >
      <>
        {hasOpened && (
          <Suspense fallback={null}>
            <LazyHeaderMenu
              menu={menu}
              viewport="desktop"
              primaryDomainUrl={header.shop.primaryDomain.url}
              publicStoreDomain={publicStoreDomain}
              onClose={toggleMenu}
              open={open}
            />
          </Suspense>
        )}
      </>

      <div className={styles['navbar']}>
        <NavLink prefetch="intent" to="/" style={activeLinkStyle} end className={styles['navbar-logo-link']}>
          <Logo className={styles['navbar-logo']} />
          <strong className="sr-only">{shop.name}</strong>
        </NavLink>

        {!isMobile && (
          <div className={styles['menu-button-wrapper']}>
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
          </div>
        )}

        <div className={styles['menu-cta-buttons-wrapper']}>
          <div className={styles['cta-buttons']}>
            <div className={cn(styles['menu-buttons-wrapper'], styles['menu-button-abs'])}>
              <a href="/locations" className={cn(styles['navbar-button'], 'hidden sm:flex')}>
                Find in stores
              </a>

              <HeaderCtas isLoggedIn={isLoggedIn} />

              <Suspense fallback={<CartIconButton itemCount={0} />}>
                <Await resolve={cart}>
                  <CartIconButtonWrapper />
                </Await>
              </Suspense>
            </div>
          </div>

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
        </div>
      </div>
    </header>
  );
}

function HeaderCtas({isLoggedIn}: Pick<HeaderProps, 'isLoggedIn'>) {
  return (
    <nav className="header-ctas flex" role="navigation" aria-label="Header CTAs">
      {/* <HeaderMenuMobileToggle /> */}
      <NavLink
        prefetch="intent"
        to="/account"
        style={activeLinkStyle}
        className={cn(styles['navbar-button'], styles['navbar-icon-button'], 'flex')}
        aria-label="Account"
      >
        <Suspense fallback="Sign in">
          <Await resolve={isLoggedIn} errorElement="Sign in">
            <User className="size-6" />
            {/* <span className="sr-only">{(isLoggedIn) => (isLoggedIn ? 'Account' : 'Sign in')}</span> */}
          </Await>
        </Suspense>
      </NavLink>
    </nav>
  );
}

function CartIconButtonWrapper() {
  const originalCart = useAsyncValue() as CartApiQueryFragment | null;
  const cart = useOptimisticCart(originalCart);
  return <CartIconButton itemCount={cart?.totalQuantity ?? 0} />;
}

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
      className={cn(styles['navbar-button'], styles['navbar-icon-button'], 'flex')}
      aria-label={
        hasItems ? `Shopping cart, ${itemCount} ${itemCount === 1 ? 'item' : 'items'}` : 'Shopping cart, empty'
      }
    >
      <ShoppingBag className="size-6" />

      {hasItems && (
        <span
          className={cn(
            'absolute -top-2 -right-2',
            'flex content-center items-center justify-center size-7 pb-1',
            'bg-red-700 text-secondary',
            'rounded-full',
            'text-sm font-medium leading-none',
          )}
          aria-hidden="true"
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
