import React from 'react';
import { render } from '@testing-library/react';

import { Header } from '..';

const renderComponent = () => render(<Header />);

describe('<Header />', () => {
  it('should match the snapshot', () => {
    const component = renderComponent();
    expect(component.container.firstChild).toMatchSnapshot();
  });
});
