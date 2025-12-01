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

export const statusOptions = [
  { value: 'draft', label: 'Draft' },
  { value: 'active', label: 'Active' },
  { value: 'on_hold', label: 'On hold' },
  { value: 'approved', label: 'Approved' },
  { value: 'requested', label: 'Requested' },
  { value: 'done', label: 'Done' },
  { value: 'canceled', label: 'Canceled' },
]
export const paymentStatusOptions = [
  { value: 'pending', label: 'Pending' },
  { value: 'paid', label: 'Paid' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'unpaid', label: 'Unpaid' },
]
export const priceTypeOptions = [
  { value: 'standard', label: 'Standard' },
  { value: 'vip', label: 'VIP' },
  { value: 'no_watermark', label: 'No Watermark' },
]
export const paymentTypeOptions = [
  { value: 'card', label: 'Card' },
  { value: 'bank_transfer', label: 'Bank transfer' },
  { value: 'cash', label: 'Cash' },
  { value: 'deposit', label: 'Deposit' },
]
export const expenceTypeOptions = [
  { value: 'salary', label: 'Salary' },
  { value: 'avans', label: 'Avans' },
  { value: 'project', label: 'Project' },
  { value: 'deposit', label: 'Deposit' },
  { value: 'transfer', label: 'Transfer' },
  { value: 'other', label: 'Other' },
]
export const expenceOriginTypeOptions = [
  { value: 'expence', label: 'Expence' },
  { value: 'income', label: 'Income' },
  { value: 'deposit', label: 'Deposit' },
]
export const userRoleOptions = [
  { value: 'admin', label: 'Admin' },
  { value: 'user', label: 'User' },
  { value: 'operator', label: 'Operator' },
  { value: 'employee', label: 'Employee' },
  { value: 'accountant', label: 'Accountant' },
  { value: 'account_manager', label: 'Account manager' },
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
