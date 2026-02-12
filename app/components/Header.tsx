import {Suspense, useEffect, useRef, useState} from 'react';
import {Await, NavLink, useAsyncValue, useLocation, useNavigate, useRouteLoaderData} from 'react-router';
import {useOptimisticCart} from '@shopify/hydrogen';
import gsap from 'gsap';
import {ShoppingBag} from 'lucide-react';
import {useAside} from '~/components/Aside';
import {Logo} from '~/components/Logo';
import {Picture} from '~/components/Picture';
import {useHomeScroll} from '~/contexts/home-scroll-context';
import {useExplorationStore} from '~/stores/exploration';
import {cn} from '~/utils/cn';
import styles from './Header.module.css';
import AboutUsImage from '../assets/images/menu-about-us.png?responsive';
import CatalogImage from '../assets/images/menu-catalog.png?responsive';
import ContactImage from '../assets/images/menu-contact.jpeg?responsive';
import HomeImage from '../assets/images/menu-home.png?responsive';
import TastyTalksImage from '../assets/images/menu-tasty-talks.png?responsive';
import type {HeaderQuery, CartApiQueryFragment} from 'storefrontapi.generated';
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

    gsap.set(line1Ref.current, {
      y: -4,
      rotate: 0,
    });

    gsap.set(line2Ref.current, {
      y: 4,
      rotate: 0,
    });

    gsap.set(buttonRef.current, {
      backgroundColor: 'hsl(180 50% 25%)',
      borderRadius: '9999px',
    });

    tlButton.current = gsap.timeline({paused: true});

    tlButton.current
      .to(buttonRef.current, {
        backgroundColor: 'hsl(180 50% 40%)',
        borderRadius: '9999px',
        duration: 0.35,
        ease: 'power3.out',
      })
      .to(
        line1Ref.current,
        {
          y: 0,
          rotate: 45,
          duration: 0.35,
          ease: 'power3.out',
        },
        0,
      )
      .to(
        line2Ref.current,
        {
          y: 0,
          rotate: -45,
          duration: 0.35,
          ease: 'power3.out',
        },
        0,
      );
  }, []);

  useEffect(() => {
    if (!menuRef.current) {
      return;
    }

    gsap.set(menuRef.current, {
      yPercent: -100,
      autoAlpha: 0,
    });

    tlMenu.current = gsap.timeline({paused: true});
    tlMenu.current.to(menuRef.current, {
      yPercent: 0,
      autoAlpha: 1,
      duration: 0.8,
      ease: 'power3.out',
    });

    if (open) {
      tlMenu.current.play();
    }
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

    const handleMouseMove = (e: MouseEvent) => {
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const strength = 0.5;
      const rotateStrength = 10;

      gsap.to(button, {
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
      gsap.to(button, {
        x: 0,
        y: 0,
        rotationX: 0,
        rotationY: 0,
        duration: 0.5,
        ease: 'power3.out',
        transformPerspective: 500,
      });
    };

    button.addEventListener('mousemove', handleMouseMove);
    button.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      button.removeEventListener('mousemove', handleMouseMove);
      button.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 w-full py-4 px-5 md:px-10 z-100',
        // 'sticky top-0 w-full z-20 bg-(--canvas-base)/95 dark:bg-(--canvas-elevated)/95 border-b sm:border-b-2 border-neutral-300 dark:border-[#2D2D2D] -mb-[2px]',
        // Story 2.5: GPU-composited fade for scroll-triggered visibility
        // Only apply transitions if NOT prefers-reduced-motion
        // !prefersReducedMotion && 'transition-all duration-300',
        // When on home and not past hero, use GPU-composited properties to hide
        // isHomePage && !shouldShowHeader && 'opacity-0 pointer-events-none',
      )}
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
        <div ref={menuRef} className="fixed top-0 left-0 w-full h-dvh bg-secondary z-50">
          <HeaderMenu
            menu={menu}
            viewport="desktop"
            primaryDomainUrl={header.shop.primaryDomain.url}
            publicStoreDomain={publicStoreDomain}
          />
        </div>
      )}

      {/* <div className="h-18 sm:h-24 px-[1.05rem] sm:px-6 flex items-center justify-end sm:justify-between relative gap-3"> */}
      <div className="flex justify-between items-center relative z-100">
        <NavLink
          prefetch="intent"
          to="/"
          style={activeLinkStyle}
          end
          // className="absolute top-1/2 left-5 sm:left-1/2 transform sm:-translate-x-1/2 -translate-y-1/2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--accent-primary) focus-visible:ring-offset-2"
        >
          {/* <div className="w-[8.13rem] sm:w-[16.06rem] aspect-[1/0.21] h-[2.19rem] sm:h-[3.44rem] dark:invert transition duration-300"> */}
          <div className={styles['navbar_logo_link']}>
            <Logo className="w-60" />
          </div>
          <strong className="sr-only">{shop.name}</strong>
        </NavLink>

        <button
          ref={buttonRef}
          onClick={toggleMenu}
          className="relative flex items-center justify-center w-12 h-12 rounded-full cursor-pointer"
          aria-expanded={open}
          aria-label="Toggle menu"
        >
          <div ref={line1Ref} className="absolute w-6 h-0.5 bg-secondary" />
          <div ref={line2Ref} className="absolute w-6 h-0.5 bg-secondary" />
        </button>

        <div className="hidden md:block">
          <button className="py-3 px-7 bg-accent-secondary rounded-full text-xl uppercase">Find stores</button>

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
  const {open, toggleMenu} = useMenuToggle();

  const [activeMenu, setActiveMenu] = useState<number>(0);

  return (
    <div className="fixed top-0 left-0 w-full h-dvh bg-secondary">
      <div className="flex items-center h-full">
        <div className="flex flex-col justify-center items-center w-[43%] md:w-1/2 h-full">
          <nav className="flex flex-col items-center" role="navigation">
            {(menu || FALLBACK_HEADER_MENU).items.map((item, index) => {
              if (!item.url) {
                return null;
              }

              // if the url is internal, we strip the domain
              const url =
                item.url.includes('myshopify.com') ||
                item.url.includes(publicStoreDomain) ||
                item.url.includes(primaryDomainUrl)
                  ? new URL(item.url).pathname
                  : item.url;

              return (
                <NavLink
                  className={`py-2 lg:py-0 px-4 text-2xl md:text-5xl lg:text-7xl uppercase font-extrabold tracking-tighter leading-none cursor-pointer transition-opacity duration-300 ${activeMenu === index ? 'opacity-100' : 'opacity-30'}`}
                  end
                  key={item.id}
                  onClick={toggleMenu}
                  prefetch="intent"
                  onMouseEnter={() => setActiveMenu(index)}
                  style={activeLinkStyle}
                  to={url}
                >
                  {item.title}
                </NavLink>
              );
            })}
          </nav>

          <ul className="mt-5 hidden md:flex items-center gap-4">
            <li className="font-paragraph">
              <a href="https://www.youtube.com/@spyltmilk" target="_blank" rel="noreferrer">
                YouTube
              </a>
            </li>

            <li className="font-paragraph">
              <a href="https://www.instagram.com/spyltmilk/" target="_blank" rel="noreferrer">
                Instagram
              </a>
            </li>

            <li className="font-paragraph">
              <a href="https://www.tiktok.com/@spylt" target="_blank" rel="noreferrer">
                TikTok
              </a>
            </li>
          </ul>
        </div>

        <div className="flex w-[57%] md:w-1/2 h-full pointer-events-none">
          <Picture
            loading="lazy"
            src={FALLBACK_HEADER_MENU.items[activeMenu].image}
            alt={FALLBACK_HEADER_MENU.items[activeMenu].title}
            className="w-full h-full object-cover transition-opacity duration-500"
          />
        </div>
      </div>
    </div>
  );
}

