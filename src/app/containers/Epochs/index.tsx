import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../locales/i18n';
import { ColumnsType } from '../../components/TabsTablePanel';
import { TablePanel } from '../../components/TablePanel/Loadable';
import styled from 'styled-components';
import { Text } from '../../components/Text/Loadable';
import { media } from '../../../styles/media';
import { useParams } from 'react-router-dom';
import { PageHeader } from '../../components/PageHeader/Loadable';

interface epochNumber {
  number: string;
}

const StyledEpochWrapper = styled.div`
  max-width: 73.1429rem;
  margin: 0 auto;
  padding-top: 0.8571rem;

  ${media.s} {
    padding: 0.2857rem 1.1429rem 1.1429rem;
  }
`;

const renderTextEllipsis = value => (
  <Text span maxWidth={'5.7143rem'} hoverValue={value}>
    {value}
  </Text>
);

export const Epochs = () => {
  const { number } = useParams<epochNumber>();
  const { t } = useTranslation();

  const columnsBlocks: ColumnsType = [
    {
      title: t(translations.epochs.table.position),
      dataIndex: 'blockIndex',
      key: 'blockIndex',
      width: 100,
    },
    {
      title: t(translations.epochs.table.hash),
      dataIndex: 'hash',
      key: 'hash',
      width: 100,
      render: value => renderTextEllipsis(value),
    },
    {
      title: t(translations.epochs.table.txns),
      dataIndex: 'transactionCount',
      key: 'transactionCount',
      width: 100,
      ellipsis: true,
    },
    {
      title: t(translations.epochs.table.miner),
      dataIndex: 'miner',
      key: 'miner',
      width: 100,
      render: value => renderTextEllipsis(value),
    },
    {
      title: t(translations.epochs.table.difficulty),
      dataIndex: 'gasLimit',
      key: 'gasLimit',
      width: 100,
    },
    {
      title: t(translations.epochs.table.gasUsedPercent),
      dataIndex: 'gasLimit',
      key: 'gasLimit',
      width: 100,
    },
    {
      title: t(translations.epochs.table.age),
      dataIndex: 'syncTimestamp',
      key: 'syncTimestamp',
      width: 100,
    }, // todo, how to calculate age value ?
  ];

  return (
    <StyledEpochWrapper>
      <Helmet>
        <title>{t(translations.epochs.title)}</title>
        <meta name="description" content={t(translations.epochs.description)} />
      </Helmet>
      <PageHeader>{t(translations.epochs.title)}</PageHeader>
      <TablePanel
        url={`/block/list?epochNumber=${number}`}
        table={{ columns: columnsBlocks, rowKey: 'hash' }}
      />
    </StyledEpochWrapper>
  );
};
