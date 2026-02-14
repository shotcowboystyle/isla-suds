import {useEffect, useState} from 'react';
import {useIsMobile} from '~/hooks/use-is-mobile';
import {cn} from '~/utils/cn';
import styles from './IngredientsTable.module.css';
import {ingredientsListData} from '../content/ingredients';

interface IngredientsTableProps {
  className?: string;
}

export const IngredientsTable = ({className}: IngredientsTableProps) => {
  const {isMobile, isLoading} = useIsMobile();
  const [ingredientsList, setIngredientsList] = useState(ingredientsListData);

  useEffect(() => {
    if (!isLoading && isMobile) {
      setIngredientsList(ingredientsListData.slice(0, 3));
    } else {
      setIngredientsList(ingredientsListData);
    }
  }, [isLoading, isMobile]);

  return (
    <div id="list-wrapper" className={cn(styles['ingredients-table-wrapper'], className)}>
      <div className={styles['grid']}>
        {ingredientsList.map((item, index) => {
          const key = `${index}-${item.name}`;
          return [
            <div key={`${index}-${item.name}`} className={styles[`item-${index + 1}`]}>
              <p className={styles['ingredient']}>{item.caption}</p>
              <p className={styles['caption']}>up to</p>
              <p className={styles['amount']}>{item.name}</p>
            </div>,
            index < ingredientsList.length - 1 && <div key={`divider-${key}`} className={styles['divider']} />,
          ];
        })}
      </div>
    </div>

    // <div
    //   className={`border-milk-yellow bg-milk flex min-w-fit flex-row gap-[5vw] rounded-full border-10 px-[5vw] py-10 max-md:scale-75 max-sm:scale-60 max-sm:px-10 ${className}`}
    // >
    //   {ingredientsData.map((item, index) => {
    //     const key = `${index}-${item.name}`;
    //     return [
    //       <div key={key} className="flex min-h-24 min-w-fit flex-1 flex-col items-center justify-center text-center">
    //         <span className="font-paragraph text-[clamp(1.2rem,1.2vw)]">{item.name}</span>
    //         <span className="text-lighter-dark-brown text-3xl font-bold">{item.concentration}</span>
    //       </div>,
    //       index < ingredientsData.length - 1 && (
    //         <div key={`divider-${key}`} className="border-mid-brown h-24 w-0 border-l"></div>
    //       ),
    //     ];
    //   })}
    // </div>
  );
};
