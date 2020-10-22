import React from 'react';
import { render } from '@testing-library/react';
import { CountDown } from '..';
import { MemoryRouter } from 'react-router';

describe('<CountDown  />', () => {
  it('should match snapshot', () => {
    const loadingIndicator = render(
      <MemoryRouter>
        <CountDown from={1600690230000} to={1603282230000} />
      </MemoryRouter>,
    );
    expect(loadingIndicator.container.firstChild).toMatchSnapshot();
  });
});
