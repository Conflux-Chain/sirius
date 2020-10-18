import React from 'react';
import { render } from '@testing-library/react';
import { Description } from '..';

describe('<Description  />', () => {
  it('should match snapshot', () => {
    const loadingIndicator = render(
      <Description title={'title'}>content</Description>,
    );
    expect(loadingIndicator.container.firstChild).toMatchSnapshot();
  });
});
