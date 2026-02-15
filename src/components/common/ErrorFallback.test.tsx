import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ErrorFallback } from './ErrorFallback'

describe('ErrorFallback', () => {
  it('renders error message', () => {
    const error = new Error('Test error message')
    render(<ErrorFallback error={error} resetErrorBoundary={() => {}} />)
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    expect(screen.getByText('Test error message')).toBeInTheDocument()
  })

  it('calls resetErrorBoundary when Try Again is clicked', () => {
    const resetFn = vi.fn()
    const error = new Error('fail')
    render(<ErrorFallback error={error} resetErrorBoundary={resetFn} />)
    fireEvent.click(screen.getByText('Try Again'))
    expect(resetFn).toHaveBeenCalledOnce()
  })

  it('renders role="alert"', () => {
    render(<ErrorFallback error={new Error('x')} resetErrorBoundary={() => {}} />)
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })
})
