import {forwardRef, type HTMLAttributes, type ImgHTMLAttributes} from 'react';
import {ResponsiveImage} from '@responsive-image/react';
import {cn} from '~/utils/cn';
import type {ImageData} from '@responsive-image/core';

interface PictureProps extends Omit<
  ImgHTMLAttributes<HTMLImageElement>,
  'src' | 'children' | 'width' | 'height'
> {
  src: ImageData;
  alt: string;
  width?: number;
  height?: number;
  formats?: string[];
  fallbackFormat?: 'png' | 'jpg' | 'jpeg' | 'webp' | 'avif';
  widths?: number[];
  sizes?: string;
  pictureAttributes?: HTMLAttributes<HTMLPictureElement>;
  loading?: 'lazy' | 'eager';
  decoding?: 'async' | 'sync' | 'auto';
}

const Picture = forwardRef<HTMLImageElement, PictureProps>(
  (
    {
      src,
      alt,
      formats: _formats,
      fallbackFormat: _fallbackFormat,
      widths: _widths,
      sizes,
      pictureAttributes: _pictureAttributes,
      loading = 'lazy',
      decoding = 'async',
      className,
      ...props
    },
    ref,
  ) => {
    // ResponsiveImage handles all the responsive logic automatically
    // We just need to pass through the relevant props
    return (
      <ResponsiveImage
        ref={ref}
        src={src}
        alt={alt}
        sizes={sizes}
        loading={loading}
        decoding={decoding}
        className={cn(className)}
        // Pass any additional img attributes
        {...props}
        // ResponsiveImage automatically generates formats and widths based on Vite config
      />
    );
  },
);

Picture.displayName = 'Picture';

export {Picture, type PictureProps};
