export function IntroSection() {
  return (
    <section className="bg-[#F2E9E1] py-20 text-[#3D2B1F]">
      <div className="container mx-auto px-4 text-center">
        <h2 className="mb-12 font-display text-5xl font-black uppercase leading-none tracking-tight md:text-7xl">
          ADD SOME SUDS <br /> TO YOUR SHELVES
        </h2>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Placeholder for product images */}
          <div className="aspect-[3/4] w-full bg-gray-200">
            {/* <img src="..." alt="Product 1" className="h-full w-full object-cover" /> */}
          </div>
          <div className="aspect-[3/4] w-full bg-gray-200">
            {/* <img src="..." alt="Product 2" className="h-full w-full object-cover" /> */}
          </div>
          <div className="aspect-[3/4] w-full bg-gray-200">
            {/* <img src="..." alt="Product 3" className="h-full w-full object-cover" /> */}
          </div>
        </div>

        <div className="mt-12 max-w-3xl mx-auto text-lg font-medium leading-relaxed">
          <p>
            Searching for a soap that stands out? Look no further. Isla Suds brings the finest ingredients and freshest
            scents to your customers. It's time to upgrade your inventory with a brand that people truly love.
          </p>
        </div>
      </div>
    </section>
  );
}
