import React from 'react';
import { render } from '@testing-library/react';
import { ConnectWallet } from '..';
import { MemoryRouter } from 'react-router';

describe('<ConnectWallet  />', () => {
  it('should match snapshot', () => {
    const loadingIndicator = render(
      <MemoryRouter>
        <ConnectWallet />
      </MemoryRouter>,
    );
    expect(loadingIndicator.container.firstChild).toMatchSnapshot();
  });
});
