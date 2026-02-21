import {describe, it, expect} from 'vitest';
import {getVariantUrl} from './variant-url';

describe('getVariantUrl', () => {
  it('should return /products/{handle} for a simple handle with no options', () => {
    const result = getVariantUrl({
      handle: 'my-product',
      pathname: '/products/something',
      searchParams: new URLSearchParams(),
    });

    expect(result).toBe('/products/my-product');
  });

  it('should append a single selected option as a query param', () => {
    const result = getVariantUrl({
      handle: 'my-product',
      pathname: '/products/something',
      searchParams: new URLSearchParams(),
      selectedOptions: [{name: 'Color', value: 'Red'}],
    });

    expect(result).toBe('/products/my-product?Color=Red');
  });

  it('should handle multiple selected options', () => {
    const result = getVariantUrl({
      handle: 'my-product',
      pathname: '/products/something',
      searchParams: new URLSearchParams(),
      selectedOptions: [
        {name: 'Color', value: 'Red'},
        {name: 'Size', value: 'Large'},
      ],
    });

    expect(result).toBe('/products/my-product?Color=Red&Size=Large');
  });

  it('should preserve locale prefix from pathname', () => {
    const result = getVariantUrl({
      handle: 'my-product',
      pathname: '/en-US/products/something',
      searchParams: new URLSearchParams(),
    });

    expect(result).toBe('/en-US/products/my-product');
  });

  it('should preserve locale prefix with selected options', () => {
    const result = getVariantUrl({
      handle: 'my-product',
      pathname: '/fr-CA/products/old-product',
      searchParams: new URLSearchParams(),
      selectedOptions: [{name: 'Color', value: 'Blue'}],
    });

    expect(result).toBe('/fr-CA/products/my-product?Color=Blue');
  });

  it('should work with a non-locale pathname', () => {
    const result = getVariantUrl({
      handle: 'my-product',
      pathname: '/products/old',
      searchParams: new URLSearchParams(),
    });

    expect(result).toBe('/products/my-product');
  });

  it('should handle an empty selectedOptions array', () => {
    const result = getVariantUrl({
      handle: 'my-product',
      pathname: '/products/something',
      searchParams: new URLSearchParams(),
      selectedOptions: [],
    });

    expect(result).toBe('/products/my-product');
  });

  it('should handle undefined selectedOptions', () => {
    const result = getVariantUrl({
      handle: 'my-product',
      pathname: '/products/something',
      searchParams: new URLSearchParams(),
      selectedOptions: undefined,
    });

    expect(result).toBe('/products/my-product');
  });

  it('should preserve existing search params from the URLSearchParams object', () => {
    const searchParams = new URLSearchParams();
    searchParams.set('utm_source', 'newsletter');

    const result = getVariantUrl({
      handle: 'my-product',
      pathname: '/products/something',
      searchParams,
      selectedOptions: [{name: 'Color', value: 'Red'}],
    });

    expect(result).toContain('utm_source=newsletter');
    expect(result).toContain('Color=Red');
    expect(result).toMatch(/^\/products\/my-product\?/);
  });

  it('should mutate the passed URLSearchParams with selected options', () => {
    const searchParams = new URLSearchParams();

    getVariantUrl({
      handle: 'my-product',
      pathname: '/products/something',
      searchParams,
      selectedOptions: [{name: 'Color', value: 'Red'}],
    });

    expect(searchParams.get('Color')).toBe('Red');
  });

  it('should handle a non-products pathname without locale prefix', () => {
    const result = getVariantUrl({
      handle: 'my-product',
      pathname: '/collections/all',
      searchParams: new URLSearchParams(),
    });

    expect(result).toBe('/products/my-product');
  });

  it('should encode special characters in option values', () => {
    const result = getVariantUrl({
      handle: 'my-product',
      pathname: '/products/something',
      searchParams: new URLSearchParams(),
      selectedOptions: [{name: 'Color', value: 'Red & Blue'}],
    });

    // URLSearchParams encodes & as %26 and spaces as +
    expect(result).toBe('/products/my-product?Color=Red+%26+Blue');
  });
});
