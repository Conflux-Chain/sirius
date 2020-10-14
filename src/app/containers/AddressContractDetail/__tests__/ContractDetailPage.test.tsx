import React from 'react';
import { render } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';

import { ContractDetailPage } from '../ContractDetailPage';

const renderComponent = () =>
  render(
    <HelmetProvider>
      <ContractDetailPage />
    </HelmetProvider>,
  );

describe('<ContractDetailPage />', () => {
  it('should match the snapshot', () => {
    const component = renderComponent();
    expect(component.container.firstChild).toMatchSnapshot();
  });
});