function HeaderCtas({isLoggedIn}: Pick<HeaderProps, 'isLoggedIn'>) {
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
      className="header-menu-mobile-toggle reset focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--accent-primary) focus-visible:ring-offset-2"
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
        'text-(--text-primary)',
        'hover:text-(--accent-primary)',
        'transition-colors',
        'rounded',
        'focus:outline-none focus:ring-2 focus:ring-(--accent-primary)',
      )}
      aria-label={
        hasItems ? `Shopping cart, ${itemCount} ${itemCount === 1 ? 'item' : 'items'}` : 'Shopping cart, empty'
      }
    >
      <ShoppingBag className="h-6 w-6" />

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

const FALLBACK_HEADER_MENU = {
  id: 'gid://shopify/Menu/199655587896',
  items: [
    {
      id: 'home',
      resourceId: null,
      tags: [],
      title: 'Home',
      type: 'HTTP',
      url: '/',
      items: [],
      image: HomeImage,
    },
    {
      id: 'gid://shopify/MenuItem/461609500728',
      resourceId: null,
      tags: [],
      title: 'Collections',
      type: 'HTTP',
      url: '/collections',
      items: [],
      image: CatalogImage,
    },
    {
      id: 'gid://shopify/MenuItem/461609533496',
      resourceId: null,
      tags: [],
      title: 'Blog',
      type: 'HTTP',
      url: '/blogs/journal',
      items: [],
      image: ContactImage,
    },
    {
      id: 'gid://shopify/MenuItem/461609566264',
      resourceId: null,
      tags: [],
      title: 'Policies',
      type: 'HTTP',
      url: '/policies',
      items: [],
      image: AboutUsImage,
    },
    {
      id: 'gid://shopify/MenuItem/461609599032',
      resourceId: 'gid://shopify/Page/92591030328',
      tags: [],
      title: 'About',
      type: 'PAGE',
      url: '/about', // Hydrogen route (Story 4.4), not Shopify CMS /pages/about
      items: [],
      image: TastyTalksImage,
    },
    {
      id: 'gid://shopify/MenuItem/wholesale-portal',
      resourceId: null,
      tags: [],
      title: 'Wholesale',
      type: 'HTTP',
      url: '/wholesale/login',
      items: [],
      image: ContactImage,
    },
  ],
};

function activeLinkStyle({isActive, isPending}: {isActive: boolean; isPending: boolean}) {
  return {
    fontWeight: isActive ? 'bold' : undefined,
    color: isPending ? 'var(--text-muted)' : 'var(--text-primary)',
  };
}
