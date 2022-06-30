import { render, screen } from '@testing-library/react'
import App from './App'

test('renders Deck', () => {
  render(<App />)
  const linkElement = screen.getByText(/Deck/i)
  expect(linkElement).toBeInTheDocument()
})
