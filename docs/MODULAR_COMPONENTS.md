# Modular Components Documentation

This document provides comprehensive documentation for the modular component system in the Akhlak Flashcard application.

## Overview

The application has been modularized to provide a comprehensive set of reusable components that can be easily composed to build complex user interfaces. The modular system is organized into several categories:

- **UI Components**: Basic building blocks (Button, Card, Input, etc.)
- **Layout Components**: Page structure and organization
- **Navigation Components**: Navigation and routing elements
- **Content Components**: Content display and interaction
- **Feedback Components**: Alerts, notifications, and user feedback

## Component Categories

### UI Components (`src/components/ui/`)

#### Button
A versatile button component with multiple variants and interactive features.

```tsx
import { Button } from '../components'

<Button
  variant="primary"
  size="md"
  onClick={handleClick}
  enableSound={true}
>
  Click me
</Button>
```

**Props:**
- `variant`: 'primary' | 'secondary' | 'success' | 'danger' | 'outline' | 'ghost'
- `size`: 'sm' | 'md' | 'lg'
- `loading`: boolean
- `fullWidth`: boolean
- `enableSound`: boolean

#### Input
A form input component with validation and bilingual support.

```tsx
import { Input } from '../components'

<Input
  label="Name"
  value={name}
  onChange={setName}
  variant="outlined"
  size="md"
  enableBilingual={true}
  error={errors.name}
/>
```

**Props:**
- `label`: string
- `error`: string
- `helperText`: string
- `variant`: 'default' | 'filled' | 'outlined'
- `size`: 'sm' | 'md' | 'lg'
- `fullWidth`: boolean
- `leftIcon`: React.ReactNode
- `rightIcon`: React.ReactNode
- `enableBilingual`: boolean

#### Select
A dropdown select component with options and validation.

```tsx
import { Select } from '../components'

<Select
  label="Category"
  options={categories}
  value={selectedCategory}
  onChange={setSelectedCategory}
  enableBilingual={true}
/>
```

**Props:**
- `label`: string
- `error`: string
- `helperText`: string
- `variant`: 'default' | 'filled' | 'outlined'
- `size`: 'sm' | 'md' | 'lg'
- `options`: SelectOption[]
- `placeholder`: string
- `enableBilingual`: boolean

#### Checkbox
A checkbox component with validation and bilingual support.

```tsx
import { Checkbox } from '../components'

<Checkbox
  label="Subscribe to newsletter"
  checked={isSubscribed}
  onChange={setIsSubscribed}
  enableBilingual={true}
/>
```

**Props:**
- `label`: string
- `error`: string
- `helperText`: string
- `size`: 'sm' | 'md' | 'lg'
- `variant`: 'default' | 'primary' | 'success' | 'warning' | 'danger'
- `enableBilingual`: boolean
- `children`: React.ReactNode

#### Alert
An alert component for displaying messages and notifications.

```tsx
import { Alert } from '../components'

<Alert
  title="Success"
  message="Operation completed successfully!"
  variant="success"
  dismissible={true}
  enableBilingual={true}
/>
```

**Props:**
- `title`: string
- `message`: string
- `variant`: 'success' | 'error' | 'warning' | 'info'
- `dismissible`: boolean
- `onDismiss`: () => void
- `icon`: React.ReactNode
- `enableBilingual`: boolean

### Layout Components (`src/components/layout/`)

#### Page
A page wrapper component with consistent background and container.

```tsx
import { Page } from '../components'

<Page background="blue" className="py-8">
  <div>Page content</div>
</Page>
```

**Props:**
- `children`: React.ReactNode
- `background`: 'default' | 'blue' | 'green' | 'purple' | 'yellow' | 'red' | 'gray'
- `className`: string
- `containerClassName`: string
- `fullHeight`: boolean

#### Section
A section wrapper component for organizing content.

```tsx
import { Section } from '../components'

<Section
  title="Section Title"
  subtitle="Section description"
  variant="centered"
  spacing="lg"
>
  <div>Section content</div>
</Section>
```

**Props:**
- `children`: React.ReactNode
- `title`: string
- `subtitle`: string
- `variant`: 'default' | 'centered' | 'narrow' | 'wide'
- `spacing`: 'none' | 'sm' | 'md' | 'lg' | 'xl'
- `className`: string
- `titleClassName`: string
- `subtitleClassName`: string

