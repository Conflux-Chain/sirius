import React from 'react';
import { render } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';

import { AddressDetail } from '../AddressDetail';

const renderComponent = () =>
  render(
    <HelmetProvider>
      <AddressDetail />
    </HelmetProvider>,
  );

describe('<AddressDetail />', () => {
  it('should match the snapshot', () => {
    const component = renderComponent();
    expect(component.container.firstChild).toMatchSnapshot();
  });
});
