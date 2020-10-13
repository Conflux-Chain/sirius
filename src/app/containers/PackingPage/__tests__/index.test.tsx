import React from 'react';
import { render } from '@testing-library/react';

import { PackingPage } from '..';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // use actual for all non-hook parts
  useParams: () => ({
    txHash: '0x87455a2f9bcaf8421927575d98852c8e43ff6fe8',
  }),
}));

const renderComponent = () => render(<PackingPage />);

describe('<PackingPage />', () => {
  it('should match the snapshot', () => {
    const component = renderComponent();
    expect(component.container.firstChild).toMatchSnapshot();
  });
});
