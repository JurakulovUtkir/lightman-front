// import { CorporateExpenceType, ExpenceType } from './enums'

// // Update the getExpenceTypeOptions function to accept an optional filter parameter
// export const getExpenceTypeOptions = (
//   t: (typeof import('@/translations/general.json'))['en']['columns'],
//   filterByType?: CorporateExpenceType
// ) => {
//   const allOptions = [
//     {
//       value: ExpenceType.CHANNEL_POST,
//       label: t.expenceTypeOptions.CHANNEL_POST,
//     },
//     {
//       value: ExpenceType.CHANNEL_DEPOSIT_TOPUP,
//       label: t.expenceTypeOptions.CHANNEL_DEPOSIT_TOPUP,
//     },
//     {
//       value: ExpenceType.CHANNEL_POST_FROM_DEPOSIT,
//       label: t.expenceTypeOptions.CHANNEL_POST_FROM_DEPOSIT,
//     },
//     { value: ExpenceType.SALARY, label: t.expenceTypeOptions.SALARY },
//     {
//       value: ExpenceType.SALARY_ADVANCE,
//       label: t.expenceTypeOptions.SALARY_ADVANCE,
//     },
//     { value: ExpenceType.BONUS, label: t.expenceTypeOptions.BONUS },
//     { value: ExpenceType.LOAN_GIVEN, label: t.expenceTypeOptions.LOAN_GIVEN },
//     { value: ExpenceType.LOAN_TAKEN, label: t.expenceTypeOptions.LOAN_TAKEN },
//     {
//       value: ExpenceType.LOAN_REPAYMENT,
//       label: t.expenceTypeOptions.LOAN_REPAYMENT,
//     },
//     {
//       value: ExpenceType.COMPANY_TRANSFER,
//       label: t.expenceTypeOptions.COMPANY_TRANSFER,
//     },
//     {
//       value: ExpenceType.CARD_WITHDRAW,
//       label: t.expenceTypeOptions.CARD_WITHDRAW,
//     },
//     {
//       value: ExpenceType.CASH_WITHDRAW,
//       label: t.expenceTypeOptions.CASH_WITHDRAW,
//     },
//     {
//       value: ExpenceType.SERVICE_EXPENCE,
//       label: t.expenceTypeOptions.SERVICE_EXPENCE,
//     },
//     {
//       value: ExpenceType.CLIENT_PAYMENT,
//       label: t.expenceTypeOptions.CLIENT_PAYMENT,
//     },
//     {
//       value: ExpenceType.FOUNDER_INPUT,
//       label: t.expenceTypeOptions.FOUNDER_INPUT,
//     },
//     { value: ExpenceType.OTHER, label: t.expenceTypeOptions.OTHER },
//   ]

//   // If filterByType is TRANSFER, only show COMPANY_TRANSFER and CARD_WITHDRAW
//   if (filterByType === CorporateExpenceType.TRANSFER) {
//     return allOptions.filter(
//       (option) =>
//         option.value === ExpenceType.COMPANY_TRANSFER ||
//         option.value === ExpenceType.CARD_WITHDRAW
//     )
//   }

//   // Return all options for other types or when no filter is applied
//   return allOptions
// }
