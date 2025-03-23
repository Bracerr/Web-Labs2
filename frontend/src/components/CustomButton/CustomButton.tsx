import { FC, ButtonHTMLAttributes } from 'react';
import styles from './CustomButton.module.scss';
import classNames from 'classnames';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

export const CustomButton: FC<ButtonProps> = ({
  children,
  variant = 'primary',
  className,
  ...props
}) => {
  return (
    <button className={classNames(styles.button, styles[variant], className)} {...props}>
      {children}
    </button>
  );
};
