import React from 'react';

describe('<Blocks />', () => {
  it('should match the snapshot', () => {
    const component = <div>Todo. Blocks</div>;
    expect(component).toMatchSnapshot();
  });
});
