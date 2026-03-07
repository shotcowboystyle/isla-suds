import {cn} from '~/utils/cn';
import styles from './SimpleCard.module.css';

interface SimpleCardProps {
  number: string;
  title: string;
  description: React.ReactNode;
  icon: React.ReactNode;
  className?: string;
}

export function SimpleCard({number, title, description, icon, className}: SimpleCardProps) {
  return (
    <div className={cn(styles['brand-core-card'], className)}>
      <div className={styles['title-wrapper']}>
        <div className={styles['title-number']}>{number}</div>
        <h3 className={styles['title-text']}>{title}</h3>
      </div>
      <div className={styles['icon-wrapper']}>{icon}</div>
      <p className={styles['paragraph']}>{description}</p>
    </div>
  );
}
