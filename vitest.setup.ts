import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';


// Auto-clean between tests
afterEach(() => {
  cleanup();
  document.body.innerHTML = '';
});

vi.mock('server-only', () => ({}));

// Mock common browser APIs
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

vi.mock('@shopify/hydrogen-react', async () => ({
    ...(((await vi.importActual('@shopify/hydrogen-react')) as any) || {}),
    flattenConnection: vi.fn().mockImplementation((data) => data),
    createStorefrontClient: () => ({
        getStorefrontApiUrl: () => '',
        getPublicTokenHeaders: () => ({})
    }),
    useCart: vi.fn().mockReturnValue({
        status: 'idle'
    }),
    useShop: vi.fn().mockReturnValue({}),
    useShopifyCookies: vi.fn().mockReturnValue({})
}));

vi.mock('react', async (importActual) => {
    return {
        ...(((await importActual()) as any) || {}),
        cache: vi.fn().mockImplementation((func) => func),
        Suspense: vi.fn().mockImplementation(({ children }: any) => children)
    };
});
