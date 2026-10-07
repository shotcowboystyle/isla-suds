import {describe, it, expect} from 'vitest';
import {fireEvent, render, screen} from '@testing-library/react';
import {FooterBath} from './FooterBath';

function bubbles(container: HTMLElement) {
  return [...container.querySelectorAll<HTMLElement>('[class*="bubble"]:not([class*="bubbles"])')];
}

describe('FooterBath', () => {
  it('puts its children on the tub as real text', () => {
    render(<FooterBath>© Isla Suds</FooterBath>);
    expect(screen.getByText('© Isla Suds')).toBeVisible();
  });

  it('counts the pops the visitor makes', () => {
    const {container} = render(<FooterBath>legal</FooterBath>);
    const pill = container.querySelector('[data-pill]');
    expect(pill).toHaveTextContent('Go on, pop one.');

    fireEvent.pointerDown(bubbles(container)[0], {pointerType: 'touch'});
    expect(pill).toHaveTextContent('1 popped. So relaxing.');

    // A bubble mid-pop can't be popped twice.
    fireEvent.pointerDown(bubbles(container)[0], {pointerType: 'touch'});
    expect(pill).toHaveTextContent('1 popped. So relaxing.');
  });

  it('keeps a tapped bubble catching the tap, so it cannot click a link underneath', () => {
    const {container} = render(<FooterBath>legal</FooterBath>);
    const [tapped, hovered] = bubbles(container);

    fireEvent.pointerDown(tapped, {pointerType: 'touch'});
    fireEvent.pointerEnter(hovered, {pointerType: 'mouse'});

    // `.popped` drops pointer events; `.tapped` restores them for touch pops only.
    expect(tapped.className).toMatch(/popped/);
    expect(tapped.className).toMatch(/tapped/);
    expect(hovered.className).toMatch(/popped/);
    expect(hovered.className).not.toMatch(/tapped/);
  });
});
