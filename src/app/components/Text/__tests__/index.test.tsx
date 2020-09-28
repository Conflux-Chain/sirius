import React from 'react';
import { render } from '@testing-library/react';
import Text from '..';

describe('<Text  />', () => {
  it('should match snapshot', () => {
    const loadingIndicator = render(
      <Text maxwidth={'40px'}>
        <span>1234567890</span>
      </Text>,
    );
    expect(loadingIndicator.container.firstChild).toMatchSnapshot();
  });

  it('should match snapshot when set maxCount', () => {
    const loadingIndicator = render(<Text maxCount={5}>1234567890</Text>);
    expect(loadingIndicator.container.firstChild).toMatchSnapshot();
  });
});
