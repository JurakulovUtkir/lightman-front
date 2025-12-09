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
  { value: 'pending', label: t.paymentStatusOprions.pending },
  { value: 'paid', label: t.paymentStatusOprions.paid },
  { value: 'cancelled', label: t.paymentStatusOprions.cancelled },
  { value: 'unpaid', label: t.paymentStatusOprions.unpaid },
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
  { value: 'salary', label: t.expenceTypeOptions.salary },
  { value: 'avans', label: t.expenceTypeOptions.avans },
  { value: 'project', label: t.expenceTypeOptions.project },
  { value: 'deposit', label: t.expenceTypeOptions.deposit },
  { value: 'transfer', label: t.expenceTypeOptions.transfer },
  { value: 'other', label: t.expenceTypeOptions.other },
]

export const getExpenceOriginTypeOptions = (
  t: (typeof import('@/translations/general.json'))['en']['columns']
) => [
  { value: 'expence', label: t.expenceOriginTypeOptions.expence },
  { value: 'income', label: t.expenceOriginTypeOptions.income },
  { value: 'deposit', label: t.expenceOriginTypeOptions.deposit },
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

export enum PriceType {
  STANDARD = 'standard',
  VIP = 'vip',
  NO_WATERMARK = 'no_watermark',
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  CANCELLED = 'cancelled',
  UNPAID = 'unpaid',
}

export enum ProjectStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  ON_HOLD = 'on_hold',
  APPROVED = 'approved',
  REQUESTED = 'requested',
  DONE = 'done',
  CANCELED = 'canceled',
}
export enum UserRoles {
  ADMIN = 'admin',
  USER = 'user',
  OPERATOR = 'operator',
  EMPLOYEE = 'employee',
  ACCOUNTANT = 'accountant',
  ACCOUNT_MANAGER = 'account_manager',
}
