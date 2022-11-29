import { act, render, screen } from '@testing-library/react';

import HomePage from '@/pages/index';

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve([
      ['id', 'name'],
      ['1', 'Salve Fertility'],
      ['2', 'London IVF']
    ]),
  })
);

beforeEach(() => {
  fetch.mockClear();
});

describe('Homepage', () => {
  it('renders loading state', async () => {
    act(() => {
      render(<HomePage />);
    })

    const heading = screen.getByText(/loading/i);

    expect(heading).toBeInTheDocument();

  });
});
