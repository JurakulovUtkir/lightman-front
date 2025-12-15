import { CorporateExpenceType, ExpenceType } from './enums'

export enum AllowedLangs {
  UZ = 'uz',
  RU = 'ru',
  EN = 'en',
}
export const languages = [
  { label: 'English', value: 'en', disabled: false },
  { label: 'Russian', value: 'ru', disabled: false },
  { label: 'Uzbek', value: 'uz', disabled: false },
  { label: 'French', value: 'fr', disabled: true },
  { label: 'German', value: 'de', disabled: true },
  { label: 'Spanish', value: 'es', disabled: true },
  { label: 'Portuguese', value: 'pt', disabled: true },
  { label: 'Japanese', value: 'ja', disabled: true },
  { label: 'Korean', value: 'ko', disabled: true },
  { label: 'Chinese', value: 'zh', disabled: true },
] as const

export const ACCESS_TOKEN = 'access_token'
export const USER_DATA = 'user_data'

export const UZ_PHONE_REGEX = /^\+998\d{9}$/

export interface ApiResponse<T> {
  message: string
  statusCode: number
  data: T
  error: string | null
}

export const getstatusOptions = (
  t: (typeof import('@/translations/general.json'))['en']['columns']
) => [
  { value: 'draft', label: t.statusOptions.draft },
  { value: 'active', label: t.statusOptions.active },
  { value: 'on_hold', label: t.statusOptions.on_hold },
  { value: 'approved', label: t.statusOptions.approved },
  { value: 'requested', label: t.statusOptions.requested },
  { value: 'done', label: t.statusOptions.done },
  { value: 'canceled', label: t.statusOptions.canceled },
]

export const getPaymentStatusOptions = (
  t: (typeof import('@/translations/general.json'))['en']['columns']
) => [
  { value: 'pending', label: t.paymentStatusOprions.PENDING },
  { value: 'paid', label: t.paymentStatusOprions.PAID },
  { value: 'cancelled', label: t.paymentStatusOprions.CANCELLED },
  { value: 'unpaid', label: t.paymentStatusOprions.UNPAID },
]
export const getPriceTypeOptions = (
  t: (typeof import('@/translations/general.json'))['en']['columns']
) => [
  { value: 'standard', label: t.priceTypeOptions.standard },
  { value: 'vip', label: t.priceTypeOptions.vip },
  { value: 'no_watermark', label: t.priceTypeOptions.no_watermark },
]
export const getPaymentTypeOptions = (
  t: (typeof import('@/translations/general.json'))['en']['columns']
) => [
  { value: 'CARD', label: t.paymentTypeOptions.CARD },
  { value: 'BANK_TRANSFER', label: t.paymentTypeOptions.BANK_TRANSFER },
  { value: 'CASH', label: t.paymentTypeOptions.CASH },
  { value: 'DEPOSIT', label: t.paymentTypeOptions.DEPOSIT },
]
export const getExpenceTypeOptions = (
  t: (typeof import('@/translations/general.json'))['en']['columns']
) => [
  { value: ExpenceType.CHANNEL_POST, label: t.expenceTypeOptions.CHANNEL_POST },
  {
    value: ExpenceType.CHANNEL_DEPOSIT_TOPUP,
    label: t.expenceTypeOptions.CHANNEL_DEPOSIT_TOPUP,
  },
  {
    value: ExpenceType.CHANNEL_POST_FROM_DEPOSIT,
    label: t.expenceTypeOptions.CHANNEL_POST_FROM_DEPOSIT,
  },
  { value: ExpenceType.SALARY, label: t.expenceTypeOptions.SALARY },
  {
    value: ExpenceType.SALARY_ADVANCE,
    label: t.expenceTypeOptions.SALARY_ADVANCE,
  },
  { value: ExpenceType.BONUS, label: t.expenceTypeOptions.BONUS },
  { value: ExpenceType.LOAN_GIVEN, label: t.expenceTypeOptions.LOAN_GIVEN },
  { value: ExpenceType.LOAN_TAKEN, label: t.expenceTypeOptions.LOAN_TAKEN },
  {
    value: ExpenceType.LOAN_REPAYMENT,
    label: t.expenceTypeOptions.LOAN_REPAYMENT,
  },
  {
    value: ExpenceType.COMPANY_TRANSFER,
    label: t.expenceTypeOptions.COMPANY_TRANSFER,
  },
  {
    value: ExpenceType.CARD_WITHDRAW,
    label: t.expenceTypeOptions.CARD_WITHDRAW,
  },
  {
    value: ExpenceType.CASH_WITHDRAW,
    label: t.expenceTypeOptions.CASH_WITHDRAW,
  },
  {
    value: ExpenceType.SERVICE_EXPENCE,
    label: t.expenceTypeOptions.SERVICE_EXPENCE,
  },
  {
    value: ExpenceType.CLIENT_PAYMENT,
    label: t.expenceTypeOptions.CLIENT_PAYMENT,
  },
  {
    value: ExpenceType.FOUNDER_INPUT,
    label: t.expenceTypeOptions.FOUNDER_INPUT,
  },
  { value: ExpenceType.OTHER, label: t.expenceTypeOptions.OTHER },
]

