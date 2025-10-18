import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Header from '../Header'

describe('Header', () => {
  it('renders with default props', () => {
    render(<Header />)
    
    expect(screen.getByText('Akhlak Tahun Dua KSRI')).toBeInTheDocument()
    expect(screen.getByText('Aplikasi Pembelajaran Interaktif')).toBeInTheDocument()
  })

  it('renders with custom title and subtitle', () => {
    render(
      <Header 
        title="Custom Title" 
        subtitle="Custom Subtitle" 
      />
    )
    
    expect(screen.getByText('Custom Title')).toBeInTheDocument()
    expect(screen.getByText('Custom Subtitle')).toBeInTheDocument()
  })

  it('renders user selection button when no current user', () => {
    const onUserClick = vi.fn()
    render(
      <Header 
        currentUser={undefined} 
        onUserClick={onUserClick}
        showUser={true}
      />
    )
    
    const userButton = screen.getByText('Pilih Pengguna')
    expect(userButton).toBeInTheDocument()
    
    fireEvent.click(userButton)
    expect(onUserClick).toHaveBeenCalledTimes(1)
  })

  it('renders current user info when user is provided', () => {
    const onUserClick = vi.fn()
    render(
      <Header 
        currentUser="John Doe" 
        onUserClick={onUserClick}
        showUser={true}
      />
    )
    
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('Tukar Pengguna')).toBeInTheDocument()
    
    const userButton = screen.getByLabelText('Pengguna semasa: John Doe')
    fireEvent.click(userButton)
    expect(onUserClick).toHaveBeenCalledTimes(1)
  })

  it('hides user section when showUser is false', () => {
    render(
      <Header 
        currentUser="John Doe" 
        showUser={false}
      />
    )
    
    expect(screen.queryByText('John Doe')).not.toBeInTheDocument()
    expect(screen.queryByText('Pilih Pengguna')).not.toBeInTheDocument()
  })

  it('shows user initial in avatar', () => {
    render(
      <Header 
        currentUser="John Doe" 
        showUser={true}
      />
    )
    
    expect(screen.getByText('J')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(<Header className="custom-class" />)
    
    const header = screen.getByRole('banner')
    expect(header).toHaveClass('custom-class')
  })
})
