import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import App from './App'

describe('App', () => {
  it('renders welcome message', () => {
    render(<App />)
    expect(screen.getByText('Akhlak Tahun Dua KSRI')).toBeInTheDocument()
    expect(screen.getByText('Aplikasi Pembelajaran Interaktif')).toBeInTheDocument()
  })

  it('renders counter button', () => {
    render(<App />)
    expect(screen.getByText('Klik untuk menguji: 0')).toBeInTheDocument()
  })
})
