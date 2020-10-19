import React from 'react';
import { render } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';

describe('<Blocks />', () => {
  it('should match the snapshot', () => {
    const component = <div>Todo. Blocks</div>;
    expect(component).toMatchSnapshot();
  });
});
