import { type BreakpointToken } from '../../../types/breakpointToken.types';

export type GridCellSpan =
  | 0.5
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 'hidden';

export type GridCellBreakpointProps = Partial<
  Record<BreakpointToken, GridCellSpan>
>;
