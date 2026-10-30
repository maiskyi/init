import { type CASHIER_INFO_DATA } from '../constants/cashierInfoData.const';
import { type COMMON_DATA } from '../constants/commonData.const';
import { type COMMON_USER_DATA } from '../constants/commonUserData.const';

export type Currency = (typeof COMMON_DATA.currencies)[number];

export type UserBalances = Partial<typeof COMMON_USER_DATA.userBalances>;

export type PaymentMethod =
  (typeof CASHIER_INFO_DATA.deposit.availableMethods)[number];
