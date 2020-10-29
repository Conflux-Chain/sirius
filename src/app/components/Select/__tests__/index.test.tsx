import React from 'react';
import { render } from '@testing-library/react';
import { Select } from '..';

const renderComponent = () => render(<Select />);
describe('<Select />', () => {
  it('should match snapshot', () => {
    const component = renderComponent();
    expect(component.container.firstChild).toMatchSnapshot();
  });
});
