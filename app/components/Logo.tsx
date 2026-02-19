import logo from '~/assets/images/isla-suds-logo-stacked-stroked.svg';

interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
}

export function Logo({width, height, className = ''}: LogoProps) {
  return <img src={logo} alt="Isla Suds" width={width || 168} height={height || 125} className={className} />;
}
