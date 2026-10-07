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
      {/* These clips are generated skits, not customer reviews, so they carry
          no names or quotes. Real reviews get their own treatment when they exist. */}
      <div className={cn(styles['media-cart-lightbox'])}>
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
      </div>
    </div>
  );
};
