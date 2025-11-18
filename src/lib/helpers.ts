export const toNumber = (
  value: string | number | undefined
): number | undefined => {
  if (value === undefined || value === null) return undefined
  return typeof value === 'string' ? parseFloat(value) : value
}
