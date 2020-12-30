import React from 'react';
import { render } from '@testing-library/react';
import { NotFoundContractPage } from '..';

const renderComponent = () => render(<NotFoundContractPage />);

describe('<NotFoundContractPage />', () => {
  it('should match the snapshot', () => {
    const component = renderComponent();
    expect(component.container.firstChild).toMatchSnapshot();
  });
});
