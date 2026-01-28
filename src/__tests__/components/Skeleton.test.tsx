import { render, screen } from '@testing-library/react'
import { Skeleton } from '@/components/ui/skeleton'

describe('Skeleton Component', () => {
  it('should render correctly', () => {
    render(<Skeleton data-testid="skeleton" />)
    expect(screen.getByTestId('skeleton')).toBeInTheDocument()
  })

  it('should accept custom className', () => {
    render(<Skeleton className="w-full h-4" data-testid="skeleton" />)
    const skeleton = screen.getByTestId('skeleton')
    expect(skeleton).toHaveClass('w-full')
    expect(skeleton).toHaveClass('h-4')
  })

  it('should have animation class', () => {
    render(<Skeleton data-testid="skeleton" />)
    const skeleton = screen.getByTestId('skeleton')
    expect(skeleton).toHaveClass('animate-pulse')
  })

  it('should render multiple skeletons', () => {
    render(
      <div data-testid="skeleton-container">
        <Skeleton className="h-4 w-[200px]" />
        <Skeleton className="h-4 w-[150px]" />
        <Skeleton className="h-4 w-[100px]" />
      </div>
    )
    const container = screen.getByTestId('skeleton-container')
    expect(container.children).toHaveLength(3)
  })
})
