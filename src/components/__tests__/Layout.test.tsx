import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import Layout from '../Layout'

describe('Layout', () => {
  it('renders with default props', () => {
    render(<Layout>Main content</Layout>)
    
    expect(screen.getByText('Main content')).toBeInTheDocument()
    expect(screen.getByText('Akhlak Tahun Dua KSRI')).toBeInTheDocument()
    expect(screen.getByText('Aplikasi Pembelajaran Interaktif')).toBeInTheDocument()
  })

  it('renders with custom title and subtitle', () => {
    render(
      <Layout 
        title="Custom Title" 
        subtitle="Custom Subtitle"
      >
        Main content
      </Layout>
    )
    
    expect(screen.getByText('Custom Title')).toBeInTheDocument()
    expect(screen.getByText('Custom Subtitle')).toBeInTheDocument()
  })

  it('renders with user info', () => {
    const onUserClick = vi.fn()
    render(
      <Layout 
        currentUser="John Doe" 
        onUserClick={onUserClick}
        showUser={true}
      >
        Main content
      </Layout>
    )
    
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('Tukar Pengguna')).toBeInTheDocument()
  })

  it('hides user section when showUser is false', () => {
    render(
      <Layout showUser={false}>
        Main content
      </Layout>
    )
    
    expect(screen.queryByText('Pilih Pengguna')).not.toBeInTheDocument()
  })

  it('renders footer', () => {
    render(<Layout>Main content</Layout>)
    
    expect(screen.getByText('© 2025 Akhlak Tahun Dua KSRI. Dibangunkan untuk pembelajaran interaktif.')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(<Layout className="custom-class">Main content</Layout>)
    
    const layout = screen.getByText('Main content').closest('.min-h-screen')
    expect(layout).toHaveClass('custom-class')
  })

  it('applies custom header and main className', () => {
    render(
      <Layout 
        headerClassName="custom-header" 
        mainClassName="custom-main"
      >
        Main content
      </Layout>
    )
    
    const header = screen.getByRole('banner')
    const main = screen.getByRole('main')
    
    expect(header).toHaveClass('custom-header')
    expect(main).toHaveClass('custom-main')
  })
})