#### Container
A container component for consistent content wrapping.

```tsx
import { Container } from '../components'

<Container size="lg" padding="md">
  <div>Container content</div>
</Container>
```

**Props:**
- `children`: React.ReactNode
- `size`: 'sm' | 'md' | 'lg' | 'xl' | 'full'
- `padding`: 'none' | 'sm' | 'md' | 'lg'
- `className`: string
- `as`: keyof JSX.IntrinsicElements

### Navigation Components (`src/components/navigation/`)

#### NavButton
A navigation button component with consistent styling.

```tsx
import { NavButton } from '../components'

<NavButton
  href="/dashboard"
  variant="primary"
  size="md"
  icon={<HomeIcon />}
  enableBilingual={true}
>
  Dashboard
</NavButton>
```

**Props:**
- `children`: React.ReactNode
- `href`: string
- `onClick`: () => void
- `active`: boolean
- `variant`: 'default' | 'primary' | 'secondary' | 'outline' | 'ghost'
- `size`: 'sm' | 'md' | 'lg'
- `icon`: React.ReactNode
- `iconPosition`: 'left' | 'right'
- `enableBilingual`: boolean
- `disabled`: boolean

#### Breadcrumb
A breadcrumb navigation component.

```tsx
import { Breadcrumb } from '../components'

<Breadcrumb
  items={[
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: 'Current Page', current: true }
  ]}
  enableBilingual={true}
/>
```

**Props:**
- `items`: BreadcrumbItem[]
- `separator`: React.ReactNode
- `enableBilingual`: boolean
- `className`: string

### Content Components (`src/components/content/`)

#### Question
A question display component for quizzes and tests.

```tsx
import { Question } from '../components'

<Question
  question="What is the capital of Malaysia?"
  questionNumber={1}
  totalQuestions={10}
  type="multiple-choice"
  enableBilingual={true}
/>
```

**Props:**
- `question`: string
- `questionNumber`: number
- `totalQuestions`: number
- `type`: 'multiple-choice' | 'true-false' | 'fill-blank' | 'essay'
- `enableBilingual`: boolean
- `showNumber`: boolean

#### Answer
An answer option component for quizzes and tests.

```tsx
import { Answer } from '../components'

<Answer
  option="Kuala Lumpur"
  optionIndex={0}
  isSelected={selectedAnswer === 0}
  isCorrect={correctAnswer === 0}
  isRevealed={showAnswer}
  onClick={() => setSelectedAnswer(0)}
  enableBilingual={true}
/>
```

**Props:**
- `option`: string
- `optionIndex`: number
- `isSelected`: boolean
- `isCorrect`: boolean
- `isRevealed`: boolean
- `onClick`: () => void
- `disabled`: boolean
- `enableBilingual`: boolean
- `variant`: 'default' | 'compact' | 'detailed'

#### Progress
A progress indicator component.

```tsx
import { Progress } from '../components'

<Progress
  value={75}
  max={100}
  variant="bar"
  color="primary"
  showLabel={true}
  label="Progress"
/>
```

**Props:**
- `value`: number
- `max`: number
- `variant`: 'bar' | 'circle' | 'steps'
- `size`: 'sm' | 'md' | 'lg'
- `color`: 'primary' | 'success' | 'warning' | 'danger'
- `showLabel`: boolean
- `label`: string
- `animated`: boolean

### Feedback Components (`src/components/feedback/`)

#### Toast
A toast notification component.

```tsx
import { Toast } from '../components'

<Toast
  title="Success"
  message="Operation completed!"
  variant="success"
  position="top-right"
  duration={5000}
  dismissible={true}
  enableBilingual={true}
/>
```

**Props:**
- `id`: string
- `title`: string
- `message`: string
- `variant`: 'success' | 'error' | 'warning' | 'info'
- `position`: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center'
- `duration`: number
- `dismissible`: boolean
- `onDismiss`: (id: string) => void
- `enableBilingual`: boolean

## Custom Hooks

### useToast
A hook for managing toast notifications.

