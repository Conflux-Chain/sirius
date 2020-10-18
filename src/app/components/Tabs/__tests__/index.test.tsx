import React from 'react';
import { render } from '@testing-library/react';
import { Tabs } from '..';

describe('<Tabs  />', () => {
  it('should match snapshot', () => {
    const loadingIndicator = render(
      <Tabs>
        <Tabs.Item label="label1" value="1">
          1
        </Tabs.Item>
        <Tabs.Item label="label2" value="2">
          2
        </Tabs.Item>
      </Tabs>,
    );
    expect(loadingIndicator.container.firstChild).toMatchSnapshot();
  });
});
