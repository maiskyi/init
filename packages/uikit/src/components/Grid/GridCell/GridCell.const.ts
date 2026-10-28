import { BREAKPOINTS } from '../../../constants/breakpoints.const';
import { type BreakpointToken } from '../../../types/breakpointToken.types';

// Ascending by width; the CSS cascade is defined by Grid.module.scss, this
// order only keeps generated class lists readable.
export const GRID_CELL_BREAKPOINTS = (
  Object.keys(BREAKPOINTS) as BreakpointToken[]
).sort((a, b) => BREAKPOINTS[a] - BREAKPOINTS[b]);
