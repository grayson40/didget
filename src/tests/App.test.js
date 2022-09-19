import { render, screen } from '@testing-library/react';
import App from '../components/App';

test('renders Hello, World!', () => {
  render(<App />);
  const helloElement = screen.getByText('Hello, World!');
  expect(helloElement).toBeInTheDocument();
});
