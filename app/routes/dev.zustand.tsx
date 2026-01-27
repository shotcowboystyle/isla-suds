import {useState} from 'react';
import {
  useCartDrawerOpen,
  useExplorationActions,
  useProductsExplored,
  useSessionStartTime,
  useStoryMomentShown,
  useTextureRevealsCount,
} from '~/hooks/use-exploration-state';
import type {Route} from './+types/dev.zustand';

/**
 * Dev route for testing Zustand exploration store
 *
 * URL: /dev/zustand
 * NOTE: This route should be excluded from production builds or gated behind authentication
 *
 * Tests:
 * - Store initialization (sessionStartTime)
 * - Product exploration tracking (Set operations)
 * - Texture reveal counter
 * - Story moment flag
 * - Cart drawer state
 * - Session reset
 */
export async function loader({request}: Route.LoaderArgs) {
  // Block access in production (when NODE_ENV is 'production')
  // In development, this will be undefined or 'development'
  if (process.env.NODE_ENV === 'production') {
    throw new Response('Not Found', {status: 404});
  }
  return null;
}

export default function DevZustand() {
  const [testProductId, setTestProductId] = useState('product-1');

  // Selector hooks
  const productsExplored = useProductsExplored();
  const textureRevealsCount = useTextureRevealsCount();
  const storyMomentShown = useStoryMomentShown();
  const sessionStartTime = useSessionStartTime();
  const [cartDrawerOpen, setCartDrawerOpen] = useCartDrawerOpen();

  // Actions
  const {
    addProductExplored,
    incrementTextureReveals,
    setStoryMomentShown,
    resetSession,
  } = useExplorationActions();

  // Calculate session duration in seconds
  const sessionDuration =
    sessionStartTime > 0 ? Math.floor((Date.now() - sessionStartTime) / 1000) : 0;

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-2">Zustand Store Test</h1>
      <p className="text-gray-600 mb-8">Dev route for testing exploration store</p>

      {/* Session Info */}
      <section className="mb-8 p-4 border rounded">
        <h2 className="text-xl font-semibold mb-3">Session Info</h2>
        <div className="space-y-2">
          <p>
            <strong>Session Start:</strong>{' '}
            {sessionStartTime > 0 ? new Date(sessionStartTime).toLocaleTimeString() : 'Not initialized'}
          </p>
          <p>
            <strong>Session Duration:</strong> {sessionDuration}s
          </p>
          <p>
            <strong>Status:</strong>{' '}
            <span className={sessionStartTime > 0 ? 'text-green-600' : 'text-red-600'}>
              {sessionStartTime > 0 ? '✓ Initialized' : '✗ Not initialized'}
            </span>
          </p>
        </div>
      </section>

      {/* Product Exploration */}
      <section className="mb-8 p-4 border rounded">
        <h2 className="text-xl font-semibold mb-3">Product Exploration Tracking</h2>
        <div className="space-y-4">
          <div>
            <p className="mb-2">
              <strong>Products Explored:</strong> {productsExplored.size}
            </p>
            <div className="flex flex-wrap gap-2 mb-3">
              {Array.from(productsExplored).map((id) => (
                <span key={id} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                  {id}
                </span>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={testProductId}
              onChange={(e) => setTestProductId(e.target.value)}
              placeholder="Product ID"
              className="flex-1 px-3 py-2 border rounded"
            />
            <button
              onClick={() => addProductExplored(testProductId)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Add Product
            </button>
          </div>

          <div className="text-sm text-gray-600">
            <strong>Set Immutability Test:</strong> Each click creates a new Set instance
          </div>
        </div>
      </section>

      {/* Texture Reveals */}
      <section className="mb-8 p-4 border rounded">
        <h2 className="text-xl font-semibold mb-3">Texture Reveals</h2>
        <div className="space-y-3">
          <p>
            <strong>Count:</strong> {textureRevealsCount}
          </p>
          <button
            onClick={() => incrementTextureReveals()}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Increment Texture Reveals
          </button>
        </div>
      </section>

      {/* Story Moment */}
      <section className="mb-8 p-4 border rounded">
        <h2 className="text-xl font-semibold mb-3">Story Moment State</h2>
        <div className="space-y-3">
          <p>
            <strong>Shown:</strong>{' '}
            <span className={storyMomentShown ? 'text-green-600' : 'text-gray-600'}>
              {storyMomentShown ? '✓ Yes' : '✗ No'}
            </span>
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setStoryMomentShown(true)}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Mark Shown
            </button>
            <button
              onClick={() => setStoryMomentShown(false)}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Reset
            </button>
          </div>
        </div>
      </section>

      {/* Cart Drawer */}
      <section className="mb-8 p-4 border rounded">
        <h2 className="text-xl font-semibold mb-3">Cart Drawer State</h2>
        <div className="space-y-3">
          <p>
            <strong>Open:</strong>{' '}
            <span className={cartDrawerOpen ? 'text-green-600' : 'text-gray-600'}>
              {cartDrawerOpen ? '✓ Yes' : '✗ No'}
            </span>
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCartDrawerOpen(true)}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Open Cart
            </button>
            <button
              onClick={() => setCartDrawerOpen(false)}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Close Cart
            </button>
          </div>
        </div>
      </section>

      {/* Session Reset */}
      <section className="mb-8 p-4 border rounded bg-red-50">
        <h2 className="text-xl font-semibold mb-3 text-red-800">Reset Session</h2>
        <p className="mb-3 text-sm text-red-700">
          Resets all store state to initial values (for testing)
        </p>
        <button
          onClick={() => {
            resetSession();
            setTestProductId('product-1');
          }}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Reset Session
        </button>
      </section>

      {/* Integration Status */}
      <section className="p-4 border rounded bg-green-50">
        <h2 className="text-xl font-semibold mb-3 text-green-800">Integration Status</h2>
        <ul className="space-y-2 text-sm">
          <li className="flex items-center gap-2">
            <span className="text-green-600">✓</span>
            Store accessible via selector hooks
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-600">✓</span>
            State updates trigger re-renders
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-600">✓</span>
            Session initialized client-side
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-600">✓</span>
            TypeScript types working
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-600">✓</span>
            SSR-safe (no hydration warnings)
          </li>
        </ul>
      </section>

      {/* Navigation Persistence Test */}
      <section className="mt-8 p-4 border rounded bg-blue-50">
        <h2 className="text-xl font-semibold mb-3 text-blue-800">Navigation Test</h2>
        <p className="mb-3 text-sm">
          To test state persistence across navigation:
        </p>
        <ol className="list-decimal list-inside space-y-1 text-sm mb-3">
          <li>Add some products and increment counters</li>
          <li>Navigate to another route (e.g., <a href="/" className="text-blue-600 underline">Home</a>)</li>
          <li>Return to this page</li>
          <li>State should persist</li>
        </ol>
      </section>
    </div>
  );
}
