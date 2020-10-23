import React from 'react';
import { render } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import { MemoryRouter } from 'react-router';

import { ContractDetailPage } from '../ContractDetailPage';

const renderComponent = () =>
  render(
    <HelmetProvider>
      <MemoryRouter>
        <ContractDetailPage />
      </MemoryRouter>
    </HelmetProvider>,
  );

describe('<ContractDetailPage />', () => {
  it('should match the snapshot', () => {
    const component = renderComponent();
    expect(component.container.firstChild).toMatchSnapshot();
  });
});
