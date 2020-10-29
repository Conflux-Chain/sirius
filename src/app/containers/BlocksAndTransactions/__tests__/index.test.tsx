import React from 'react';
import { render } from '@testing-library/react';

const renderComponent = () => render(<div>Todo. BlocksAndTransactions</div>);

describe('<BlocksAndTransactions />', () => {
  it('should match the snapshot', () => {
    const component = renderComponent();
    expect(component.container.firstChild).toMatchSnapshot();
  });
});