export const getExpenceOriginTypeOptions = (
  t: (typeof import('@/translations/general.json'))['en']['columns']
) => [
  {
    value: CorporateExpenceType.EXPENCE,
    label: t.expenceOriginTypeOptions.EXPENCE,
  },
  {
    value: CorporateExpenceType.INCOME,
    label: t.expenceOriginTypeOptions.INCOME,
  },
  {
    value: CorporateExpenceType.TRANSFER,
    label: t.expenceOriginTypeOptions.TRANSFER,
  },
]
export const getUserRoleOptions = (
  t: (typeof import('@/translations/general.json'))['en']['columns']
) => [
  { value: 'admin', label: t.userRoleOptions.admin },
  { value: 'user', label: t.userRoleOptions.user },
  { value: 'operator', label: t.userRoleOptions.operator },
  { value: 'employee', label: t.userRoleOptions.employee },
  { value: 'accountant', label: t.userRoleOptions.accountant },
  { value: 'account_manager', label: t.userRoleOptions.account_manager },
]
export const getProjectSocialStatusOptions = (
  t: (typeof import('@/translations/general.json'))['en']['columns']
) => [
  { value: 'posted', label: t.projectSocial.posted },
  { value: 'deleted', label: t.projectSocial.deleted },
  { value: 'pending', label: t.projectSocial.pending },
  { value: 'risked', label: t.projectSocial.risked },
]
export const getDirectionOptions = (
  t: (typeof import('@/translations/general.json'))['en']['columns']
) => [
  { value: 'WE_GAVE', label: t.direction.WE_GAVE },
  { value: 'WE_TOOK', label: t.direction.WE_TOOK },
]
export const getPropertyStatusOptions = (
  t: (typeof import('@/translations/general.json'))['en']['columns']
) => [
  { value: 'IN_USE', label: t.propertyStatus.IN_USE },
  { value: 'IN_STOCK', label: t.propertyStatus.IN_STOCK },
  { value: 'REPAIRED', label: t.propertyStatus.REPAIRED },
  { value: 'WRITTEN_OFF', label: t.propertyStatus.WRITTEN_OFF },
  { value: 'SOLD', label: t.propertyStatus.SOLD },
  { value: 'LOST', label: t.propertyStatus.LOST },
]
export const getPropertyCategoryOptions = (
  t: (typeof import('@/translations/general.json'))['en']['columns']
) => [
  { value: 'BUILDING', label: t.propertyCategory.BUILDING },
  { value: 'VEHICLE', label: t.propertyCategory.VEHICLE },
  { value: 'EQUIPMENT', label: t.propertyCategory.EQUIPMENT },
  { value: 'FURNITURE', label: t.propertyCategory.FURNITURE },
  { value: 'ELECTRONICS', label: t.propertyCategory.ELECTRONICS },
  { value: 'OTHER', label: t.propertyCategory.OTHER },
]
export const getCardOptions = (
  t: (typeof import('@/translations/general.json'))['en']['columns']
) => [
  { value: 'card', label: t.cardType.card },
  { value: 'cash', label: t.cardType.cash },
]
