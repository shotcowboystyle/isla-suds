import {useRef} from 'react';
import styles from './VideoCard.module.css';
import {cn} from '../utils/cn';

interface VideoCardProps {
  cardData: {
    src: string;
    poster: string;
    rotation: string;
    name: string;
    img: string;
  };
  index: number;
}

export const VideoCard = ({cardData, index}: VideoCardProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlay = () => videoRef.current?.play();

  const handlePause = () => videoRef.current?.pause();

  return (
    // <div className={cn(styles['video-card'], `animated-video-card ${cardData.translation} ${cardData.rotation}`)}>
    <div className={cn(styles['video-card'], styles[`card-${index + 1}`], `animated-video-card ${cardData.rotation}`)}>
      <div className={styles['media-cart-info-wrapper']}>
        <img src={cardData.src} loading="lazy" alt="" className={styles['avatar']} />
        <div>{cardData.name}</div>
      </div>

      <button className={cn(styles['media-cart-lightbox'])} aria-label="open lightbox" aria-haspopup="dialog">
        <div className={styles['hover-video-wrapper']}>
          <div className={cn(styles['video'], 'embed-video')}>
            <div className={styles['hover-video-wrapper']}>
              <video
                className={styles['video']}
                src={cardData.src}
                poster={cardData.poster}
                ref={videoRef}
                onMouseEnter={() => void handlePlay()}
                onMouseLeave={handlePause}
                muted
                playsInline
                loop
                preload="none"
              />
            </div>
          </div>
        </div>
      </button>
    </div>
  );
};
