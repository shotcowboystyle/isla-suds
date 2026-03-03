import {useEffect, useRef, useCallback} from 'react';
import {noop} from '~/utils/noop';
import type {MutableRefObject} from 'react';

/**
 * useClickOutside hook
 * Checks if a click happened outside a Ref. Handy for dropdowns, modals and popups etc.
 *
 * @param ref Ref whose outside click needs to be listened to
 * @param handler Callback to fire on outside click
 * @param when A boolean which which activates the hook only when it is true. Useful for conditionally enable the outside click
 * @see https://rooks.vercel.app/docs/hooks/useClickOutside
 * @example
 * ```tsx
 * import { useClickOutside } from "~/hooks/use-click-outside";
 * import { useRef } from "react";
 * import { noop } from "~/utils/noop";
 *
 * const MyComponent = () => {
 *  const ref = useRef<HTMLDivElement>(null);
 *  const [isOpen, setIsOpen] = useState(false);
 *    const handleOutsideClick = () => setIsOpen(false);
 *  useClickOutside(ref, handleOutsideClick);
 *  return (
 *   <div ref={ref}>
 *    <button onClick={() => setIsOpen(true)}>Open</button>
 *   {isOpen && (
 *   <div>Inside</div>
 *   )}
 * </div>
 * );
 * }
 * ```
 */
function useClickOutside(
  ref: MutableRefObject<HTMLElement | null>,
  handler: (event: MouseEvent | TouchEvent) => void,
  when = true,
): void {
  const savedHandler = useRef<(event: MouseEvent | TouchEvent) => void>(handler);

  const memoizedCallback = useCallback(
    (event: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(event.target as Element)) {
        savedHandler.current(event);
      }
    },
    [ref],
  );

  useEffect(() => {
    savedHandler.current = handler;
  });

  useEffect(() => {
    if (when) {
      document.addEventListener('click', memoizedCallback, true);
      document.addEventListener('touchstart', memoizedCallback, true);

      return () => {
        document.removeEventListener('click', memoizedCallback, true);
        document.removeEventListener('touchstart', memoizedCallback, true);
      };
    }

    return noop;
  }, [ref, handler, when, memoizedCallback]);
}

export {useClickOutside};
