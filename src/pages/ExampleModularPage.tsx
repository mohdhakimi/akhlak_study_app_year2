/**
 * =============================================================================
 * EXAMPLE MODULAR PAGE
 * =============================================================================
 * This is an example of how to use the new modular components.
 * This demonstrates best practices for component composition and reusability.
 */

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useBilingual } from '../contexts/BilingualContext'
import { useToast } from '../hooks/useToast'
import { useLocalState } from '../hooks/useLocalState'
import { useDebounce } from '../hooks/useDebounce'

// Import modular components
import {
  // Layout components
  Layout,
  Page,
  Section,
  Container,
  
  // UI components
  Button,
  Card,
  Input,
  Select,
  Checkbox,
  Alert,
  
  // Navigation components
  NavButton,
  Breadcrumb,
  
  // Content components
  Question,
  Answer,
  Progress,
  
  // Feedback components
  Toast
} from '../components'

import { TEXT } from '../constants/text'
import { COMPONENT_VARIANTS, QUESTION_TYPES } from '../constants/components'

const ExampleModularPage: React.FC = () => {
  const navigate = useNavigate()
  const { formatText } = useBilingual()
  const { toasts, showToast, dismissToast } = useToast()
  
  // Local state management
  const { state: formData, setState: setFormData, reset: resetForm } = useLocalState({
    key: 'example-form',
    defaultValue: {
      name: '',
      email: '',
      category: '',
      subscribe: false
    },
    persist: true
  })

  // Debounced search
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearchTerm = useDebounce(searchTerm, { delay: 300 })

  // Example data
  const categories = [
    { value: 'general', label: 'General' },
    { value: 'technical', label: 'Technical' },
    { value: 'support', label: 'Support' }
  ]

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Examples', href: '/examples' },
    { label: 'Modular Components', current: true }
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    showToast({
      title: 'Success',
      message: 'Form submitted successfully!',
      variant: 'success'
    })
  }

  const handleReset = () => {
    resetForm()
    showToast({
      title: 'Reset',
      message: 'Form has been reset to default values.',
      variant: 'info'
    })
  }

  return (
    <Layout
      title={formatText(TEXT.APP_TITLE)}
      subtitle="Example Modular Page"
      showBilingualToggle={true}
      showKeluarButton={true}
      onKeluarClick={() => navigate('/')}
    >
      <Page background="blue" className="py-8">
        <Container size="lg">
          {/* Breadcrumb Navigation */}
          <Breadcrumb
            items={breadcrumbItems}
            enableBilingual={true}
            className="mb-6"
          />

          {/* Page Header */}
          <Section
            title="Modular Components Example"
            subtitle="Demonstrating reusable and composable components"
            variant="centered"
            spacing="lg"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Example Card 1: Form */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Form Example</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    label="Name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    enableBilingual={true}
                    fullWidth
                  />
                  
                  <Input
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    enableBilingual={true}
                    fullWidth
                  />
                  
                  <Select
                    label="Category"
                    options={categories}
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    enableBilingual={true}
                    fullWidth
                  />
                  
                  <Checkbox
                    label="Subscribe to newsletter"
                    checked={formData.subscribe}
                    onChange={(e) => setFormData(prev => ({ ...prev, subscribe: e.target.checked }))}
                    enableBilingual={true}
                  />
                  
                  <div className="flex space-x-2">
                    <Button type="submit" variant="primary" size="sm">
                      Submit
                    </Button>
                    <Button type="button" variant="outline" size="sm" onClick={handleReset}>
                      Reset
                    </Button>
                  </div>
                </form>
              </Card>

              {/* Example Card 2: Search */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Search Example</h3>
                <Input
                  label="Search"
                  placeholder="Type to search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  enableBilingual={true}
                  fullWidth
                />
                <p className="text-sm text-gray-500 mt-2">
                  Debounced search term: {debouncedSearchTerm}
                </p>
              </Card>

              {/* Example Card 3: Progress */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Progress Example</h3>
                <div className="space-y-4">
                  <Progress
                    value={75}
                    max={100}
                    showLabel={true}
                    label="Progress Bar"
                    color="primary"
                  />
                  <Progress
                    value={60}
                    max={100}
                    variant="circle"
                    size="md"
                    color="success"
                  />
                  <Progress
                    value={3}
                    max={5}
                    variant="steps"
                    color="warning"
                  />
                </div>
              </Card>
            </div>
          </Section>

          {/* Question Example */}
          <Section title="Question Component" spacing="lg">
            <Card className="p-6">
              <Question
                question="What is the capital of Malaysia?"
                questionNumber={1}
                totalQuestions={10}
                type={QUESTION_TYPES.MULTIPLE_CHOICE}
                enableBilingual={true}
              />
              
              <div className="mt-6 space-y-3">
                <Answer
                  option="Kuala Lumpur"
                  optionIndex={0}
                  enableBilingual={true}
                />
                <Answer
                  option="Putrajaya"
                  optionIndex={1}
                  enableBilingual={true}
                />
                <Answer
                  option="Johor Bahru"
                  optionIndex={2}
                  enableBilingual={true}
                />
                <Answer
                  option="Penang"
                  optionIndex={3}
                  enableBilingual={true}
                />
              </div>
            </Card>
          </Section>

          {/* Navigation Example */}
          <Section title="Navigation Components" spacing="lg">
            <Card className="p-6">
              <div className="space-y-4">
                <div>
                  <h4 className="text-md font-medium mb-2">Nav Buttons</h4>
                  <div className="flex flex-wrap gap-2">
                    <NavButton variant="primary" size="sm">
                      Primary
                    </NavButton>
                    <NavButton variant="secondary" size="sm">
                      Secondary
                    </NavButton>
                    <NavButton variant="outline" size="sm">
                      Outline
                    </NavButton>
                    <NavButton variant="ghost" size="sm">
                      Ghost
                    </NavButton>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-md font-medium mb-2">Alert Example</h4>
                  <Alert
                    title="Information"
                    message="This is an example alert message."
                    variant="info"
                    enableBilingual={true}
                  />
                </div>
              </div>
            </Card>
          </Section>
        </Container>
      </Page>

      {/* Toast Notifications */}
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          {...toast}
          onDismiss={dismissToast}
          enableBilingual={true}
        />
      ))}
    </Layout>
  )
}

export default ExampleModularPage
