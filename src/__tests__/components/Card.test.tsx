import { render, screen } from '@testing-library/react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'

describe('Card Component', () => {
  it('should render Card with content', () => {
    render(
      <Card>
        <CardContent>Card content</CardContent>
      </Card>
    )
    expect(screen.getByText('Card content')).toBeInTheDocument()
  })

  it('should render Card with header', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card description text</CardDescription>
        </CardHeader>
      </Card>
    )
    expect(screen.getByText('Card Title')).toBeInTheDocument()
    expect(screen.getByText('Card description text')).toBeInTheDocument()
  })

  it('should render Card with footer', () => {
    render(
      <Card>
        <CardContent>Content</CardContent>
        <CardFooter>Footer text</CardFooter>
      </Card>
    )
    expect(screen.getByText('Content')).toBeInTheDocument()
    expect(screen.getByText('Footer text')).toBeInTheDocument()
  })

  it('should render full Card structure', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Full Card</CardTitle>
          <CardDescription>Description here</CardDescription>
        </CardHeader>
        <CardContent>Main content goes here</CardContent>
        <CardFooter>Footer content</CardFooter>
      </Card>
    )
    expect(screen.getByText('Full Card')).toBeInTheDocument()
    expect(screen.getByText('Description here')).toBeInTheDocument()
    expect(screen.getByText('Main content goes here')).toBeInTheDocument()
    expect(screen.getByText('Footer content')).toBeInTheDocument()
  })

  it('should accept custom className', () => {
    render(
      <Card className="custom-class" data-testid="card">
        <CardContent>Content</CardContent>
      </Card>
    )
    expect(screen.getByTestId('card')).toHaveClass('custom-class')
  })
})
