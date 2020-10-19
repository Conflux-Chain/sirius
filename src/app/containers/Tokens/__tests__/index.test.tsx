import React from 'react';

describe('<Token />', () => {
  it('should match the snapshot', () => {
    const component = <div>Todo. Token</div>;
    expect(component).toMatchSnapshot();
  });
});
