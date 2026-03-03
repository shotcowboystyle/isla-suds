import * as React from 'react';

/**
 * Loading skeleton for cart line items
 */
export function CartLineItemsSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({length: 3}).map((_, i) => (
        <div key={`skeleton-${i}`} className="flex gap-4 animate-pulse">
          {/* Image skeleton */}
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-neutral-200 rounded shrink-0" />

          {/* Content skeleton */}
          <div className="flex-1 flex flex-col gap-2">
            <div className="h-4 bg-neutral-200 rounded w-2/3" />
            <div className="h-3 bg-neutral-200 rounded w-1/2" />
            <div className="h-3 bg-neutral-200 rounded w-1/4 mt-auto" />
          </div>

          {/* Price skeleton (desktop) */}
          <div className="hidden sm:flex flex-col gap-2 items-end">
            <div className="h-3 bg-neutral-200 rounded w-16" />
            <div className="h-3 bg-neutral-200 rounded w-12" />
            <div className="h-4 bg-neutral-200 rounded w-20" />
          </div>
        </div>
      ))}
    </div>
  );
}
