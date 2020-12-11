import React from 'react';
import { render } from '@testing-library/react';

import { GlobalNotify } from '..';

const renderComponent = () => render(<GlobalNotify />);

describe('<GlobalNotify />', () => {
  it('should match the snapshot', () => {
    const component = renderComponent();
    expect(component.container.firstChild).toMatchSnapshot();
  });
});
