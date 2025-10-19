import '@testing-library/jest-dom'
import { BilingualProvider } from '../contexts/BilingualContext'
import { UserProvider } from '../contexts/UserContext'
import { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'

// Custom render function that includes providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <UserProvider>
      <BilingualProvider>
        {children}
      </BilingualProvider>
    </UserProvider>
  )
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options })

// Re-export everything
export * from '@testing-library/react'
export { customRender as render }
