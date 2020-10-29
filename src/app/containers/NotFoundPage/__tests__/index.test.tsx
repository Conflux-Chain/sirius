import React from 'react';
import { render } from '@testing-library/react';
import { NotFoundPage } from '..';

const renderComponent = () => render(<NotFoundPage />);

describe('<NotFoundPage />', () => {
  it('should match the snapshot', () => {
    const component = renderComponent();
    expect(component.container.firstChild).toMatchSnapshot();
  });
});
