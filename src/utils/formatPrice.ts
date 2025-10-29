export function formatPrice(
  price: string | number | undefined,
  decimals = 2
): string {
  // Handle invalid inputs
  if (price === null || price === undefined || price === '') {
    return '0.00'
  }

  // Convert to number and round using your logic
  const numPrice = Number(price)
  if (isNaN(numPrice)) {
    return '0.00'
  }

  // Apply your round function logic
  const roundedPrice = numPrice.toFixed(decimals)

  // Split into integer and decimal parts
  const [integerPart, decimalPart] = roundedPrice.split('.')

  // Add spaces every 3 digits from right to left
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')

  // Check if decimal part is all zeros
  const hasDecimals = decimalPart && decimalPart !== '0'.repeat(decimals)

  // Only include decimals if they're not all zeros
  return hasDecimals ? `${formattedInteger}.${decimalPart}` : formattedInteger
}
