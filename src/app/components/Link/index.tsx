/**
 *
 * Link
 *
 */
import React from 'react';
import { Link as UILink } from '@cfxjs/react-ui';
import { LinkProps } from '@cfxjs/react-ui/dist/link/link';
import { useHistory } from 'react-router-dom';

export const Link = ({
  href,
  children,
  ...others
}: Partial<React.PropsWithChildren<LinkProps>>) => {
  const history = useHistory();
  return (
    <UILink
      href={href}
      onClick={e => {
        e.preventDefault();
        href && history.push(href);
      }}
      {...others}
    >
      {children}
    </UILink>
  );
};
