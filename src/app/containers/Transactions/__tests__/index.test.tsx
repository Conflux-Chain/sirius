import React from 'react';
import { render } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';

describe('<Transactions />', () => {
  it('should match the snapshot', () => {
    const component = <div>Todo. Transactions</div>;
    expect(component).toMatchSnapshot();
  });
});
