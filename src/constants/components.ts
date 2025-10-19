/**
 * =============================================================================
 * COMPONENT CONSTANTS
 * =============================================================================
 * Constants used across various components.
 */

export const COMPONENT_SIZES = {
  sm: 'sm',
  md: 'md',
  lg: 'lg'
} as const

export const COMPONENT_VARIANTS = {
  primary: 'primary',
  secondary: 'secondary',
  success: 'success',
  warning: 'warning',
  danger: 'danger',
  info: 'info',
  default: 'default'
} as const

export const BUTTON_VARIANTS = {
  primary: 'primary',
  secondary: 'secondary',
  success: 'success',
  danger: 'danger',
  outline: 'outline',
  ghost: 'ghost'
} as const

export const ALERT_VARIANTS = {
  success: 'success',
  error: 'error',
  warning: 'warning',
  info: 'info'
} as const

export const PROGRESS_VARIANTS = {
  bar: 'bar',
  circle: 'circle',
  steps: 'steps'
} as const

export const QUESTION_TYPES = {
  MULTIPLE_CHOICE: 'multiple-choice',
  TRUE_FALSE: 'true-false',
  FILL_BLANK: 'fill-blank',
  ESSAY: 'essay'
} as const

export const TOAST_POSITIONS = {
  TOP_RIGHT: 'top-right',
  TOP_LEFT: 'top-left',
  BOTTOM_RIGHT: 'bottom-right',
  BOTTOM_LEFT: 'bottom-left',
  TOP_CENTER: 'top-center',
  BOTTOM_CENTER: 'bottom-center'
} as const

export const LAYOUT_BACKGROUNDS = {
  DEFAULT: 'default',
  BLUE: 'blue',
  GREEN: 'green',
  PURPLE: 'purple',
  YELLOW: 'yellow',
  RED: 'red',
  GRAY: 'gray'
} as const

export const CONTAINER_SIZES = {
  SM: 'sm',
  MD: 'md',
  LG: 'lg',
  XL: 'xl',
  FULL: 'full'
} as const

export const SPACING_SIZES = {
  NONE: 'none',
  SM: 'sm',
  MD: 'md',
  LG: 'lg',
  XL: 'xl'
} as const

export const ANIMATION_DURATIONS = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500
} as const

export const DEFAULT_TOAST_DURATION = 5000
export const DEFAULT_DEBOUNCE_DELAY = 300
export const DEFAULT_ANIMATION_DURATION = 300
