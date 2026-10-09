import {describe, expect, it} from 'vitest';
import {canonicalUrl, createMeta, isNoindexPath} from './meta';

describe('canonicalUrl', () => {
  it('drops trailing slashes but keeps the root slash', () => {
    expect(canonicalUrl('https://x.com', '/products/lavender/')).toBe('https://x.com/products/lavender');
    expect(canonicalUrl('https://x.com', '/')).toBe('https://x.com/');
  });
});

describe('isNoindexPath', () => {
  it('matches private sections and their children only', () => {
    expect(isNoindexPath('/wholesale')).toBe(true);
    expect(isNoindexPath('/wholesale/orders/1')).toBe(true);
    expect(isNoindexPath('/dev/preloader')).toBe(true);
    expect(isNoindexPath('/cart')).toBe(true);
    expect(isNoindexPath('/products/lavender')).toBe(false);
    expect(isNoindexPath('/partners')).toBe(false);
    expect(isNoindexPath('/accountability')).toBe(false);
  });
});

describe('createMeta', () => {
  it('mirrors title and description into Open Graph tags', () => {
    expect(createMeta({title: 'T', description: 'D'})()).toEqual([
      {title: 'T'},
      {property: 'og:title', content: 'T'},
      {property: 'og:type', content: 'website'},
      {name: 'description', content: 'D'},
      {property: 'og:description', content: 'D'},
    ]);
  });
});
