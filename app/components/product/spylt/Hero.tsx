import {useRef} from 'react';
import {useGSAP} from '@gsap/react';
import {
  useOptimisticVariant,
  getProductOptions,
  getAdjacentAndFirstAvailableVariants,
  Image,
} from '@shopify/hydrogen';
import gsap from 'gsap';
import {StickyAddToCart} from '~/components/product/spylt/StickyAddToCart';
import {ProductForm} from '~/components/ProductForm';

interface HeroProps {
  product: any;
}

export function Hero({product}: HeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  const selectedVariant = useOptimisticVariant(
    product.selectedOrFirstAvailableVariant,
    getAdjacentAndFirstAvailableVariants(product),
  );

  useGSAP(
    () => {
      const tl = gsap.timeline();

      tl.from(titleRef.current, {
        y: 100,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
      }).from(
        imageRef.current,
        {
          scale: 0.8,
          opacity: 0,
          duration: 1.2,
          ease: 'power2.out',
        },
        '-=0.5',
      );
    },
    {scope: containerRef},
  );

  const productOptions = getProductOptions({
    ...product,
    selectedOrFirstAvailableVariant: selectedVariant,
  });

  const variantImage = selectedVariant?.image ?? product.selectedOrFirstAvailableVariant?.image;

  return (
    <div
      ref={containerRef}
      className="sticky top-0 h-screen w-auto overflow-hidden bg-[#8B0000] text-secondary flex flex-col justify-center items-center z-1"
    >
      {variantImage && (
        <div ref={imageRef}>
          <Image
            src={variantImage.url}
            alt={variantImage.altText || product.title}
            className="w-full h-auto drop-shadow-2xl"
            width={variantImage.width}
            height={variantImage.height}
          />
        </div>
      )}

      <div className="content-wrapper">
        <StickyAddToCart product={product} selectedVariant={selectedVariant} />
        <div className="heading-wrapper">
          <h1
            ref={titleRef}
            className="text-[12vw] leading-none font-black uppercase tracking-tighter mix-blend-overlay opacity-80 mb-[-5vw]"
          >
            {product.title}
          </h1>
        </div>
        <div className="description-wrapper">
          <div className="mt-10 max-w-xl mx-auto text-center opacity-90 text-lg md:text-xl font-medium">
            <p dangerouslySetInnerHTML={{__html: product.descriptionHtml || ''}} className="line-clamp-3" />
          </div>

          <ProductForm productOptions={productOptions} selectedVariant={selectedVariant} hideAddToCart={true} />
        </div>
      </div>
    </div>
  );
}
