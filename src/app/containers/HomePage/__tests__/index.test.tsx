import React from 'react';
import { render } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';

import { HomePage } from '..';

HelmetProvider.canUseDOM = false;

const renderComponent = () =>
  render(
    <HelmetProvider context={{}}>
      <HomePage />
    </HelmetProvider>,
  );

describe('<HomePage />', () => {
  it.skip('should match the snapshot', () => {
    const component = renderComponent();
    expect(component.container.firstChild).toMatchSnapshot();
  });
});
