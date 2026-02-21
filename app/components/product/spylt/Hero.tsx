import {useEffect, useRef} from 'react';
import {useGSAP} from '@gsap/react';
import {
  getSelectedProductOptions,
  Analytics,
  useOptimisticVariant,
  getProductOptions,
  getAdjacentAndFirstAvailableVariants,
  useSelectedOptionInUrlParam,
  Image,
} from '@shopify/hydrogen';
import gsap from 'gsap';
import HeroMobileBackgroundImage from '~/assets/images/hero-mobile-2.png?responsive';
import HeroVideoThumbnailUrl from '~/assets/images/hero-video-thumbnail.png';
import HeroVideo from '~/assets/video/soap-bar-blast.mp4';
import {AddToCartButton} from '~/components/AddToCartButton';
import {Picture} from '~/components/Picture';
import {StickyAddToCart} from '~/components/product/spylt/StickyAddToCart';
import {ProductForm} from '~/components/ProductForm';
import {ProductImage} from '~/components/ProductImage';
import {LiquidButton} from '~/components/ui/LiquidButton';
import type {Product} from '@shopify/hydrogen/storefront-api-types';

const PRODUCTS_BACKGROUND_COLOR_MAP: Record<string, string> = {
  'soap-bar-blast': '#8B0000',
  'body-wash-blast': '#008B8B',
  'shampoo-blast': '#2F4F4F',
};

interface HeroProps {
  product: any;
}

