import { type FC, type PropsWithChildren } from 'react';
// @ts-expect-error No declaration file found for module 'react-outside-click-handler/esm/OutsideClickHandler'.
import ReactOutsideClickHandler from 'react-outside-click-handler/esm/OutsideClickHandler';

type OutsideClickHandlerProps = PropsWithChildren<{
  onOutsideClick: () => void;
}>;

const OutsideClickHandler: FC<OutsideClickHandlerProps> = ({
  children,
  onOutsideClick,
}) => {
  return (
    <ReactOutsideClickHandler onOutsideClick={onOutsideClick}>
      {children}
    </ReactOutsideClickHandler>
  );
};

export type { OutsideClickHandlerProps };
export { OutsideClickHandler };
