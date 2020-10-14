/**
 *
 * AddressDetail
 *
 */

import React, { memo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/macro';
import { Card } from '@cfxjs/react-ui';
import { TabsTablePanel } from '../../components/TabsTablePanel/Loadable';
import { media } from 'styles/media';

interface Props {}

export const AddressDetail = memo((props: Props) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { t, i18n } = useTranslation();

  return (
    <>
      <Helmet>
        <title>AddressDetail</title>
        <meta name="description" content="Description of AddressDetail" />
      </Helmet>
      <Main></Main>
    </>
  );
});

const Main = styled.div`
  max-width: 73.1429rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 4.57rem;
  ${media.s} {
    margin-bottom: 2rem;
  }
`;

const Head = styled.section`
  border: 1px red solid;
`;
const Top = styled.section`
  border: 1px blue solid;
`;
const Bottom = styled.section`
  border: 1px green solid;
`;
