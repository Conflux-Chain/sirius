import React from 'react';
import { render } from '@testing-library/react';
import { Link } from '..';
import { MemoryRouter } from 'react-router';

describe('<Link  />', () => {
  it('should match snapshot', () => {
    const loadingIndicator = render(
      <MemoryRouter>
        <Link href="/tokens">content</Link>
      </MemoryRouter>,
    );
    expect(loadingIndicator.container.firstChild).toMatchSnapshot();
  });
});
