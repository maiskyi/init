import {
  type ComponentPropsWithoutRef,
  type ComponentType,
  type ElementType,
} from 'react';

export type PolymorphicElement = ComponentType | ElementType;

export type PolymorphicProps<
  C extends PolymorphicElement,
  OwnProps = object,
> = Omit<ComponentPropsWithoutRef<C>, 'as' | keyof OwnProps> &
  OwnProps & {
    as?: C;
  };
