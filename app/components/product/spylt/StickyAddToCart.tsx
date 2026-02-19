import {useState} from 'react';
import {AddToCartButton} from '~/components/AddToCartButton';
import type {Product} from '@shopify/hydrogen/storefront-api-types';

interface StickyAddToCartProps {
  product: Product;
  selectedVariant: any;
}

export function StickyAddToCart({product, selectedVariant}: StickyAddToCartProps) {
  const [quantity, setQuantity] = useState(1);

  const handleIncrement = () => setQuantity((q) => q + 1);
  const handleDecrement = () => setQuantity((q) => Math.max(1, q - 1));

  if (!product) return null;

  return (
    <>
      {/* Sticky Header - Title */}
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-200 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center">
          <h2 className="text-lg font-bold truncate text-[#8B0000]">{product.title}</h2>
        </div>
      </div>

      {/* Fixed Footer - Controls */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#8B0000] text-white p-4 shadow-[0_-5px_20px_rgba(0,0,0,0.2)]">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Quantity Input */}
          <div className="flex items-center gap-3 bg-white rounded-full px-2 py-1 text-black shrink-0">
            <button
              onClick={handleDecrement}
              className="w-8 h-8 flex items-center justify-center font-bold text-lg hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="w-6 text-center font-bold text-lg">{quantity}</span>
            <button
              onClick={handleIncrement}
              className="w-8 h-8 flex items-center justify-center font-bold text-lg hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>

          {/* Add To Cart Button Container */}
          <div className="flex-1 text-center md:text-right">
            <div className="[&_button]:w-full md:[&_button]:w-auto [&_button]:bg-white [&_button]:text-[#8B0000] [&_button]:font-bold [&_button]:uppercase [&_button]:tracking-wide [&_button]:px-8 [&_button]:py-3 [&_button]:rounded-full [&_button]:hover:bg-gray-100 [&_button]:transition-colors">
              <AddToCartButton
                disabled={!selectedVariant || !selectedVariant.availableForSale}
                lines={
                  selectedVariant
                    ? [
                        {
                          merchandiseId: selectedVariant.id,
                          quantity,
                          selectedVariant,
                        },
                      ]
                    : []
                }
              >
                {selectedVariant?.availableForSale ? (
                  <span className="flex items-center justify-center gap-2">
                    <span>Add to Cart</span>
                    {selectedVariant?.price && (
                      <>
                        <span className="opacity-50">•</span>
                        <span>
                          {selectedVariant.price.amount} {selectedVariant.price.currencyCode}
                        </span>
                      </>
                    )}
                  </span>
                ) : (
                  'Sold Out'
                )}
              </AddToCartButton>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
