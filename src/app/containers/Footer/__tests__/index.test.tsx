import React from 'react';
import { render } from '@testing-library/react';

import { Footer } from '..';

const renderComponent = () => render(<Footer />);

describe('<Footer />', () => {
  it('should match the snapshot', () => {
    const component = renderComponent();
    expect(component.container.firstChild).toMatchSnapshot();
  });
});
