import {LiquidButton} from '~/components/ui/LiquidButton';

export function Hero() {
  return (
    <div className="relative h-screen w-full overflow-hidden bg-black text-white">
      {/* Background Image - converting the analysis description "lifestyle-oriented image" */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://cdn.shopify.com/s/files/1/0550/6665/2717/files/lifestyle_hero.jpg?v=1653456789" // Placeholder external image for now, will need to be replaced with a local asset or a real Shopify CDN link
          alt="Wholesale Hero"
          className="h-full w-full object-cover opacity-60"
        />
      </div>

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
        <h1 className="mb-2 font-display text-6xl font-black uppercase leading-none tracking-tighter md:text-[8vw]">
          GET STARTED <br />
          <span className="relative inline-block -rotate-2 transform bg-yellow-400 px-4 py-0 text-black">
            SELLING ISLA SUDS
          </span>
        </h1>

        <p className="mb-8 max-w-2xl text-lg font-medium uppercase tracking-wide md:text-xl">
          GROCERY — GYM — OFFICE — CAFÉ — HOTEL — SPA — RESTAURANT
        </p>

        <LiquidButton
          href="/dairy-dealers-application-form" // This will be the application route
          text="APPLY TODAY"
          className="bg-[#D99E5C] text-black hover:bg-[#c68945]"
          backgroundColor="#D99E5C"
        />
      </div>
    </div>
  );
}
