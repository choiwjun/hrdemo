import { render, screen } from '@testing-library/react'
import { Badge } from '@/components/ui/badge'

describe('Badge Component', () => {
  it('should render correctly', () => {
    render(<Badge>Default Badge</Badge>)
    expect(screen.getByText('Default Badge')).toBeInTheDocument()
  })

  it('should apply default variant', () => {
    render(<Badge>Default</Badge>)
    expect(screen.getByText('Default')).toBeInTheDocument()
  })

  it('should apply secondary variant', () => {
    render(<Badge variant="secondary">Secondary</Badge>)
    expect(screen.getByText('Secondary')).toBeInTheDocument()
  })

  it('should apply destructive variant', () => {
    render(<Badge variant="destructive">Destructive</Badge>)
    expect(screen.getByText('Destructive')).toBeInTheDocument()
  })

  it('should apply outline variant', () => {
    render(<Badge variant="outline">Outline</Badge>)
    expect(screen.getByText('Outline')).toBeInTheDocument()
  })

  it('should accept custom className', () => {
    render(<Badge className="custom-badge">Custom</Badge>)
    const badge = screen.getByText('Custom')
    expect(badge).toHaveClass('custom-badge')
  })

  it('should render with children elements', () => {
    render(
      <Badge>
        <span data-testid="icon">🔥</span>
        Hot
      </Badge>
    )
    expect(screen.getByTestId('icon')).toBeInTheDocument()
    expect(screen.getByText('Hot')).toBeInTheDocument()
  })
})
