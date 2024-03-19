export const formatToSlug = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .replaceAll(' ', '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .trim()
}

export const formatCurrency = (amountInCents: number) => {
  return new Intl.NumberFormat('en-US', { currency: 'USD', style: 'currency', minimumFractionDigits: 2 }).format(
    Number(amountInCents / 100),
  )
}

export const formatNumberWithDots = (value: number) => {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}
