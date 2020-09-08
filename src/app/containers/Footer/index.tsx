/**
 *
 * Footer
 *
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
// import styled from 'styled-components/macro';
import { Footer as FooterComp } from '../../components/Footer/Loadable';

export function Footer() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { t, i18n } = useTranslation();

  const left = [<span key="1">left</span>];
  const right = [<span key="1">right</span>];
  const bottom = <span key="1">@2020 Conflux. All Rights Reserved</span>;

  return <FooterComp left={left} right={right} bottom={bottom} />;
}

// const Div = styled.div``;
