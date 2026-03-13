import {lazy, Suspense, useEffect, useRef, useState} from 'react';
import {Await, NavLink, useAsyncValue} from 'react-router';
import {useOptimisticCart} from '@shopify/hydrogen';
import {ShoppingBag, User} from 'lucide-react';
import {Logo} from '~/components/Logo';
import {useExplorationStore} from '~/stores/exploration';
import {cn} from '~/utils/cn';
import styles from './Header.module.css';
import type gsap from 'gsap';
import type {HeaderQuery, CartApiQueryFragment} from 'storefrontapi.generated';

const LazyHeaderMenu = lazy(() => import('./HeaderMenu'));

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

export function Header({header, isLoggedIn, cart, publicStoreDomain}: HeaderProps) {
  const {shop, menu} = header;

  const {open, toggleMenu} = useMenuToggle();

  // Story 2.5: Scroll-aware header on home page only
  // const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [, setPrefersReducedMotion] = useState(false);

  const buttonRef = useRef<HTMLButtonElement>(null);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (open && !isMenuOpen) {
      setIsMenuOpen(true);
    }
  }, [open, isMenuOpen]);

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
    <header className={styles['navigation-menu']}>
      <>
        {isMenuOpen && (
          <Suspense fallback={null}>
            <LazyHeaderMenu
              menu={menu}
              primaryDomainUrl={header.shop.primaryDomain.url}
              publicStoreDomain={publicStoreDomain}
              onClose={toggleMenu}
              open={open}
            />
          </Suspense>
        )}
      </>

      <div className={styles['navbar']}>
        <NavLink
          prefetch="intent"
          to="/"
          style={activeLinkStyle}
          end
          className={cn(styles['navbar-logo-link'], isMenuOpen && styles['navbar-logo-link-open'])}
        >
          <Logo className={styles['navbar-logo']} />
          <strong className="sr-only">{shop.name}</strong>
        </NavLink>

        <div className={styles['menu-button-wrapper']}>
          <button
            ref={buttonRef}
            onClick={toggleMenu}
            className={styles['menu-button']}
            aria-expanded={open}
            aria-label="Toggle menu"
          >
            <div className={styles['menu-button-line']} />
            <div className={cn(styles['menu-button-line'], styles['menu-button-line-2'])} />
            <span className="sr-only">Menu</span>
          </button>
        </div>

        <div className={styles['menu-cta-buttons-wrapper']}>
          <div className={styles['cta-buttons']}>
            <div className={cn(styles['menu-buttons-wrapper'], styles['menu-button-abs'])}>
              <a href="/locations" className={cn(styles['navbar-button'], 'hidden sm:flex')}>
                Find in stores
              </a>

              <HeaderCtas />

              <Suspense fallback={<CartIconButton itemCount={0} />}>
                <Await resolve={cart}>
                  <CartIconButtonWrapper />
                </Await>
              </Suspense>
            </div>
          </div>

          <button
            onClick={toggleMenu}
            className={cn(styles['menu-button-mobile'], styles['menu-button-abs'])}
            aria-expanded={open}
            aria-label="Toggle menu"
          >
            <div className={cn(styles['menu-button-line'], styles['menu-button-line-mobile'])} />
            <div
              className={cn(
                styles['menu-button-line'],
                styles['menu-button-line-2'],
                styles['menu-button-line-mobile'],
                styles['menu-button-line-2-mobile'],
              )}
            />
          </button>
        </div>
      </div>
    </header>
  );
}

function HeaderCtas() {
  return (
    <nav className="header-ctas flex" role="navigation" aria-label="Header CTAs">
      <NavLink
        prefetch="intent"
        to="/account"
        style={activeLinkStyle}
        className={cn(styles['navbar-button'], styles['navbar-icon-button'], 'flex')}
        aria-label="Account"
      >
        {/* Always render the icon to avoid CLS from Suspense text→icon swap */}
        <User className={styles['navbar-icon-button-icon']} />
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
      <ShoppingBag className={styles['navbar-icon-button-icon']} />

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
