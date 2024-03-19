type Validation = {
  message: string
  value: any
}

export const invalidField = 'Invalid field'

export const requiredField: Validation = {
  message: 'Required field',
  value: true,
}

export const fullNamePattern: Validation = {
  message: 'Invalid name',
  value: /^[a-zA-ZéáàâãéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ]{4,}(?: [a-zA-ZéáàâãéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ]+){0,2}$/,
}

export const emailPattern: Validation = {
  message: invalidField,
  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
}

export const passwordPattern: Validation = {
  message: 'Uppercase, lowercase, number and special characters',
  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$&*])(?=.*\d)[a-zA-Z\d\w\W]{8,}$/,
}

export const minLength = (quantity: number): Validation => ({
  message: `Min of ${quantity} characters`,
  value: quantity,
})

export const maxLength = (quantity: number): Validation => ({
  message: `Max de ${quantity} characters`,
  value: quantity,
})

export const minArrayLength = (quantity: number): Validation => ({
  message: `Select min of ${quantity}`,
  value: quantity,
})

export const minNumber = (quantity: number): Validation => ({
  message: `Min of ${quantity}`,
  value: quantity,
})

export const maxNumber = (quantity: number): Validation => ({
  message: `Max of ${quantity}`,
  value: quantity,
})

export const phoneValidation = (value?: string) => {
  if (!value) return requiredField.message
  const onlyNumbers = value.replace(/[^\d]/g, '').replace(/[^0-9]+/g, '')
  if (onlyNumbers.length < 10) return invalidField
  return undefined
}

export const zipCodeValidation = (value?: string) => {
  if (!value) return requiredField.message
  const onlyNumbers = value.replace(/[^\d]/g, '').replace(/[^0-9]+/g, '')
  if (onlyNumbers.length < 8) return invalidField
  return undefined
}

export const enumValidation = (enumOptions: string[], value?: string | string[], minSize?: number) => {
  if (!Array.isArray(value) && !value) return requiredField.message
  if (Array.isArray(value)) {
    if (minSize && value.length < minSize) return `Min of ${minSize}`
    if (value.some((x) => !enumOptions.includes(x))) return invalidField
  } else if (!enumOptions.includes(value)) return invalidField
  return undefined
}

export const domainValidation = (domain: string) => {
  if (domain.includes('https') || domain.includes('http')) return 'Protocol is not necessary'
  if (domain.includes('www')) return 'Subdomain www is not necessary'
  return undefined
}
