import React from 'react';
import { render } from '@testing-library/react';

import TablePanel from '..';

describe('<TablePanel  />', () => {
  it('should match snapshot', () => {
    const tablePanel = render(<div>Todo.</div>);
    expect(tablePanel).toMatchSnapshot();
  });
});
