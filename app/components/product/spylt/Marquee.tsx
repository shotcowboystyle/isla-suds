import {useRef} from 'react';
import {useGSAP} from '@gsap/react';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface MarqueeProps {
  text: string;
  direction?: 'left' | 'right';
  className?: string;
}

export function Marquee({text, direction = 'left', className = ''}: MarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = textRef.current;
      if (!el) return;

      const distance = el.offsetWidth / 2; // Assuming duplicated text for seamless loop

      // Simple continuous scroll
      gsap.to(el, {
        x: direction === 'left' ? -distance : distance,
        duration: 20,
        ease: 'none',
        repeat: -1,
      });
    },
    {scope: containerRef},
  );

  return (
    <div ref={containerRef} className={`overflow-hidden whitespace-nowrap py-4 bg-black text-white ${className}`}>
      <div ref={textRef} className="inline-block">
        <span className="text-[5vw] font-black uppercase mx-8">{text}</span>
        <span className="text-[5vw] font-black uppercase mx-8">{text}</span>
        <span className="text-[5vw] font-black uppercase mx-8">{text}</span>
        <span className="text-[5vw] font-black uppercase mx-8">{text}</span>
      </div>
    </div>
  );
}
