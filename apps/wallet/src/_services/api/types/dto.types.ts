import { type COMMON_DATA } from '../constants/commonData.const';
import { type COMMON_USER_DATA } from '../constants/commonUserData.const';

export type Currency = (typeof COMMON_DATA.currencies)[number];

export type UserBalances = Partial<typeof COMMON_USER_DATA.userBalances>;
