import React from 'react';
import { MemoryRouter } from 'react-router';
import { render } from '@testing-library/react';
import { NotFoundAddressPage } from '..';

const renderComponent = () =>
  render(
    <MemoryRouter>
      <NotFoundAddressPage />
    </MemoryRouter>,
  );

describe('<NotFoundAddressPage />', () => {
  it('should match the snapshot', () => {
    const component = renderComponent();
    expect(component.container.firstChild).toMatchSnapshot();
  });
});
