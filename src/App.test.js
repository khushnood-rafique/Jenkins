import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn Jenkins link', () => {
  render(<App />);
  const linkElement = screen.getByText(/khushnood rafique/i);
  expect(linkElement).toBeInTheDocument();
});