export function Hero({product}: HeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  const selectedVariant = useOptimisticVariant(
    product.selectedOrFirstAvailableVariant,
    getAdjacentAndFirstAvailableVariants(product),
  );

  const backgroundColor = PRODUCTS_BACKGROUND_COLOR_MAP[product.handle] || '#8B0000';

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

  // Get the product options array
  const productOptions = getProductOptions({
    ...product,
    selectedOrFirstAvailableVariant: selectedVariant,
  });

  return (
    <div
      ref={containerRef}
      className="sticky top-0 h-screen w-auto overflow-hidden bg-[#8B0000] text-secondary flex flex-col justify-center items-center z-1"
    >
      <div className="entry-images">
        <div
          className="woocommerce-product-gallery woocommerce-product-gallery--with-images woocommerce-product-gallery--columns-4 images"
          data-columns="4"
        >
          <div className="woocommerce-product-gallery__wrapper">
            <div
              data-thumb="https://www.leroux.com/wp-content/uploads/2023/07/soluble-naturebio-100g-2024-1-100x100.png"
              data-thumb-alt="Produit pot de chicorée soluble nature bio 100g"
              data-thumb-srcset="https://www.leroux.com/wp-content/uploads/2023/07/soluble-naturebio-100g-2024-1-100x100.png 100w, https://www.leroux.com/wp-content/uploads/2023/07/soluble-naturebio-100g-2024-1-300x300.png 300w, https://www.leroux.com/wp-content/uploads/2023/07/soluble-naturebio-100g-2024-1-150x150.png 150w, https://www.leroux.com/wp-content/uploads/2023/07/soluble-naturebio-100g-2024-1.png 500w"
              data-thumb-sizes="(max-width: 100px) 100vw, 100px"
              className="woocommerce-product-gallery__image"
            >
              <a href="https://www.leroux.com/wp-content/uploads/2023/07/soluble-naturebio-100g-2024-1.png">
                <Image
                  src={product.selectedOrFirstAvailableVariant.image.url}
                  alt={product.selectedOrFirstAvailableVariant.image.altText || product.title}
                  className="w-full h-auto drop-shadow-2xl"
                  width={product.selectedOrFirstAvailableVariant.image.width}
                  height={product.selectedOrFirstAvailableVariant.image.height}
                />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="content-wrapper">
        <StickyAddToCart product={product} selectedVariant={selectedVariant} />
        <a href="https://www.leroux.com/produits/" className="Btn --back " data-taxi-ignore="">
          <span className="Btn__txt">Back to the list</span>
          <div className="Btn__arrow">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 9.69531L17.3918 9.69531" stroke="white" strokeWidth="2" strokeMiterlimit="10"></path>
              <path d="M12.6953 5L17.1953 9.5L12.6953 14" stroke="white" strokeWidth="2"></path>
            </svg>
          </div>
        </a>
        <div className="heading-wrapper">
          <h1
            ref={titleRef}
            className="text-[12vw] leading-none font-black uppercase tracking-tighter mix-blend-overlay opacity-80 mb-[-5vw]"
          >
            {product.title}
          </h1>
          <div className="product-labels">
            <div className="visual__container">
              <picture className="visual">
                <source
                  data-srcset="https://www.leroux.com/wp-content/uploads/2023/07/pictos-leroux-cmjn-origine-vegetale.webp 100w"
                  type="image/webp"
                  srcSet="https://www.leroux.com/wp-content/uploads/2023/07/pictos-leroux-cmjn-origine-vegetale.webp 100w"
                />
                <img
                  className="img-fluid lazyloaded"
                  data-src="https://www.leroux.com/wp-content/uploads/2023/07/pictos-leroux-cmjn-origine-vegetale.png"
                  alt=""
                  src="https://www.leroux.com/wp-content/uploads/2023/07/pictos-leroux-cmjn-origine-vegetale.png"
                />
              </picture>
            </div>
            <div className="visual__container">
              <picture className="visual">
                <source
                  data-srcset="https://www.leroux.com/wp-content/uploads/2023/07/pictos-leroux-rvb-sans-cafeine.webp 100w"
                  type="image/webp"
                  srcSet="https://www.leroux.com/wp-content/uploads/2023/07/pictos-leroux-rvb-sans-cafeine.webp 100w"
                />
                <img
                  className="img-fluid lazyloaded"
                  data-src="https://www.leroux.com/wp-content/uploads/2023/07/pictos-leroux-rvb-sans-cafeine.png"
                  alt=""
                  src="https://www.leroux.com/wp-content/uploads/2023/07/pictos-leroux-rvb-sans-cafeine.png"
                />
              </picture>
            </div>
            <div className="visual__container">
              <picture className="visual">
                <source
                  data-srcset="https://www.leroux.com/wp-content/uploads/2024/03/pictos-leroux-rvb-sans-sucre-ajout.webp 100w"
                  type="image/webp"
                  srcSet="https://www.leroux.com/wp-content/uploads/2024/03/pictos-leroux-rvb-sans-sucre-ajout.webp 100w"
                />
                <img
                  className="img-fluid lazyloaded"
                  data-src="https://www.leroux.com/wp-content/uploads/2024/03/pictos-leroux-rvb-sans-sucre-ajout.png"
                  alt=""
                  src="https://www.leroux.com/wp-content/uploads/2024/03/pictos-leroux-rvb-sans-sucre-ajout.png"
                />
              </picture>
            </div>
          </div>
          {/* <div className="product-labels">
            {product.tags.nodes.map((tag: any) => (
              <div key={tag.id} className="visual__container">
                <img src={tag.image.url} alt={tag.image.altText} className="img-fluid lazyloaded" />
              </div>
            ))}
          </div> */}
        </div>
        <div className="description-wrapper">
          <div className="mt-10 max-w-xl mx-auto text-center opacity-90 text-lg md:text-xl font-medium">
            <p dangerouslySetInnerHTML={{__html: product.descriptionHtml || ''}} className="line-clamp-3" />
          </div>

          <ProductForm productOptions={productOptions} selectedVariant={selectedVariant} hideAddToCart={true} />
        </div>
      </div>

      {/* <div className="z-2 mt-0 overflow-hidden w-full h-screen absolute inset-0">
        <div className=" flex flex-col justify-between items-center w-screen px-[2vw] text-milk h-auto mt-[80px] pt-0 static">
          <div>
            <h1
              ref={titleRef}
              className="text-[12vw] leading-none font-black uppercase tracking-tighter mix-blend-overlay opacity-80 mb-[-5vw]"
            >
              {product.title}
            </h1>
          </div>

          <div className="mt-10 max-w-xl mx-auto text-center opacity-90 text-lg md:text-xl font-medium">
            <p dangerouslySetInnerHTML={{__html: product.descriptionHtml || ''}} className="line-clamp-3" />
          </div>

          <LiquidButton ref={buttonRef} href="/locations" text="Find in Stores" />
        </div>

        <div
          ref={imageRef}
          className="relative z-20 w-[40vh] md:w-[60vh] mx-auto transform rotate-[-5deg] hover:rotate-0 transition-transform duration-500"
        >
          {product.featuredImage && (
            <img
              src={product.featuredImage.url}
              alt={product.featuredImage.altText || product.title}
              className="w-full h-auto drop-shadow-2xl"
            />
          )}
        </div>

        <Picture
          src={HeroMobileBackgroundImage}
          loading="eager"
          fetchpriority="high"
          alt=""
          className="hero-image-mobile"
        />

        <div id="home-hero-video" className="hero-video-wrapper">
          <video
            ref={videoRef}
            src={HeroVideo}
            playsInline={true}
            muted={true}
            autoPlay={true}
            preload="none"
            poster={HeroVideoThumbnailUrl}
            width={1920}
            height={1080}
            className="size-full object-cover"
          />
        </div>
      </div> */}
    </div>
  );
}
