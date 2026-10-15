import { type FC, Fragment, type PropsWithChildren } from "react";

import "./ThemeProvider.scss";

const ThemeProvider: FC<PropsWithChildren> = ({ children }) => {
  return <Fragment>{children}</Fragment>;
};

export { ThemeProvider };
