import React from 'react';
import { render } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import { MemoryRouter } from 'react-router';

import { Search } from '..';

const renderComponent = () =>
  render(
    <HelmetProvider>
      <MemoryRouter>
        <Search />
      </MemoryRouter>
    </HelmetProvider>,
  );

describe('<Search />', () => {
  it('should match the snapshot', () => {
    const component = renderComponent();
    expect(component.container.firstChild).toMatchSnapshot();
  });
});
