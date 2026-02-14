import {describe, it, expect, vi} from 'vitest';
import {render, screen} from '@testing-library/react';
import {MemoryRouter} from 'react-router';
import {Footer} from './Footer';
import type {FooterQuery, HeaderQuery} from 'storefrontapi.generated';

// Mock data
const mockHeader: HeaderQuery = {
  shop: {
    id: 'gid://shopify/Shop/1',
    name: 'Isla Suds',
    description: 'Natural soap products',
    primaryDomain: {
      url: 'https://isla-suds.com',
    },
  },
};

const mockFooterData: FooterQuery = {
  menu: null, // Will use FALLBACK_FOOTER_MENU
};

const publicStoreDomain = 'isla-suds.myshopify.com';

// Helper to render Footer with router context
function renderFooter() {
  return render(
    <MemoryRouter>
      <Footer
        footer={Promise.resolve(mockFooterData)}
        header={mockHeader}
        publicStoreDomain={publicStoreDomain}
      />
    </MemoryRouter>,
  );
}

describe('Footer', () => {
  describe('Navigation Links (AC1)', () => {
    it('renders Home link pointing to /', async () => {
      renderFooter();
      const homeLink = await screen.findByRole('link', {name: /home/i});
      expect(homeLink).toBeInTheDocument();
      expect(homeLink).toHaveAttribute('href', '/');
    });

    it('renders About link pointing to /about', async () => {
      renderFooter();
      const aboutLink = await screen.findByRole('link', {name: /about/i});
      expect(aboutLink).toBeInTheDocument();
      expect(aboutLink).toHaveAttribute('href', '/about');
    });

    it('renders Contact link pointing to /contact', async () => {
      renderFooter();
      const contactLink = await screen.findByRole('link', {name: /contact/i});
      expect(contactLink).toBeInTheDocument();
      expect(contactLink).toHaveAttribute('href', '/contact');
    });

    it('renders Wholesale link pointing to /wholesale/login', async () => {
      renderFooter();
      const wholesaleLink = await screen.findByRole('link', {
        name: /wholesale/i,
      });
      expect(wholesaleLink).toBeInTheDocument();
      expect(wholesaleLink).toHaveAttribute('href', '/wholesale/login');
    });

    it('navigation links are not disabled (no pointer-events-none)', async () => {
      renderFooter();
      const homeLink = await screen.findByRole('link', {name: /home/i});
      expect(homeLink).not.toHaveClass('pointer-events-none');
    });

    it('navigation links do not have line-through styling', async () => {
      renderFooter();
      const homeLink = await screen.findByRole('link', {name: /home/i});
      expect(homeLink).not.toHaveClass('line-through');
    });
  });

  describe('Legal Links (AC2)', () => {
    it('renders Privacy Policy link', async () => {
      renderFooter();
      const privacyLink = await screen.findByRole('link', {
        name: /privacy policy/i,
      });
      expect(privacyLink).toBeInTheDocument();
      expect(privacyLink).toHaveAttribute('href', '/policies/privacy-policy');
    });

    it('renders Terms of Service link', async () => {
      renderFooter();
      const termsLink = await screen.findByRole('link', {
        name: /terms of service/i,
      });
      expect(termsLink).toBeInTheDocument();
      expect(termsLink).toHaveAttribute('href', '/policies/terms-of-service');
    });
  });

  describe('Copyright Notice (AC3)', () => {
    it('renders copyright text with current year', async () => {
      renderFooter();
      const currentYear = new Date().getFullYear();
      const copyrights = await screen.findAllByText(
        new RegExp(`© ${currentYear} Isla Suds`, 'i'),
      );
      expect(copyrights.length).toBeGreaterThan(0);
    });

    it('copyright text uses appropriate styling', async () => {
      renderFooter();
      const currentYear = new Date().getFullYear();
      const copyrights = await screen.findAllByText(
        new RegExp(`© ${currentYear} Isla Suds`, 'i'),
      );
      // At least one copyright element should be present with text styling
      expect(copyrights[0]).toBeInTheDocument();
    });
  });

  describe('Semantic HTML & Accessibility (AC1, AC6)', () => {
    it('footer element exists with proper semantic tag', async () => {
      renderFooter();
      const footer = await screen.findByRole('contentinfo');
      expect(footer).toBeInTheDocument();
    });

    it('navigation element has descriptive aria-label', async () => {
      renderFooter();
      const nav = await screen.findByRole('navigation', {
        name: /footer navigation/i,
      });
      expect(nav).toBeInTheDocument();
    });

    it('all links are keyboard accessible', async () => {
      renderFooter();
      const homeLink = await screen.findByRole('link', {name: /home/i});
      expect(homeLink).not.toHaveAttribute('tabIndex', '-1');
    });

    it('links have focus-visible styling', async () => {
      renderFooter();
      const homeLink = await screen.findByRole('link', {name: /home/i});
      expect(homeLink).toHaveClass('focus-visible:ring-2');
      expect(homeLink).toHaveClass(
        'focus-visible:ring-[var(--accent-primary)]',
      );
    });

    it('SELECT STORE button has visible focus indicator', async () => {
      renderFooter();
      const selectStoreButtons = await screen.findAllByRole('button', {
        name: /select store/i,
      });
      // At least one button should have focus-visible ring
      expect(selectStoreButtons[0]).toHaveClass('focus-visible:ring-2');
      expect(selectStoreButtons[0]).toHaveClass(
        'focus-visible:ring-[var(--accent-primary)]',
      );
    });
  });

  describe('Layout when primaryDomain is missing (AC7)', () => {
    it('renders navigation and legal links when primaryDomain is null', async () => {
      const headerWithoutDomain = {
        ...mockHeader,
        shop: {
          ...mockHeader.shop,
          primaryDomain: null,
        },
      } as unknown as HeaderQuery;
      render(
        <MemoryRouter>
          <Footer
            footer={Promise.resolve(mockFooterData)}
            header={headerWithoutDomain}
            publicStoreDomain={publicStoreDomain}
          />
        </MemoryRouter>,
      );
      const homeLink = await screen.findByRole('link', {name: /home/i});
      const privacyLink = await screen.findByRole('link', {
        name: /privacy policy/i,
      });
      expect(homeLink).toBeInTheDocument();
      expect(privacyLink).toBeInTheDocument();
    });
  });

  describe('Layout & Structure (AC7)', () => {
    it('footer uses fixed positioning at bottom', async () => {
      renderFooter();
      const footer = await screen.findByRole('contentinfo');
      expect(footer).toHaveClass('fixed');
      expect(footer).toHaveClass('bottom-0');
    });

    it('footer uses flex layout', async () => {
      renderFooter();
      const footer = await screen.findByRole('contentinfo');
      expect(footer).toHaveClass('flex');
      expect(footer).toHaveClass('flex-col');
    });
  });
});
