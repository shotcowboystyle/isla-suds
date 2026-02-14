import {useState} from 'react';
import {NavLink} from 'react-router';
import {useAside} from '~/components/Aside';
import {Picture} from '~/components/Picture';
import AboutUsImage from '../assets/images/menu-about-us.png?responsive';
import CatalogImage from '../assets/images/menu-catalog.png?responsive';
import ContactImage from '../assets/images/menu-contact.jpeg?responsive';
import HomeImage from '../assets/images/menu-home.png?responsive';
import TastyTalksImage from '../assets/images/menu-tasty-talks.png?responsive';
import type {HeaderQuery} from 'storefrontapi.generated';

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
      url: '/about',
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

type Viewport = 'desktop' | 'mobile';

interface HeaderMenuProps {
  menu: HeaderQuery['menu'];
  primaryDomainUrl: string;
  viewport: Viewport;
  publicStoreDomain: string;
}

export default function HeaderMenu({menu, primaryDomainUrl, viewport, publicStoreDomain}: HeaderMenuProps) {
  const {close} = useAside();
  const {open, toggleMenu} = useMenuToggle();

  const [activeMenu, setActiveMenu] = useState<number>(0);

  return (
    <div className="fixed top-0 left-0 w-full h-dvh bg-secondary z-1">
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
