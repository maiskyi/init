import { type FC, Fragment, type PropsWithChildren } from 'react';

export type WalletProviderProps = PropsWithChildren<{
  children: React.ReactNode;
}>;

export const WalletProvider: FC<WalletProviderProps> = ({ children }) => {
  return <Fragment>{children}</Fragment>;
};
