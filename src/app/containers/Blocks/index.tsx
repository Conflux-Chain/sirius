import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../locales/i18n';
import styled from 'styled-components/macro';
import { PageHeader } from '../../components/PageHeader/Loadable';
import { media } from '../../../styles/media';
import { useParams } from 'react-router-dom';
import { useBlockQuery } from '../../../utils/api';
import { DescriptionPanel } from './DescriptionPanel';
import { BottomTablePanel } from './BottomTablePanel';

export function Blocks() {
  const { t } = useTranslation();
  const { hash: blockHash } = useParams<{
    hash: string;
  }>();
  let loading = false;
  const { data, error } = useBlockQuery({ hash: blockHash });

  if (!data && !error) loading = true;

  return (
    <StyledblocksWrapper>
      <Helmet>
        <title>{t(translations.blocks.title)}</title>
        <meta name="description" content={t(translations.blocks.description)} />
      </Helmet>
      <PageHeader>{t(translations.blocks.title)}</PageHeader>
      <DescriptionPanel data={data?.result || {}} loading={loading} />
      <br className="sirius-blocks-br" />
      <BottomTablePanel hash={blockHash} />
    </StyledblocksWrapper>
  );
}

const StyledblocksWrapper = styled.div`
  padding: 32px 0 0;

  .sirius-blocks-br {
    margin-top: 2.2857rem;
  }

  ${media.s} {
    padding-bottom: 0;
  }
`;
