import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../locales/i18n';
import { ColumnsType } from '../../components/TabsTablePanel';
import { TablePanel } from '../../components/TablePanel/Loadable';
import styled from 'styled-components';
import { media } from '../../../styles/media';
import { useParams } from 'react-router-dom';
import { PageHeader } from '../../components/PageHeader/Loadable';
import { blockColunms } from '../../../utils/tableColumns';

interface epochNumber {
  number: string;
}

const StyledEpochWrapper = styled.div`
  max-width: 73.1429rem;
  margin: 0 auto;
  padding-top: 2.2857rem;

  ${media.s} {
    padding: 1.1429rem;
  }
`;
const StyledSubtitleWrapper = styled.p`
  color: #74798c;
  font-size: 1rem;
  line-height: 1.2857rem;
  margin: 1.1429rem 0 1.7143rem;
`;

export const Epochs = () => {
  const { number } = useParams<epochNumber>();
  const { t } = useTranslation();

  const columnsBlocks: ColumnsType = [
    blockColunms.position,
    blockColunms.hashWithPivot,
    blockColunms.txns,
    blockColunms.miner,
    blockColunms.difficulty,
    blockColunms.gasUsedPercent,
    blockColunms.age,
  ];

  return (
    <StyledEpochWrapper>
      <Helmet>
        <title>{t(translations.epochs.title)}</title>
        <meta name="description" content={t(translations.epochs.description)} />
      </Helmet>
      <PageHeader>{t(translations.epochs.title)}</PageHeader>
      <StyledSubtitleWrapper>{number}</StyledSubtitleWrapper>
      <TablePanel
        url={`/block?epochNumber=${number}`}
        table={{ columns: columnsBlocks, rowKey: 'hash' }}
      />
    </StyledEpochWrapper>
  );
};
