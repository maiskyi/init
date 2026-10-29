import { type FC, Fragment, type PropsWithChildren } from 'react';

type ApiProviderProps = PropsWithChildren<{
  apiBaseUrl: string;
}>;

const ApiProvider: FC<ApiProviderProps> = ({ children }) => {
  return <Fragment>{children}</Fragment>;
};

export type { ApiProviderProps };
export { ApiProvider };
