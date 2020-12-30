import React from 'react';

describe('<Contracts />', () => {
  it('should match the snapshot', () => {
    const component = <div>Todo. Contracts</div>;
    expect(component).toMatchSnapshot();
  });
});
