import { useEffect, useState } from 'react';
import { useMediaQuery as useMediaQueryReact } from 'react-responsive';

import { BREAKPOINTS } from '../../constants/breakpoints.const';
import { type BreakpointToken } from '../../types/breakpointToken.types';

interface UseBreakpointParams {
  token: BreakpointToken;
}

export const useBreakpoint = ({ token }: UseBreakpointParams) => {
  const matches = useMediaQueryReact({
    minWidth: BREAKPOINTS[token],
  });

  const [isClient, setIsClient] = useState<boolean>(
    typeof window !== 'undefined',
  );

  useEffect(() => {
    if (!isClient) setIsClient(true);
  }, [isClient]);

  return { matches };
};
