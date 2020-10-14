import React from 'react';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';

import { Header } from '..';

const renderComponent = () =>
  render(
    <MemoryRouter>
      <Header />
    </MemoryRouter>,
  );

describe('<Header />', () => {
  it('should match the snapshot', () => {
    const ui = renderComponent();
    expect(ui.container.firstChild).toMatchSnapshot();
  });

  it('should match the snapshot when link is matched', () => {
    const ui = renderComponent();
    expect(ui.container.firstChild).toMatchSnapshot();
  });
  it('should support expanded menu', async () => {
    const ui = renderComponent();
    userEvent.click(ui.getByText('Contract'));
    expect(
      ui.container.querySelector('.link.navbar-link-menu.navbar-link.expanded'),
    ).toBeDefined();
    userEvent.click(ui.container.querySelector('input') as Element);
    await waitFor(
      () =>
        expect(
          ui.container.querySelector(
            '.link.navbar-link-menu.navbar-link.expanded',
          ),
        ).toBeFalsy(),
      { timeout: 2000, interval: 200 },
    );
  });
  it('should support click on second level menu', async () => {
    const ui = renderComponent();
    userEvent.click(ui.getByText('Contract'));
    expect(
      ui.container.querySelector('.link.navbar-link-menu.navbar-link.expanded'),
    ).toBeDefined();
    userEvent.click(ui.getByText('Contract Creation'));
  });
});
