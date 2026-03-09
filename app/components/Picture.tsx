import {forwardRef, type HTMLAttributes, type ImgHTMLAttributes} from 'react';
import {ResponsiveImage} from '@responsive-image/react';
import {cn} from '~/utils/cn';
import type {ImageData} from '@responsive-image/core';

export interface PictureProps extends Omit<
  ImgHTMLAttributes<HTMLImageElement>,
  'src' | 'children' | 'width' | 'height'
> {
  src: ImageData;
  alt: string;
  width?: number;
  height?: number;
  formats?: string[];
  fallbackFormat?: 'png' | 'jpg' | 'jpeg' | 'webp' | 'avif';
  fetchpriority?: 'high' | 'low' | 'auto';
  widths?: number[];
  sizes?: string;
  pictureAttributes?: HTMLAttributes<HTMLPictureElement>;
  loading?: 'lazy' | 'eager';
  decoding?: 'async' | 'sync' | 'auto';
}

export function Picture({
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
}: PictureProps) {
  return (
    <ResponsiveImage
      src={src}
      alt={alt}
      sizes={sizes}
      loading={loading}
      decoding={decoding}
      className={cn(className)}
      {...props}
    />
  );
}
