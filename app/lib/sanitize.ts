import sanitizeHtml from 'sanitize-html';

/**
 * Allowlist for HTML authored in the Shopify admin (pages, policies, articles).
 *
 * sanitize-html's defaults drop `<img>` entirely and strip every `class`/`style`
 * attribute, which would silently delete images and formatting from rich-text
 * content. These additions restore what the Shopify editor produces while still
 * removing `<script>`, `<iframe>`, `on*` handlers, and non-http(s) URL schemes.
 */
const STOREFRONT_HTML_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [...sanitizeHtml.defaults.allowedTags, 'img'],
  allowedAttributes: {
    ...sanitizeHtml.defaults.allowedAttributes,
    a: ['href', 'name', 'target', 'rel'],
    '*': ['class', 'id', 'style', 'dir', 'lang'],
  },
  allowedSchemes: ['http', 'https', 'mailto', 'tel'],
  // Shopify serves editor images protocol-relative (//cdn.shopify.com/...).
  allowProtocolRelative: true,
};

/**
 * Sanitize merchant-authored HTML before handing it to dangerouslySetInnerHTML.
 *
 * The Storefront API returns `body`/`contentHtml` verbatim, so anyone who can
 * edit content in the Shopify admin could otherwise inject script into the
 * storefront. Every dangerouslySetInnerHTML sink for Storefront content must
 * route through here.
 */
export function sanitizeStorefrontHtml(html: string | null | undefined): string {
  if (!html) return '';
  return sanitizeHtml(html, STOREFRONT_HTML_OPTIONS);
}
