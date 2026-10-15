import { type FC, Fragment, type PropsWithChildren } from "react";
import "./ThemeProvider.scss";

export const ThemeProvider: FC<PropsWithChildren> = ({ children }) => {
  return <Fragment>{children}</Fragment>;
};
