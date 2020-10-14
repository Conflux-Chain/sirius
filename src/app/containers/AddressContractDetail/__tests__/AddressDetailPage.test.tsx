import React from 'react';
import { render } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';

import { AddressDetailPage } from '../AddressDetailPage';

const renderComponent = () =>
  render(
    <HelmetProvider>
      <AddressDetailPage />
    </HelmetProvider>,
  );

describe('<AddressDetailPage />', () => {
  it('should match the snapshot', () => {
    const component = renderComponent();
    expect(component.container.firstChild).toMatchSnapshot();
  });
});
