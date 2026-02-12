import {useEffect, useState} from 'react';
import {useIsMobile} from '~/hooks/use-is-mobile';
import {ingredientsListData} from '../content/ingredients';

interface IngredientsTableProps {
  className?: string;
}

const paragraphClasses = 'text-[#865720]';

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
    <div
      id="list-wrapper"
      className={`bg-[#fdebd2] rounded-full border-[.5vw] border-[#e8ddca] mx-auto max-w-7xl md:py-8 py-5 md:px-0 px-5 flex justify-between items-center ${className}`}
    >
      {ingredientsList.map((item, index) => {
        const key = `${index}-${item.name}`;
        return [
          <div key={`${index}-${item.name}`} className="relative flex-1 col-center">
            <div>
              <p className={`${paragraphClasses} md:text-lg font-paragraph`}>{item.caption}</p>
              <p className={`${paragraphClasses} font-paragraph text-sm mt-2`}>up to</p>
              <p className={`${paragraphClasses} text-2xl md:text-4xl tracking-tighter font-bold`}>{item.name}</p>
            </div>
          </div>,
          index < ingredientsList.length - 1 && (
            <div
              key={`divider-${key}`}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 md:h-24 h-16 w-px bg-[#C89C6E]"
            />
          ),
        ];
      })}
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
