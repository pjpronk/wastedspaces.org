// Validation rule type
export type ValidationRule = (value: string) => string | null

// Common validation rules
export const validationRules = {
  required:
    (fieldName: string = "Dit veld"): ValidationRule =>
    (value: string) => {
      if (!value || (typeof value === "string" && value.trim() === "")) {
        return `${fieldName} is verplicht`
      }
      return null
    },

  minLength:
    (min: number, fieldName: string = "Dit veld"): ValidationRule =>
    (value: string) => {
      if (value && value.length < min) {
        return `${fieldName} moet minimaal ${min} karakters bevatten`
      }
      return null
    },

  maxLength:
    (max: number, fieldName: string = "Dit veld"): ValidationRule =>
    (value: string) => {
      if (value && value.length > max) {
        return `${fieldName} mag maximaal ${max} karakters bevatten`
      }
      return null
    },

  email:
    (fieldName: string = "E-mailadres"): ValidationRule =>
    (value: string) => {
      if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return `${fieldName} is niet geldig`
      }
      return null
    },

  dateNotInFuture:
    (fieldName: string = "Datum"): ValidationRule =>
    (value: string) => {
      if (value) {
        const inputDate = new Date(value + "-01")
        const now = new Date()
        const currentMonth = new Date(now.getFullYear(), now.getMonth())
        if (inputDate > currentMonth) {
          return `${fieldName} kan niet in de toekomst liggen`
        }
      }
      return null
    },

  dateRequired:
    (fieldName: string = "Datum"): ValidationRule =>
    (value: string) => {
      if (!value) {
        return `${fieldName} is verplicht`
      }
      return null
    },

  selectRequired:
    (fieldName: string = "Selectie"): ValidationRule =>
    (value: string) => {
      if (!value || value === "") {
        return `${fieldName} is verplicht`
      }
      return null
    }
}

// Utility function to combine multiple validation rules
export const combineRules = (...rules: ValidationRule[]): ValidationRule[] =>
  rules

// Utility function to validate a form with multiple fields
export const validateForm = (
  fields: { value: string; rules: ValidationRule[] }[]
): boolean => {
  let isValid = true

  for (const field of fields) {
    for (const rule of field.rules) {
      const error = rule(field.value)
      if (error) {
        isValid = false
        break
      }
    }
  }

  return isValid
}
