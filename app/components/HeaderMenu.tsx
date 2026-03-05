import {useEffect, useRef, useState} from 'react';
import {NavLink} from 'react-router';
import gsap from 'gsap';
import {SplitText} from 'gsap/SplitText';
import AboutUsImage from '~/assets/images/menu-about-us.webp?responsive';
import ContactImage from '~/assets/images/menu-catalog.png?responsive';
import CatalogImage from '~/assets/images/menu-contact.jpeg?responsive';
import HomeImage from '~/assets/images/menu-home.png?responsive';
import PoliciesImage from '~/assets/images/menu-policies.webp?responsive';
import WholesaleImage from '~/assets/images/menu-wholesale.webp?responsive';
import {Picture} from '~/components/Picture';
import type {HeaderQuery} from 'storefrontapi.generated';

function activeLinkStyle({isActive, isPending}: {isActive: boolean; isPending: boolean}) {
  return {
    fontWeight: isActive ? 'bold' : undefined,
    color: isPending ? 'var(--text-muted)' : 'var(--text-primary)',
  };
}

const FALLBACK_HEADER_MENU = {
  id: 'gid://shopify/Menu/199655587896',
  items: [
    {
      id: 'home',
      resourceId: null,
      tags: [],
      title: 'Home',
      type: 'FRONTPAGE',
      url: '/',
      items: [],
      image: HomeImage,
    },
    {
      id: 'gid://shopify/MenuItem/461609500728',
      resourceId: null,
      tags: [],
      title: 'Shop',
      type: 'PAGE',
      url: '/collections',
      items: [],
      image: CatalogImage,
    },
    {
      id: 'gid://shopify/MenuItem/461609533496',
      resourceId: null,
      tags: [],
      title: 'Stores',
      type: 'PAGE',
      url: '/locations',
      items: [],
      image: PoliciesImage,
    },
    {
      id: 'gid://shopify/MenuItem/wholesale-portal',
      resourceId: null,
      tags: [],
      title: 'Wholesale',
      type: 'PAGE',
      url: '/partners',
      items: [],
      image: WholesaleImage,
    },
    {
      id: 'gid://shopify/MenuItem/461609599032',
      resourceId: 'gid://shopify/Page/92591030328',
      tags: [],
      title: 'About',
      type: 'PAGE',
      url: '/about',
      items: [],
      image: AboutUsImage,
    },
    {
      id: 'gid://shopify/MenuItem/461609566264',
      resourceId: null,
      tags: [],
      title: 'Contact',
      type: 'HTTP',
      url: '/contact',
      items: [],
      image: ContactImage,
    },
  ],
};

type Viewport = 'desktop' | 'mobile';

interface HeaderMenuProps {
  menu: HeaderQuery['menu'];
  primaryDomainUrl: string;
  publicStoreDomain: string;
  onClose: () => void;
  open: boolean;
}

export default function HeaderMenu({menu, primaryDomainUrl, publicStoreDomain, onClose, open}: HeaderMenuProps) {
  const [activeMenu, setActiveMenu] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Create SPLIT TEXT
      const splits = gsap.utils.toArray<HTMLElement>('.menu-item-text').map((el) => {
        return new SplitText(el, {type: 'chars'});
      });

      // Set initial state for all characters
      gsap.set(
        splits.flatMap((s) => s.chars),
        {yPercent: 100},
      );

      // Set initial state for the container itself
      gsap.set(containerRef.current, {yPercent: -100});

      tlRef.current = gsap.timeline({paused: true});

      // Animate the container first
      tlRef.current.to(
        containerRef.current,
        {
          yPercent: 0,
          duration: 0.8,
          ease: 'power3.out',
        },
        0,
      );

      splits.forEach((split, index) => {
        tlRef.current!.to(
          split.chars,
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.02,
            ease: 'power3.out',
          },
          0.5 + index * 0.1, // Added more delay here to wait for slide down
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (tlRef.current) {
      if (open) {
        tlRef.current.play();
      } else {
        tlRef.current.reverse();
      }
    }
  }, [open]);

  return (
    <div ref={containerRef} className="fixed inset-0 w-full h-dvh bg-secondary z-200">
      <div className="flex items-center h-full">
        <div className="flex flex-col justify-center items-center w-full lg:w-1/2 h-full">
          <nav className="flex flex-col items-center" role="navigation">
            {/* {(menu || FALLBACK_HEADER_MENU).items.map((item, index) => { */}
            {FALLBACK_HEADER_MENU.items.map((item, index) => {
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
                  onClick={onClose}
                  prefetch="intent"
                  onMouseEnter={() => setActiveMenu(index)}
                  style={activeLinkStyle}
                  to={url}
                >
                  <span className="text-[12.5vw] md:text-[9vh] leading-[105%] size-auto block overflow-hidden">
                    <span className="menu-item-text inline-block">{item.title}</span>
                  </span>
                </NavLink>
              );
            })}
          </nav>

          <ul className="mt-5 flex items-center gap-4">
            <li className="font-paragraph text-black text-center mx-[1vw] md:mx-[3vw]">
              <a
                href="https://www.youtube.com"
                target="_blank"
                rel="noreferrer"
                className="text-[5vw] md:text-[3vw] lg:text-[1vw] leading-[115%] decoration-none hover:decoration-none static"
              >
                YouTube
              </a>
            </li>

            <li className="font-paragraph text-black text-center mx-[1vw] md:mx-[3vw]">
              <a
                href="https://www.instagram.com/islasuds/"
                target="_blank"
                rel="noreferrer"
                className="text-[5vw] md:text-[3vw] lg:text-[1vw] leading-[115%] decoration-none hover:decoration-none static"
              >
                Instagram
              </a>
            </li>

            <li className="font-paragraph text-black text-center mx-[1vw] md:mx-[3vw]">
              <a
                href="https://www.tiktok.com"
                target="_blank"
                rel="noreferrer"
                className="text-[5vw] md:text-[3vw] lg:text-[1vw] leading-[115%] decoration-none hover:decoration-none static"
              >
                TikTok
              </a>
            </li>
          </ul>
        </div>

        <div className="hidden lg:flex w-[57%] lg:w-1/2 h-full pointer-events-none">
          <Picture
            loading="lazy"
            src={FALLBACK_HEADER_MENU.items[activeMenu].image}
            alt={FALLBACK_HEADER_MENU.items[activeMenu].title}
            className="w-full h-screen! object-cover transition-opacity duration-500"
          />
        </div>
      </div>
    </div>
  );
}
