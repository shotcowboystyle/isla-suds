import {useState, useEffect, useRef} from 'react';
import {useGSAP} from '@gsap/react';
import gsap from 'gsap';
import {SplitText} from 'gsap/SplitText';
import {INGREDIENTS} from '~/content/ingredients';
import {cn} from '~/utils/cn';
import styles from './IngredientContent.module.css';

interface IngredientContentProps {
  activeIngredientId?: number | null;
}

export function IngredientContent({activeIngredientId}: IngredientContentProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const circleWrapRef = useRef<HTMLDivElement>(null);
  const headingText = useRef<HTMLHeadingElement>(null);
  const [displayId, setDisplayId] = useState<number | null>(activeIngredientId || null);

  useEffect(() => {
    if (typeof activeIngredientId === 'number') {
      setDisplayId(activeIngredientId);
    }
  }, [activeIngredientId]);

  useGSAP(
    () => {
      if (!containerRef.current || !headingText.current) {
        return;
      }

      const textSplitted = SplitText.create(headingText.current, {
        type: 'words',
      });

      const masterTl = gsap.timeline({
        scrollTrigger: {
          trigger: headingText.current,
          start: 'top 80%',
          end: '+=200',
          scrub: 1,
        },
      });

      masterTl.from(textSplitted.words, {
        color: '#cccccc',
        ease: 'power1.in',
        stagger: 1,
      });
    },
    {dependencies: [containerRef, headingText]},
  );

  useGSAP(
    () => {
      if (!containerRef.current) return;

      const isActive = !!activeIngredientId;

      if (isActive) {
        // Hide default headings
        gsap.to(['.js-heading-wrap', '.js-cir-text-wrap'], {
          autoAlpha: 0,
          scale: 0.8,
          duration: 0.4,
          ease: 'power2.inOut',
        });
        // Show content and center circle
        // gsap.to(['.js-ingredient-center-circle', '.js-ingredient-content-wrap'], {
        gsap.to(['.js-ingredient-center-circle'], {
          autoAlpha: 1,
          scale: 1,
          duration: 0.5,
          ease: 'back.out(1.5)',
          stagger: 0.05,
          delay: 0.1,
        });
      } else {
        // Hide content
        // gsap.to(['.js-ingredient-center-circle', '.js-ingredient-content-wrap'], {
        gsap.to(['.js-ingredient-center-circle'], {
          autoAlpha: 0,
          scale: 0,
          duration: 0.4,
          ease: 'power2.inOut',
        });
        // Show default headings
        gsap.to(['.js-heading-wrap', '.js-cir-text-wrap'], {
          autoAlpha: 1,
          scale: 1,
          duration: 0.5,
          ease: 'back.out(1.5)',
          delay: 0.1,
          onComplete: () => setDisplayId(null),
        });
      }
    },
    {scope: containerRef, dependencies: [activeIngredientId]},
  );

  useGSAP(
    () => {
      if (!circleWrapRef.current) return;

      const xTo = gsap.quickTo(circleWrapRef.current, 'x', {duration: 0.8, ease: 'power3.out'});
      const yTo = gsap.quickTo(circleWrapRef.current, 'y', {duration: 0.8, ease: 'power3.out'});

      const handleMouseMove = (e: MouseEvent) => {
        const {innerWidth, innerHeight} = window;
        // Magnetic effect: gentle shift based on distance from center
        const x = (e.clientX - innerWidth / 2) * 0.05;
        const y = (e.clientY - innerHeight / 2) * 0.05;

        xTo(x);
        yTo(y);
      };

      window.addEventListener('mousemove', handleMouseMove);

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
      };
    },
    {dependencies: []},
  );

  return (
    <div ref={containerRef} className="w-full h-full absolute inset-0 flex items-center justify-center">
      <div className={cn(styles['ingredient-img-wrapper'])}>
        {INGREDIENTS.map((ingredient) => (
          <div key={ingredient.id} className={cn(styles['ingredient-img'], 'is-1')}>
            <div className={cn(styles['ingredient-video'])}>
              <video autoPlay loop muted playsInline data-object-fit="cover">
                <source src={ingredient.videoSrc} />
              </video>
            </div>

            <div className={cn(styles['vid-overlay'])}></div>
          </div>
        ))}
      </div>

      <div className={cn(styles['heading-wrapper'], 'js-heading-wrap')}>
        <h2 ref={headingText} className={cn(styles['heading-text'])}>
          We define the ingredients
          <br />
          your skin loves
        </h2>
      </div>

      <div className={cn(styles['cir-text-wrap'], 'js-cir-text-wrap')}>
        <div className={cn(styles['cir-text'])}>Click an ingredient</div>
      </div>

      <div ref={circleWrapRef} className={cn(styles['ingredient-center-circle-wrap'], 'js-ingredient-center-circle')}>
        {INGREDIENTS.map((ingredient, index) => (
          <div key={ingredient.id} className={cn(styles['ingredient-center-circle'], `is-${index + 1}`)}></div>
        ))}

        <div className={cn(styles['ingredient-content-wrap'], 'js-ingredient-content-wrap')}>
          {INGREDIENTS.map((ingredient, index) => {
            if (displayId !== ingredient.id) return null;
            return (
              <p key={ingredient.id} className={cn(styles['ingredient-text'], `is-${index + 1}`)}>
                {ingredient.description}
              </p>
            );
          })}
        </div>
      </div>
    </div>
  );
}
