import styles from './ClippedTextBox.module.css';
import {cn} from '../utils/cn';

interface ClippedTextBoxProps {
  text: string;
  textColor?: 'black' | 'milk' | 'transparent';
  bgColor?: string;
  initiallyClosed?: boolean;
  className?: string;
  id?: string;
  index: number;
}

export const ClippedTextBox = ({text, initiallyClosed = true, className = '', id = '', index}: ClippedTextBoxProps) => {
  return (
    <div data-animation-id={id} className={className}>
      <div id={id} className={cn(styles['heading'], styles[`heading-${index}`])}>
        <span className={styles['heading-text']}>{text}</span>
      </div>
    </div>
  );
};
