import type {Product} from '@shopify/hydrogen/storefront-api-types';

interface NutritionProps {
  product: any;
}

export function Nutrition({product}: NutritionProps) {
  return (
    <div className="bg-[#EAE0D5] py-20 overflow-hidden relative">
      <div className="max-w-[90vw] mx-auto relative z-10">
        <h2 className="text-[15vw] font-black text-[#4A3B32] opacity-10 leading-none absolute top-[-5vw] left-[-5vw] select-none pointer-events-none">
          NUTRITION
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-20 items-center">
          <div className="relative">
            {/* Product Image for Nutrition Section */}
            {product.featuredImage && (
              <img
                src={product.featuredImage.url}
                alt="Nutrition Info"
                className="w-full max-w-md mx-auto drop-shadow-2xl transform rotate-12"
              />
            )}
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl border-4 border-[#8B0000]">
            <h3 className="text-3xl font-black mb-6 uppercase border-b-4 border-[#8B0000] pb-2">Nutrition Facts</h3>

            <div className="space-y-4 font-mono">
              <div className="flex justify-between border-b border-gray-300 pb-2">
                <span className="font-bold">Serving Size</span>
                <span>1 Can (330ml)</span>
              </div>
              <div className="flex justify-between border-b border-black pb-2 text-xl font-black">
                <span>Calories</span>
                <span>90</span>
              </div>
              <div className="flex justify-between border-b border-gray-300 pb-2">
                <span className="font-bold">Total Fat</span>
                <span>0g</span>
              </div>
              <div className="flex justify-between border-b border-gray-300 pb-2">
                <span className="font-bold">Cholesterol</span>
                <span>15mg</span>
              </div>
              <div className="flex justify-between border-b border-gray-300 pb-2">
                <span className="font-bold">Sodium</span>
                <span>290mg</span>
              </div>
              <div className="flex justify-between border-b border-gray-300 pb-2">
                <span className="font-bold">Total Carbohydrate</span>
                <span>1g</span>
              </div>
              <div className="flex justify-between border-b border-gray-300 pb-2">
                <span className="font-bold">Protein</span>
                <span>20g</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
