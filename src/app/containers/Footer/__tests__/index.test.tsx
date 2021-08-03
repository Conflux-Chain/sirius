import React from 'react';
import { render } from '@testing-library/react';

import { Footer } from '..';
import { HelmetProvider } from 'react-helmet-async';
import { MemoryRouter } from 'react-router';

const renderComponent = () =>
  render(
    <HelmetProvider>
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    </HelmetProvider>,
  );

describe('<Footer />', () => {
  it('should match the snapshot', () => {
    const component = renderComponent();
    expect(component.container.firstChild).toMatchSnapshot();
  });
});
