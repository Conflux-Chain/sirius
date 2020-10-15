import React from 'react';
import { render } from '@testing-library/react';
import { Status } from '..';

describe('<Status  />', () => {
  it('should match snapshot', () => {
    const loadingIndicator = render(<Status type={1}></Status>);
    expect(loadingIndicator.container.firstChild).toMatchSnapshot();
  });
});
