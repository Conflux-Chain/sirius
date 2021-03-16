import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { media, useBreakpoint } from 'styles/media';
import { translations } from '../../../locales/i18n';
import { ColumnsType } from '../../components/TabsTablePanel';
import { TablePanel } from '../../components/TablePanel';
import { useTableData } from '../../components/TabsTablePanel';
import { blockColunms } from '../../../utils/tableColumns';
import { Dag } from './Loadable';
import { toThousands } from '../../../utils';
import styled from 'styled-components/macro';
import { PageHeader } from '../../components/PageHeader/Loadable';

export function Blocks() {
  const { t } = useTranslation();
  const bp = useBreakpoint();
  const url = '/block';

  const columnsBlocksWidth = [4, 2, 2, 3, 5, 3, 3, 3, 5];
  const columnsBlocks: ColumnsType = [
    blockColunms.epoch,
    blockColunms.position,
    blockColunms.txns,
    blockColunms.hash,
    blockColunms.miner,
    blockColunms.avgGasPrice,
    blockColunms.gasUsedPercent,
    blockColunms.reward,
    blockColunms.age,
  ].map((item, i) => ({ ...item, width: columnsBlocksWidth[i] }));

  const { total } = useTableData(url);
  const tip = (
    <StyledTipLabelWrapper>
      {t(translations.blocks.tipCountBefore)}
      <StyledSpan>{toThousands(total)}</StyledSpan>
      {t(translations.blocks.tipCountAfter)}
    </StyledTipLabelWrapper>
  );

  return (
    <>
      <Helmet>
        <title>{t(translations.blocks.title)}</title>
        <meta name="description" content={t(translations.blocks.description)} />
      </Helmet>
      {bp !== 's' && <Dag />}
      <TabsTablePanelWrapper>
        <PageHeader>{t(translations.blocks.title)}</PageHeader>
        <TablePanel
          url={url}
          table={{
            columns: columnsBlocks,
            rowKey: 'hash',
          }}
          tableHeader={tip}
        ></TablePanel>
      </TabsTablePanelWrapper>
    </>
  );
}

const TabsTablePanelWrapper = styled.div`
  margin-top: 1.2rem;
  ${media.s} {
    margin-top: 2.2rem;
  }
`;

const StyledTipLabelWrapper = styled.div`
  font-size: 1rem;
  font-weight: 400;
  color: #74798c;
  margin: 0.5rem 0;
`;

const StyledSpan = styled.span`
  color: #1e3de4;
  padding: 0 0.4286rem;
`;
