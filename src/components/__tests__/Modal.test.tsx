import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Modal from '../Modal'

// Mock createPortal
vi.mock('react-dom', async () => {
  const actual = await vi.importActual('react-dom')
  return {
    ...actual,
    createPortal: (node: React.ReactNode) => node,
  }
})

describe('Modal', () => {
  beforeEach(() => {
    // Reset body overflow style
    document.body.style.overflow = 'unset'
  })

  it('renders when isOpen is true', () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()}>
        Modal content
      </Modal>
    )

    expect(screen.getByText('Modal content')).toBeInTheDocument()
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('does not render when isOpen is false', () => {
    render(
      <Modal isOpen={false} onClose={vi.fn()}>
        Modal content
      </Modal>
    )

    expect(screen.queryByText('Modal content')).not.toBeInTheDocument()
  })

  it('renders with title', () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()} title="Test Title">
        Modal content
      </Modal>
    )

    expect(screen.getByText('Test Title')).toBeInTheDocument()
    expect(screen.getByRole('dialog')).toHaveAttribute(
      'aria-labelledby',
      'modal-title'
    )
  })

  it('renders with different sizes', () => {
    const { rerender } = render(
      <Modal isOpen={true} onClose={vi.fn()} size="sm">
        Small modal
      </Modal>
    )
    expect(screen.getByRole('dialog')).toHaveClass('max-w-sm')

    rerender(
      <Modal isOpen={true} onClose={vi.fn()} size="md">
        Medium modal
      </Modal>
    )
    expect(screen.getByRole('dialog')).toHaveClass('max-w-md')

    rerender(
      <Modal isOpen={true} onClose={vi.fn()} size="lg">
        Large modal
      </Modal>
    )
    expect(screen.getByRole('dialog')).toHaveClass('max-w-lg')

    rerender(
      <Modal isOpen={true} onClose={vi.fn()} size="xl">
        Extra large modal
      </Modal>
    )
    expect(screen.getByRole('dialog')).toHaveClass('max-w-xl')
  })

  it('calls onClose when close button is clicked', () => {
    const onClose = vi.fn()
    render(
      <Modal isOpen={true} onClose={onClose} showCloseButton={true}>
        Modal content
      </Modal>
    )

    fireEvent.click(screen.getByLabelText('Tutup modal'))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when overlay is clicked', () => {
    const onClose = vi.fn()
    render(
      <Modal isOpen={true} onClose={onClose} closeOnOverlayClick={true}>
        Modal content
      </Modal>
    )

    const overlay = screen
      .getByRole('dialog')
      .parentElement?.querySelector('.absolute')
    fireEvent.click(overlay!)
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('does not call onClose when overlay is clicked and closeOnOverlayClick is false', () => {
    const onClose = vi.fn()
    render(
      <Modal isOpen={true} onClose={onClose} closeOnOverlayClick={false}>
        Modal content
      </Modal>
    )

    const overlay = screen
      .getByRole('dialog')
      .parentElement?.querySelector('.absolute')
    fireEvent.click(overlay!)
    expect(onClose).not.toHaveBeenCalled()
  })

  it('handles escape key', () => {
    const onClose = vi.fn()
    render(
      <Modal isOpen={true} onClose={onClose}>
        Modal content
      </Modal>
    )

    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('applies custom className', () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()} className="custom-class">
        Modal content
      </Modal>
    )

    expect(screen.getByRole('dialog')).toHaveClass('custom-class')
  })
})
