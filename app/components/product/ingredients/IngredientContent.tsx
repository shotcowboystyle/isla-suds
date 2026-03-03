import {INGREDIENTS, type IngredientItem} from '~/content/ingredients';
import {cn} from '~/utils/cn';
import styles from './IngredientContent.module.css';

interface IngredientContentProps {
  activeIngredientId?: number | null;
}

export function IngredientContent({activeIngredientId}: IngredientContentProps) {
  return (
    <>
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

      <div className={cn(styles['heading-wrapper'], activeIngredientId && 'hidden')}>
        <h2 className={cn(styles['heading-text'])}>
          We define the ingredients
          <br />
          your skin loves
        </h2>
      </div>

      <div className={cn(styles['cir-text-wrap'], activeIngredientId && 'hidden')}>
        <div className={cn(styles['cir-text'])}>Click an ingredient</div>
      </div>

      <div className={cn(styles['ingredient-center-circle-wrap'], activeIngredientId && 'block!')}>
        {Array.from({length: INGREDIENTS.length}).map((_, index) => (
          <div key={index} className={cn(styles['ingredient-center-circle'], `is-${index + 1}`)}></div>
        ))}
      </div>

      <div className={cn(styles['ingredient-content-wrap'], activeIngredientId && 'block!')}>
        {INGREDIENTS.map((ingredient, index) => {
          if (activeIngredientId !== ingredient.id) return null;
          return (
            <p key={ingredient.id} className={cn(styles['ingredient-text'], `is-${index + 1}`)}>
              {ingredient.description}
            </p>
          );
        })}
      </div>
    </>
  );
}
