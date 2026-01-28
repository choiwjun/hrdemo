import { render, screen, fireEvent } from '@testing-library/react'
import { Input } from '@/components/ui/input'

describe('Input Component', () => {
  it('should render correctly', () => {
    render(<Input placeholder="Enter text" />)
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument()
  })

  it('should handle value change', () => {
    const handleChange = jest.fn()
    render(<Input onChange={handleChange} />)

    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'test value' } })

    expect(handleChange).toHaveBeenCalled()
  })

  it('should be disabled when disabled prop is true', () => {
    render(<Input disabled placeholder="Disabled" />)
    expect(screen.getByPlaceholderText('Disabled')).toBeDisabled()
  })

  it('should accept type prop', () => {
    render(<Input type="email" placeholder="Email" />)
    const input = screen.getByPlaceholderText('Email')
    expect(input).toHaveAttribute('type', 'email')
  })

  it('should accept custom className', () => {
    render(<Input className="custom-input" data-testid="input" />)
    expect(screen.getByTestId('input')).toHaveClass('custom-input')
  })

  it('should support password type', () => {
    render(<Input type="password" placeholder="Password" />)
    const input = screen.getByPlaceholderText('Password')
    expect(input).toHaveAttribute('type', 'password')
  })

  it('should handle focus and blur events', () => {
    const handleFocus = jest.fn()
    const handleBlur = jest.fn()
    render(<Input onFocus={handleFocus} onBlur={handleBlur} />)

    const input = screen.getByRole('textbox')
    fireEvent.focus(input)
    expect(handleFocus).toHaveBeenCalled()

    fireEvent.blur(input)
    expect(handleBlur).toHaveBeenCalled()
  })
})
