/**
 *
 * Link
 *
 */
import React from 'react';
import { Link as UILink } from '@cfxjs/react-ui';
import { LinkProps } from '@cfxjs/react-ui/dist/link/link';
import { useHistory } from 'react-router-dom';
import { trackEvent } from '../../../utils/ga';

export const Link = React.memo(
  ({
    href,
    ga = null,
    children,
    state,
    ...others
  }: Partial<React.PropsWithChildren<LinkProps>> & {
    ga?: any;
    state?: any;
  }) => {
    const history = useHistory();
    return (
      <UILink
        href={href}
        onClick={e => {
          e.preventDefault();
          if (ga) {
            trackEvent(ga);
          }

          if (!href) return;
          if (/^http/.test(href)) {
            window.open(href);
          } else if (e.metaKey) {
            window.open(`${window.location.origin}${href}`);
          } else {
            history.push(href, state);
          }
        }}
        {...others}
      >
        {children}
      </UILink>
    );
  },
);
