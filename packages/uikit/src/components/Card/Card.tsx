import { type FC, type PropsWithChildren } from 'react';

export type CardProps = PropsWithChildren<{
  className?: string;
}>;

export const Card: FC<CardProps> = ({ className, children }) => {
  return <div className={className}>{children}</div>;
};
