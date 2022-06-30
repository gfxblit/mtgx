import { render, screen } from '@testing-library/react'
import App from './App'

test('renders CardTable', () => {
  render(<App />)
  const linkElement = screen.getByText(/import/i)
  expect(linkElement).toBeInTheDocument()
})
