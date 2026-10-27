import { type FC, type PropsWithChildren } from 'react';

export type WalletProviderProps = PropsWithChildren<{
  children: React.ReactNode;
}>;

export const WalletProvider: FC<WalletProviderProps> = ({ children }) => {
  return <div>WalletProvider</div>;
};
