import {describe, expect, it} from 'vitest';
import {sanitizeStorefrontHtml} from './sanitize';

describe('sanitizeStorefrontHtml', () => {
  it('strips script tags', () => {
    const out = sanitizeStorefrontHtml('<p>hi</p><script>alert(1)</script>');
    expect(out).toBe('<p>hi</p>');
  });

  it('strips inline event handlers', () => {
    const out = sanitizeStorefrontHtml('<p onclick="alert(1)">hi</p>');
    expect(out).not.toContain('onclick');
  });

  it('strips javascript: URLs', () => {
    const out = sanitizeStorefrontHtml('<a href="javascript:alert(1)">x</a>');
    expect(out).not.toContain('javascript:');
  });

  it('strips iframes', () => {
    const out = sanitizeStorefrontHtml('<iframe src="https://evil.test"></iframe>');
    expect(out).toBe('');
  });

  it('keeps images from the Shopify CDN', () => {
    const html = '<img src="//cdn.shopify.com/a.jpg" alt="a">';
    expect(sanitizeStorefrontHtml(html)).toContain('cdn.shopify.com/a.jpg');
  });

  it('keeps class and style attributes used by editor formatting', () => {
    const html = '<p class="lead" style="text-align:center">hi</p>';
    const out = sanitizeStorefrontHtml(html);
    expect(out).toContain('class="lead"');
    expect(out).toContain('text-align:center');
  });

  it('returns an empty string for null or undefined body', () => {
    expect(sanitizeStorefrontHtml(null)).toBe('');
    expect(sanitizeStorefrontHtml(undefined)).toBe('');
  });
});
