import React from 'react';
import { render } from '@testing-library/react';
import Text from '..';

describe('<Tabs  />', () => {
  it('should match snapshot', () => {
    const loadingIndicator = render(
      <Text maxWidth={'40px'}>
        <span>1234567890</span>
      </Text>,
    );
    expect(loadingIndicator.container.firstChild).toMatchSnapshot();
  });
});
