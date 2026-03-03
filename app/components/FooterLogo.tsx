import {cn} from '~/utils/cn';
import styles from './FooterLogo.module.css';
import {LogoStackedBubbles} from './LogoStackedBubbles';

export function FooterLogo() {
  return (
    <>
      <div className="flex items-center justify-center">
        <LogoStackedBubbles className={styles.logo} />
        <div className={cn(styles.logoFoam, styles.lf1)}></div>
        <div className={cn(styles.logoFoam, styles.lf2)}></div>
        <div className={cn(styles.logoFoam, styles.lf3)}></div>
        <div className={cn(styles.logoFoam, styles.lf4)}></div>
        <div className={cn(styles.logoFoam, styles.lf5)}></div>
      </div>

      <div className={styles['bathtub-body']}>
        <div className={styles['bathtub-hand']}>
          <div className={cn(styles.foam, styles.f1)}></div>
          <div className={cn(styles.foam, styles.f2)}></div>
          <div className={cn(styles.foam, styles.f3)}></div>
          <div className={cn(styles.foam, styles.f4)}></div>
          <div className={cn(styles.foam, styles.f5)}></div>
          <div className={cn(styles.foam, styles.f6)}></div>
          <div className={cn(styles.foam, styles.f7)}></div>
          <div className={cn(styles.foam, styles.f8)}></div>
          <div className={cn(styles.foam, styles.f9)}></div>
          <div className={cn(styles.foam, styles.f10)}></div>
          <div className={cn(styles.foam, styles.f11)}></div>
          <div className={cn(styles.foam, styles.f12)}></div>
          <div className={cn(styles.foam, styles.f13)}></div>
          <div className={cn(styles.foam, styles.f14)}></div>
        </div>
      </div>
    </>
  );
}
