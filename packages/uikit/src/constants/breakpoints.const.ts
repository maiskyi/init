import { type BreakpointToken } from '../types/breakpointToken.types';

export const BREAKPOINTS: Record<BreakpointToken, number> = {
  ld: 1250,
  ld_max: 1360,
  ld_xl: 1480,
  ld_xxl: 1604,
  ld_xxxl: 1800,
  md: 1025,
  md_max: 960,
  sm: 768,
  sm_max: 640,
  xs: 480,
  xss: 374,
} as const;
