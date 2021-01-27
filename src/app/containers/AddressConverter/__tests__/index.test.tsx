import React from 'react';
import { render } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import { MemoryRouter } from 'react-router';

import { AddressConverter } from '..';

const renderComponent = () =>
  render(
    <HelmetProvider>
      <MemoryRouter>
        <AddressConverter />
      </MemoryRouter>
    </HelmetProvider>,
  );

describe('<AddressConverter />', () => {
  it('should match the snapshot', () => {
    const component = renderComponent();
    expect(component.container.firstChild).toMatchSnapshot();
  });
});
