import {useRef} from 'react';
import {Picture} from './Picture';
import styles from './VideoCard.module.css';
import {cn} from '../utils/cn';
import type {ImageData} from '@responsive-image/core';

interface VideoCardProps {
  cardData: {
    src: string;
    rotation: string;
    name: string;
    img: ImageData;
    translation: string | null;
  };
  index: number;
}

export const VideoCard = ({cardData, index}: VideoCardProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlay = () => videoRef.current?.play();

  const handlePause = () => videoRef.current?.pause();

  return (
    <div className={cn(styles['video-card'], `animated-video-card ${cardData.translation} ${cardData.rotation}`)}>
      <div className={styles['media-cart-info-wrapper']}>
        <Picture src={cardData.img} loading="lazy" alt="" className={styles['avatar']} />
        <div>{cardData.name}</div>
      </div>

      <button className={cn(styles['media-cart-lightbox'])} aria-label="open lightbox" aria-haspopup="dialog">
        <div className={styles['hover-video-wrapper']}>
          <div className={cn(styles['video'], 'embed-video')}>
            <div className={styles['hover-video-wrapper']}>
              <video
                className={styles['video']}
                src={cardData.src}
                ref={videoRef}
                onMouseEnter={handlePlay}
                onMouseLeave={handlePause}
                muted
                playsInline
                loop
                preload="none"
              />
            </div>
          </div>

          <div className={styles['background-video']}>
            <video
              src={cardData.src}
              muted
              playsInline
              loop
              preload="none"
            />
          </div>
        </div>
      </button>
    </div>
  );
};
