import React from 'react';
import { render } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';

describe('<TokenDetail />', () => {
  it('should match the snapshot', () => {
    const component = <div>Todo. TokenDetail</div>;
    expect(component).toMatchSnapshot();
  });
});
