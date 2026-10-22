import { ErrorMessage } from '@hookform/error-message';
import { type FC, Fragment, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { type FieldErrors, type FieldValues } from 'react-hook-form';

import { useIsomorphicLayoutEffect } from '../../../hooks/useIsomorphicLayoutEffect';
import { FormHint } from '../FormHint';

import styles from '../Form.module.scss';

interface FormErrorProps {
  errors: FieldErrors<FieldValues>;
  name: string;
}

const FormError: FC<FormErrorProps> = ({ errors, name }) => {
  const anchorRef = useRef<HTMLDivElement>(null);
  const [container, setContainer] = useState<HTMLElement | null>(null);

  useIsomorphicLayoutEffect(() => {
    const parent = anchorRef.current?.parentElement;

    if (!parent?.classList.contains(`${styles['input-group']}`)) return;

    const next = document.createElement('div');
    next.style.display = 'contents';
    parent.after(next);
    setContainer(next);

    return () => {
      next.remove();
    };
  }, []);

  const content = (
    <ErrorMessage
      errors={errors}
      name={name}
      render={({ message }) => {
        return <FormHint invalid>{message}</FormHint>;
      }}
    />
  );

  return (
    <Fragment>
      <div hidden ref={anchorRef} />
      {container ? createPortal(content, container) : content}
    </Fragment>
  );
};

export { FormError };
