import React from 'react';
import { render } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import { PackingPage } from '..';

HelmetProvider.canUseDOM = false;

const renderComponent = () =>
  render(
    <HelmetProvider context={{}}>
      <PackingPage />
    </HelmetProvider>,
  );

describe('<NotFoundPage />', () => {
  it('should match the snapshot', () => {
    const component = renderComponent();
    expect(component.container.firstChild).toMatchSnapshot();
  });
});
