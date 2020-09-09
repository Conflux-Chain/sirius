import React from 'react';
import { render } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';

import { BlocksAndTransactions } from '..';

HelmetProvider.canUseDOM = false;

const renderComponent = () =>
  render(
    <HelmetProvider context={{}}>
      <BlocksAndTransactions />
    </HelmetProvider>,
  );

describe('<BlocksAndTransactions />', () => {
  it('should match the snapshot', () => {
    const component = renderComponent();
    expect(component.container.firstChild).toMatchSnapshot();
  });
});
