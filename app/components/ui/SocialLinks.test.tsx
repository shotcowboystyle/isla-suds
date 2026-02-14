import {describe, it, expect} from 'vitest';
import {render, screen} from '@testing-library/react';
import {SocialLinks} from './SocialLinks';

describe('SocialLinks', () => {
  describe('Placeholder Icons (AC4)', () => {
    it('renders all 3 social media icons', () => {
      render(<SocialLinks />);

      const instagramIcon = screen.getByLabelText(/instagram/i);
      const facebookIcon = screen.getByLabelText(/facebook/i);
      const twitterIcon = screen.getByLabelText(/twitter|x/i);

      expect(instagramIcon).toBeInTheDocument();
      expect(facebookIcon).toBeInTheDocument();
      expect(twitterIcon).toBeInTheDocument();
    });

    it('each icon has descriptive aria-label with "coming soon" indicator', () => {
      render(<SocialLinks />);

      const instagramIcon = screen.getByLabelText(
        /isla suds on instagram.*coming soon/i,
      );
      const facebookIcon = screen.getByLabelText(
        /isla suds on facebook.*coming soon/i,
      );
      const twitterIcon = screen.getByLabelText(
        /isla suds on.*twitter|x.*coming soon/i,
      );

      expect(instagramIcon).toBeInTheDocument();
      expect(facebookIcon).toBeInTheDocument();
      expect(twitterIcon).toBeInTheDocument();
    });

    it('icons meet minimum touch target size', () => {
      render(<SocialLinks />);

      const instagramIcon = screen.getByLabelText(/instagram/i);

      // h-14 w-14 = 56px x 56px touch target
      expect(instagramIcon).toHaveClass('h-14');
      expect(instagramIcon).toHaveClass('w-14');
    });

    it('icons have "Coming soon" title attribute', () => {
      render(<SocialLinks />);

      const instagramIcon = screen.getByLabelText(/instagram/i);
      expect(instagramIcon).toHaveAttribute('title', 'Coming soon');
    });

    it('icons are rendered as anchor tags with href', () => {
      render(<SocialLinks />);

      const instagramIcon = screen.getByLabelText(/instagram/i);
      expect(instagramIcon.tagName).toBe('A');
      expect(instagramIcon).toHaveAttribute(
        'href',
        'https://www.instagram.com/islasuds/',
      );
    });

    it('container uses semantic ul/li structure', () => {
      const {container} = render(<SocialLinks />);

      const list = container.querySelector('ul');
      expect(list).toBeInTheDocument();

      const listItems = container.querySelectorAll('li');
      expect(listItems).toHaveLength(3);
    });

    it('navigation has proper aria-label for social media links', () => {
      render(<SocialLinks />);

      const nav = screen.getByRole('navigation', {
        name: /social media/i,
      });
      expect(nav).toBeInTheDocument();
    });

    it('icons have rounded-full border styling', () => {
      render(<SocialLinks />);

      const instagramIcon = screen.getByLabelText(/instagram/i);
      expect(instagramIcon).toHaveClass('rounded-full');
      expect(instagramIcon).toHaveClass('border-2');
    });

    it('layout adapts for future activation (data attributes present)', () => {
      render(<SocialLinks />);

      const instagramIcon = screen.getByLabelText(/instagram/i);
      expect(instagramIcon).toHaveAttribute('data-platform', 'instagram');
    });

    it('icons are keyboard focusable (AC6)', () => {
      render(<SocialLinks />);

      const instagramIcon = screen.getByLabelText(/instagram/i);
      expect(instagramIcon).toHaveAttribute('tabIndex', '0');
    });

    it('icons have hover transition styling', () => {
      render(<SocialLinks />);

      const instagramIcon = screen.getByLabelText(/instagram/i);
      expect(instagramIcon).toHaveClass('transition-colors');
    });

    it('each icon contains an SVG element', () => {
      render(<SocialLinks />);

      const instagramIcon = screen.getByLabelText(/instagram/i);
      const svg = instagramIcon.querySelector('svg');
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute('aria-hidden', 'true');
    });
  });
});
