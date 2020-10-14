import React from 'react';
import { render } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';

describe('<Tooltip />', () => {
  it('should match the snapshot', () => {
    const component = <div>Todo. Tooltip</div>;
    expect(component).toMatchSnapshot();
  });
});
