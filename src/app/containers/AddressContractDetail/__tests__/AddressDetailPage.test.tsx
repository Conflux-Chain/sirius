import React from 'react';
import { render } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import { MemoryRouter } from 'react-router';
import { act } from 'react-dom/test-utils';

import { AddressDetailPage } from '../AddressDetailPage';

const renderComponent = () =>
  render(
    <HelmetProvider>
      <MemoryRouter>
        <AddressDetailPage />
      </MemoryRouter>
    </HelmetProvider>,
  );

describe('<AddressDetailPage />', () => {
  it('should match the snapshot', () => {
    act(() => {
      const component = renderComponent();
      expect(component.container.firstChild).toMatchSnapshot();
    });
    // const component = renderComponent();
    // expect(component.container.firstChild).toMatchSnapshot();
  });
});
