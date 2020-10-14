import React from 'react';
import { render } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';

describe('<Token />', () => {
  it('should match the snapshot', () => {
    const component = <div>Todo. Token</div>;
    expect(component).toMatchSnapshot();
  });
});
