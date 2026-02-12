'use client';

import {useEffect, useState} from 'react';
import {useGSAP} from '@gsap/react';
import gsap from 'gsap';
import {useIsMobile} from '~/hooks/use-is-mobile';

export const VideoPin = () => {
  const {isMobile, isLoading} = useIsMobile();

  useGSAP(
    () => {
      if (!isLoading && !isMobile) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: '.vd-pin-section',
            start: '-15% top',
            end: '200% top',
            scrub: 1.5,
            pin: true,
          },
        });

        tl.to('.video-box', {
          clipPath: 'circle(100% at 50% 50%)',
          ease: 'power1.inOut',
        });
      }
    },
    {dependencies: [isLoading, isMobile], revertOnUpdate: true},
  );

  return (
    <div className="cursorwrapper">
      <div className="cursor">
        <div className="cursor-image">
          <a
            href="#"
            className="lightbox-link inline-block w-lightbox"
            aria-label="open lightbox"
            aria-haspopup="dialog"
          >
            <div className="chug-club_lightbox_button home">
              <img
                src="https://cdn.prod.website-files.com/669a8d6498ba88c08dfd2cd2/66bb5dfdded663c0354ecd59_play.svg"
                loading="lazy"
                data-w-id="2eb31b78-a05b-b156-18ae-bfe253e0c957"
                alt=""
                className="image-8"
              />

              <div className="div-block-63">
                <img
                  src="https://cdn.prod.website-files.com/669a8d6498ba88c08dfd2cd2/66bb5dfd6fae0cce9cb48297_Polygon%203.svg"
                  loading="lazy"
                  alt=""
                  className="image-7"
                />
              </div>
            </div>
          </a>

          <div
            data-poster-url="https://cdn.prod.website-files.com/669a8d6498ba88c08dfd2cd2%2F66ba106403383a807d33ff07_man%20mashup-poster-00001.jpg"
            data-video-urls="https://cdn.prod.website-files.com/669a8d6498ba88c08dfd2cd2%2F66ba106403383a807d33ff07_man%20mashup-transcode.mp4,https://cdn.prod.website-files.com/669a8d6498ba88c08dfd2cd2%2F66ba106403383a807d33ff07_man%20mashup-transcode.webm"
            data-autoplay="true"
            data-loop="true"
            data-wf-ignore="true"
            className="background-video-3 w-background-video w-background-video-atom"
          >
            <video
              id="dc2a7da6-bf15-6875-5f05-2edbe419a195-video"
              autoPlay=""
              loop=""
              // style='background-image:url("https://cdn.prod.website-files.com/669a8d6498ba88c08dfd2cd2%2F66ba106403383a807d33ff07_man%20mashup-poster-00001.jpg")'
              muted=""
              playsInline=""
              data-wf-ignore="true"
              data-object-fit="cover"
            >
              <source
                src="https://cdn.prod.website-files.com/669a8d6498ba88c08dfd2cd2%2F66ba106403383a807d33ff07_man%20mashup-transcode.mp4"
                data-wf-ignore="true"
              />

              <source
                src="https://cdn.prod.website-files.com/669a8d6498ba88c08dfd2cd2%2F66ba106403383a807d33ff07_man%20mashup-transcode.webm"
                data-wf-ignore="true"
              />
            </video>
          </div>
        </div>
      </div>
    </div>
  );
};
