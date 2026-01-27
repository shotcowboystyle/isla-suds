import {useState} from 'react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/Dialog';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from '~/components/ui/NavigationMenu';
import type {Route} from './+types/dev.radix';

export const meta: Route.MetaFunction = () => {
  return [{title: 'Radix Primitives Verification | Isla Suds'}];
};

export default function RadixVerification() {
  const [inputValue, setInputValue] = useState('');

  return (
    <div className="min-h-screen bg-canvas-base p-spacing-xl text-text-primary">
      <header className="mb-spacing-2xl border-b border-text-muted/20 pb-spacing-md">
        <h1 className="text-fluid-heading font-bold">
          Radix Primitives Verification
        </h1>
        <p className="text-fluid-body">
          Testing Dialog and NavigationMenu accessibility and keyboard behavior.
        </p>
      </header>

      <div className="space-y-spacing-2xl">
        {/* Dialog Section */}
        <section className="space-y-spacing-md">
          <div className="border-b border-text-muted/10 pb-spacing-xs">
            <h2 className="text-sm font-mono uppercase tracking-wider">
              Dialog Component
            </h2>
          </div>

          <div className="rounded-lg border border-neutral-200 bg-white p-spacing-lg">
            <Dialog>
              <DialogTrigger className="rounded-md bg-accent-primary px-4 py-2 text-sm font-medium text-text-primary hover:bg-accent-primary/90 focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2">
                Open Dialog
              </DialogTrigger>
              <DialogPortal>
                <DialogOverlay />
                <DialogContent>
                  <DialogTitle>Test Dialog Title</DialogTitle>
                  <DialogDescription>
                    This dialog tests keyboard navigation, focus trapping, and
                    accessibility. Try the following:
                  </DialogDescription>

                  <div className="space-y-spacing-md pt-spacing-sm">
                    <div>
                      <label
                        htmlFor="test-input"
                        className="mb-spacing-xs block text-sm font-medium"
                      >
                        Test Input
                      </label>
                      <input
                        id="test-input"
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        className="w-full rounded border border-neutral-300 px-3 py-2 text-sm focus:border-accent-primary focus:outline-none focus:ring-1 focus:ring-accent-primary"
                        placeholder="Type something..."
                      />
                    </div>

                    <div className="flex gap-spacing-sm">
                      <DialogClose className="rounded-md bg-neutral-200 px-4 py-2 text-sm font-medium hover:bg-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2">
                        Cancel
                      </DialogClose>
                      <DialogClose className="rounded-md bg-accent-primary px-4 py-2 text-sm font-medium text-text-primary hover:bg-accent-primary/90 focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2">
                        Confirm
                      </DialogClose>
                    </div>
                  </div>
                </DialogContent>
              </DialogPortal>
            </Dialog>

            <div className="mt-spacing-md space-y-spacing-xs text-xs">
              <p className="font-semibold">Keyboard Test Checklist:</p>
              <ul className="list-inside list-disc space-y-1 pl-spacing-xs">
                <li>Tab: Focus cycles through dialog elements only</li>
                <li>Escape: Closes dialog</li>
                <li>Focus returns to trigger button on close</li>
                <li>Overlay click: Closes dialog</li>
              </ul>
            </div>
          </div>
        </section>

        {/* NavigationMenu Section */}
        <section className="space-y-spacing-md">
          <div className="border-b border-text-muted/10 pb-spacing-xs">
            <h2 className="text-sm font-mono uppercase tracking-wider">
              NavigationMenu Component
            </h2>
          </div>

          <div className="rounded-lg border border-neutral-200 bg-white p-spacing-lg">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    href="/"
                    className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-neutral-100 hover:text-neutral-900 focus:bg-neutral-100 focus:text-neutral-900 focus:outline-none"
                  >
                    Home
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger>Products</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid w-[400px] gap-3 p-4">
                      <NavigationMenuLink
                        href="/products/soaps"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-neutral-100 focus:bg-neutral-100"
                      >
                        <div className="text-sm font-medium leading-none">
                          Handcrafted Soaps
                        </div>
                        <p className="line-clamp-2 text-sm leading-snug">
                          Explore our collection of artisan soaps
                        </p>
                      </NavigationMenuLink>
                      <NavigationMenuLink
                        href="/products/bundles"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-neutral-100 focus:bg-neutral-100"
                      >
                        <div className="text-sm font-medium leading-none">
                          Variety Packs
                        </div>
                        <p className="line-clamp-2 text-sm leading-snug">
                          Curated bundles for every preference
                        </p>
                      </NavigationMenuLink>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink
                    href="/about"
                    className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-neutral-100 hover:text-neutral-900 focus:bg-neutral-100 focus:text-neutral-900 focus:outline-none"
                  >
                    About
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
              <NavigationMenuViewport />
            </NavigationMenu>

            <div className="mt-spacing-md space-y-spacing-xs text-xs">
              <p className="font-semibold">Keyboard Test Checklist:</p>
              <ul className="list-inside list-disc space-y-1 pl-spacing-xs">
                <li>Tab: Navigate between menu items</li>
                <li>Enter/Space: Open dropdown content</li>
                <li>Arrow keys: Navigate within dropdown</li>
                <li>Escape: Close dropdown</li>
              </ul>
            </div>
          </div>
        </section>
      </div>

      <footer className="mt-spacing-2xl border-t border-text-muted/20 pt-spacing-md text-xs font-mono">
        <p>
          For axe-core accessibility testing, use Axe DevTools browser extension
          on this page.
        </p>
      </footer>
    </div>
  );
}
