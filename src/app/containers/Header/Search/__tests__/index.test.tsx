import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

import { Search } from '../';

describe('<Search  />', () => {
  it('should match snapshot', () => {
    const loadingIndicator = render(
      <MemoryRouter>
        <Search />
      </MemoryRouter>,
    );
    expect(loadingIndicator.container.firstChild).toMatchSnapshot();
  });
});
