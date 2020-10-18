import React from 'react';
import { render } from '@testing-library/react';
import { Status } from '..';

describe('<Status  />', () => {
  it('should match snapshot', () => {
    const loadingIndicator = render(<Status type={1}></Status>);
    expect(loadingIndicator.container.firstChild).toMatchSnapshot();
  });

  it('should render dot status correct', () => {
    const loadingIndicator = render(<Status type={3} variant="dot"></Status>);
    expect(loadingIndicator.container.firstChild).toMatchSnapshot();
  });
});
