export enum UserRoles {
  ADMIN = 'admin',
  USER = 'user',
  OPERATOR = 'operator',
  EMPLOYEE = 'employee',
  ACCOUNTANT = 'accountant',
  ACCOUNT_MANAGER = 'account_manager',
}

export enum PriceType {
  STANDARD = 'standard',
  VIP = 'vip',
  NO_WATERMARK = 'no_watermark',
}

export enum PaymentStatus {
  PLANNED = 'PLANNED', // Rejalashtirilgan
  PENDING = 'PENDING', // Jarayonda / tasdiqlanmagan
  PAID = 'PAID', // To‘langan
  PARTIAL = 'PARTIAL', // Qisman
  CANCELLED = 'CANCELLED', // Bekor qilingan
  OVERDUE = 'OVERDUE', // Muddat o‘tgan
}
export enum PaymentType {
  CASH = 'CASH', // Naqd pul
  CARD = 'CARD', // Karta orqali (terminal/online)
  BANK_TRANSFER = 'BANK_TRANSFER', // Bank o‘tkazma
  DEPOSIT = 'DEPOSIT', // Oldindan o‘tkazilgan depozitdan yechildi
}

export enum ProjectStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  ON_HOLD = 'on_hold',
  APPROVED = 'approved',
  REQUESTED = 'requested',
  DONE = 'done',
  CANCELED = 'canceled',
  REQUESTED_TO_DONE = 'requested_to_done',
}

export enum ProjectSocialStatusType {
  POSTED = 'posted',
  DELETED = 'deleted',
  PENDING = 'pending',
  RISKED = 'risked',
}
export enum CorporateExpenceType {
  EXPENCE = 'EXPENCE',
  INCOME = 'INCOME',
  // DEPOSIT = 'DEPOSIT', kommentga olindi chunki depozit ham alohida xarajat turi emas, shunchaki chiqimni oldindan to'lash usuli
  TRANSFER = 'TRANSFER',
}
export enum ExpenceType {
  CHANNEL_POST = 'CHANNEL_POST', // Kanalga post uchun to‘lov
  CHANNEL_DEPOSIT_TOPUP = 'CHANNEL_DEPOSIT_TOPUP', // Kanalga depozit o‘tkazish
  CHANNEL_POST_FROM_DEPOSIT = 'CHANNEL_POST_FROM_DEPOSIT', // Post puli depozitdan yechildi

  SALARY = 'SALARY', // Oylik
  SALARY_ADVANCE = 'SALARY_ADVANCE', // Avans
  BONUS = 'BONUS', // Bonus, mukofot (ixtiyoriy)

  LOAN_GIVEN = 'LOAN_GIVEN', // Boshqalarga qarz berdik
  LOAN_TAKEN = 'LOAN_TAKEN', // Boshqalardan qarz oldik
  LOAN_REPAYMENT = 'LOAN_REPAYMENT', // Qarz qaytarish / qaytarib olish

  COMPANY_TRANSFER = 'COMPANY_TRANSFER', // Kompaniya→kompaniya ichki o‘tkazma
  CARD_WITHDRAW = 'CARD_WITHDRAW', // Hisobdan kartaga yechish
  CASH_WITHDRAW = 'CASH_WITHDRAW', // Bankdan naqd/kassaga olish

  SERVICE_EXPENCE = 'SERVICE_EXPENCE', // Proekt xizmat/xarajatlari (dizayn, reklama va b.)
  CLIENT_PAYMENT = 'CLIENT_PAYMENT', // Mijoz/tashkilotdan tushum
  FOUNDER_INPUT = 'FOUNDER_INPUT', // Founder kompaniyaga pul kiritdi

  OTHER = 'OTHER', // Boshqa holatlar
}

export enum PropertyStatus {
  IN_USE = 'IN_USE', // ishlatilayapti
  IN_STOCK = 'IN_STOCK', // sklad / omborda
  REPAIRED = 'REPAIRED', // remontda
  WRITTEN_OFF = 'WRITTEN_OFF', // hisobdan chiqarilgan
  SOLD = 'SOLD', // sotilgan
  LOST = 'LOST', // yo'qolgan
}

export enum PropertyCategory {
  BUILDING = 'BUILDING', // bino, inshoot
  VEHICLE = 'VEHICLE', // mashina, texnika
  EQUIPMENT = 'EQUIPMENT', // uskunalar (kompyuter, printer, stanok)
  FURNITURE = 'FURNITURE', // mebel
  ELECTRONICS = 'ELECTRONICS', // elektronika
  OTHER = 'OTHER', // boshqa
}
