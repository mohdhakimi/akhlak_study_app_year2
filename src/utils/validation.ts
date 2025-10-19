/**
 * =============================================================================
 * VALIDATION UTILITIES
 * =============================================================================
 * Utility functions for form validation and data validation.
 */

export interface ValidationRule<T = any> {
  required?: boolean
  minLength?: number
  maxLength?: number
  min?: number
  max?: number
  pattern?: RegExp
  custom?: (value: T) => string | null
}

export interface ValidationResult {
  isValid: boolean
  errors: Record<string, string>
}

/**
 * Validates a single value against a set of rules
 */
export const validateValue = <T>(
  value: T,
  rules: ValidationRule<T>,
  fieldName: string
): string | null => {
  // Required validation
  if (rules.required && (value === null || value === undefined || value === '')) {
    return `${fieldName} is required`
  }

  // Skip other validations if value is empty and not required
  if (!rules.required && (value === null || value === undefined || value === '')) {
    return null
  }

  // String length validations
  if (typeof value === 'string') {
    if (rules.minLength && value.length < rules.minLength) {
      return `${fieldName} must be at least ${rules.minLength} characters`
    }
    if (rules.maxLength && value.length > rules.maxLength) {
      return `${fieldName} must be no more than ${rules.maxLength} characters`
    }
    if (rules.pattern && !rules.pattern.test(value)) {
      return `${fieldName} format is invalid`
    }
  }

  // Number validations
  if (typeof value === 'number') {
    if (rules.min !== undefined && value < rules.min) {
      return `${fieldName} must be at least ${rules.min}`
    }
    if (rules.max !== undefined && value > rules.max) {
      return `${fieldName} must be no more than ${rules.max}`
    }
  }

  // Custom validation
  if (rules.custom) {
    return rules.custom(value)
  }

  return null
}

/**
 * Validates an object against a schema
 */
export const validateObject = <T extends Record<string, any>>(
  data: T,
  schema: Record<keyof T, ValidationRule<T[keyof T]>>
): ValidationResult => {
  const errors: Record<string, string> = {}

  Object.keys(schema).forEach((key) => {
    const fieldName = key as keyof T
    const rules = schema[fieldName]
    const value = data[fieldName]
    
    const error = validateValue(value, rules, String(fieldName))
    if (error) {
      errors[String(fieldName)] = error
    }
  })

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

/**
 * Common validation rules
 */
export const commonRules = {
  required: { required: true },
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  password: {
    required: true,
    minLength: 8,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/
  },
  phone: {
    pattern: /^[\+]?[1-9][\d]{0,15}$/
  },
  url: {
    pattern: /^https?:\/\/.+\..+/
  }
}
