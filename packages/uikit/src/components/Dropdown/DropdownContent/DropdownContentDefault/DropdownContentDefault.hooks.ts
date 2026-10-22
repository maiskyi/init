import {
  type CSSProperties,
  useCallback,
  useContext,
  useLayoutEffect,
  useState,
} from 'react';

import { DropdownContext } from '../../Dropdown.context';
import { type DropdownPlacement } from '../../Dropdown.types';

interface UseDropdownContentPositionProps {
  placement: DropdownPlacement;
}

interface UseDropdownContentPositionReturnType {
  left: number;
  top: number;
  visibility: CSSProperties['visibility'];
  width: number;
}

export const useDropdownContentPosition = ({
  placement,
}: UseDropdownContentPositionProps): UseDropdownContentPositionReturnType => {
  const { contentRef, isOpen, toggleRef } = useContext(DropdownContext);

  const [position, setPosition] = useState({
    left: 0,
    ready: false,
    top: 0,
    width: 0,
  });

  const updatePosition = useCallback(() => {
    const toggle = toggleRef.current;
    const content = contentRef.current;

    if (!toggle || !content) {
      return;
    }

    const toggleRect = toggle.getBoundingClientRect();
    const contentRect = content.getBoundingClientRect();

    const width = toggleRect.width;

    let top = 0;
    let left = 0;

    switch (placement) {
      case 'bottom-center':
        top = toggleRect.bottom;
        left = toggleRect.left + (toggleRect.width - contentRect.width) / 2;
        break;

      case 'bottom-left':
        top = toggleRect.bottom;
        left = toggleRect.left;
        break;

      case 'bottom-right':
        top = toggleRect.bottom;
        left = toggleRect.right - contentRect.width;
        break;

      case 'right-bottom':
        top = toggleRect.bottom - contentRect.height;
        left = toggleRect.right;
        break;

      case 'right-center':
        top = toggleRect.top + (toggleRect.height - contentRect.height) / 2;
        left = toggleRect.right;
        break;

      case 'top-center':
        top = toggleRect.top - contentRect.height;
        left = toggleRect.left + (toggleRect.width - contentRect.width) / 2;
        break;

      case 'top-left':
        top = toggleRect.top - contentRect.height;
        left = toggleRect.left;
        break;

      case 'top-right':
        top = toggleRect.top - contentRect.height;
        left = toggleRect.right - contentRect.width;
        break;
    }

    const viewportPadding = 8;

    left = Math.max(
      viewportPadding,
      Math.min(left, window.innerWidth - contentRect.width - viewportPadding),
    );

    setPosition({
      left,
      ready: true,
      top,
      width,
    });
  }, [placement, toggleRef.current, contentRef.current]);

  useLayoutEffect(() => {
    if (!isOpen) {
      setPosition((current) => ({
        ...current,
        ready: false,
      }));

      return;
    }

    updatePosition();

    const resizeObserver = new ResizeObserver(updatePosition);

    if (toggleRef.current) {
      resizeObserver.observe(toggleRef.current);
    }

    if (contentRef.current) {
      resizeObserver.observe(contentRef.current);
    }

    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [isOpen, updatePosition, contentRef.current, toggleRef.current]);

  return {
    left: position.left,
    top: position.top,
    visibility: position.ready ? 'visible' : 'hidden',
    width: position.width,
  };
};
