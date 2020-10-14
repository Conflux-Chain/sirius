import React from 'react';
import { render } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';

import { ContractDetail } from '../ContractDetail';

const renderComponent = () =>
  render(
    <HelmetProvider>
      <ContractDetail />
    </HelmetProvider>,
  );

describe('<ContractDetail />', () => {
  it('should match the snapshot', () => {
    const component = renderComponent();
    expect(component.container.firstChild).toMatchSnapshot();
  });
});