```tsx
import { useToast } from '../hooks/useToast'

const { toasts, showToast, dismissToast, clearAllToasts } = useToast()

// Show a toast
showToast({
  title: 'Success',
  message: 'Operation completed!',
  variant: 'success'
})

// Dismiss a toast
dismissToast(toastId)

// Clear all toasts
clearAllToasts()
```

### useLocalState
A hook for managing local component state with optional persistence.

```tsx
import { useLocalState } from '../hooks/useLocalState'

const { state, setState, reset, isLoading } = useLocalState({
  key: 'form-data',
  defaultValue: { name: '', email: '' },
  persist: true
})
```

### useDebounce
A hook for debouncing values.

```tsx
import { useDebounce } from '../hooks/useDebounce'

const [searchTerm, setSearchTerm] = useState('')
const debouncedSearchTerm = useDebounce(searchTerm, { delay: 300 })
```

## Utility Functions

### Validation (`src/utils/validation.ts`)
Utility functions for form validation.

```tsx
import { validateObject, commonRules } from '../utils/validation'

const schema = {
  name: commonRules.required,
  email: commonRules.email,
  age: { min: 18, max: 100 }
}

const result = validateObject(formData, schema)
if (result.isValid) {
  // Proceed with form submission
} else {
  // Handle validation errors
  console.log(result.errors)
}
```

### Format (`src/utils/format.ts`)
Utility functions for formatting data.

```tsx
import { formatCurrency, formatDate, formatPercentage } from '../utils/format'

const price = formatCurrency(100.50) // "RM 100.50"
const date = formatDate(new Date()) // "January 1, 2024"
const percentage = formatPercentage(0.75) // "75.0%"
```

## Constants

### Component Constants (`src/constants/components.ts`)
Constants used across components.

```tsx
import { COMPONENT_VARIANTS, QUESTION_TYPES, TOAST_POSITIONS } from '../constants/components'

// Use in components
<Button variant={COMPONENT_VARIANTS.primary} />
<Question type={QUESTION_TYPES.MULTIPLE_CHOICE} />
<Toast position={TOAST_POSITIONS.TOP_RIGHT} />
```

## Best Practices

### 1. Component Composition
Use smaller, focused components to build larger, more complex ones.

```tsx
// Good: Composed from smaller components
<Card>
  <Section title="User Profile">
    <Input label="Name" value={name} onChange={setName} />
    <Input label="Email" value={email} onChange={setEmail} />
    <Button onClick={handleSave}>Save</Button>
  </Section>
</Card>
```

### 2. Consistent Props
Use consistent prop naming and types across similar components.

```tsx
// All form components use these props
<Input enableBilingual={true} />
<Select enableBilingual={true} />
<Checkbox enableBilingual={true} />
```

### 3. Type Safety
Always use TypeScript interfaces for component props.

```tsx
interface MyComponentProps {
  title: string
  onAction: () => void
  variant?: 'primary' | 'secondary'
}
```

### 4. Accessibility
Include accessibility features in all components.

```tsx
<button
  onClick={handleClick}
  aria-label="Close dialog"
  role="button"
>
  <CloseIcon />
</button>
```

### 5. Bilingual Support
Use the `enableBilingual` prop for components that display text.

```tsx
<Alert
  title="Error"
  message="Something went wrong"
  enableBilingual={true}
/>
```

## Example Usage

See `src/pages/ExampleModularPage.tsx` for a comprehensive example of how to use the modular components together to build a complete page.

## Migration Guide

To migrate existing components to use the new modular system:

1. **Replace direct imports** with the centralized import:
   ```tsx
   // Old
   import Button from '../components/Button'
   import Card from '../components/Card'
   
   // New
   import { Button, Card } from '../components'
   ```

2. **Use new component variants** where appropriate:
   ```tsx
   // Old
   <div className="bg-blue-50 p-4 rounded-lg">
     <h3>Title</h3>
     <p>Content</p>
   </div>
   
   // New
   <Card className="p-4">
     <Section title="Title">
       <p>Content</p>
     </Section>
   </Card>
   ```

3. **Implement consistent patterns** across the application:
   ```tsx
   // Use Page component for consistent layout
   <Page background="blue">
     <Container size="lg">
       <Section title="Page Title">
         {/* Page content */}
       </Section>
     </Container>
   </Page>
   ```

This modular system provides a solid foundation for building maintainable, reusable, and consistent user interfaces throughout the application.
