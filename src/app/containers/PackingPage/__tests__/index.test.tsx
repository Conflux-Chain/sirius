import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

import { PackingPage } from '..';

const renderComponent = () =>
  render(
    <MemoryRouter>
      <PackingPage />
    </MemoryRouter>,
  );

describe('<PackingPage />', () => {
  it('should match the snapshot', () => {
    const component = renderComponent();
    expect(component.container.firstChild).toMatchSnapshot();
  });
});
