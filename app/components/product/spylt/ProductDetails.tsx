import type {Product} from '@shopify/hydrogen/storefront-api-types';

interface ProductDetailsProps {
  product: any;
}

export function ProductDetails({product}: ProductDetailsProps) {
  return (
    <div className="bg-[#f5f5f0] text-black py-20 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h2 className="text-[8vw] md:text-[5vw] leading-[0.9] font-black uppercase tracking-tighter text-[#8B0000]">
            MEANWHILE...
            <br />
            SO FRESH
            <br />
            SO CLEAN CLEAN
          </h2>
        </div>
        <div className="text-xl md:text-2xl font-medium leading-relaxed opacity-80">
          <p>
            Isla Suds is a natural goat milk soap made with simple, high-quality ingredients. It is free of harsh
            chemicals, fragrances, and dyes, making it gentle enough for even the most sensitive skin.
          </p>
        </div>
      </div>

      <div className="mt-24 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-8 border-2 border-dashed border-[#8B0000] rounded-3xl">
            <h3 className="text-4xl font-black text-[#8B0000] mb-2">20g</h3>
            <p className="font-bold uppercase tracking-wide">Protein</p>
          </div>
          <div className="p-8 border-2 border-dashed border-[#8B0000] rounded-3xl">
            <h3 className="text-4xl font-black text-[#8B0000] mb-2">90</h3>
            <p className="font-bold uppercase tracking-wide">Calories</p>
          </div>
          <div className="p-8 border-2 border-dashed border-[#8B0000] rounded-3xl">
            <h3 className="text-4xl font-black text-[#8B0000] mb-2">0g</h3>
            <p className="font-bold uppercase tracking-wide">Sugar</p>
          </div>
        </div>
      </div>
    </div>
  );
}
