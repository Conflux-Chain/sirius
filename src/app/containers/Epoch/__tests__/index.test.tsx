import React from 'react';
import { render } from '@testing-library/react';

const renderComponent = () => render(<div>Todo. Epochs</div>);

describe('<Epochs />', () => {
  it('should match the snapshot', () => {
    const component = renderComponent();
    expect(component.container.firstChild).toMatchSnapshot();
  });
});
