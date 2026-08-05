import React from 'react';
import { useHistory } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { PageHeader } from '@cfxjs/sirius-next-common/dist/components/PageHeader';
import { verifiedContractsColumns } from 'utils/tableColumns';
import { TablePanel as TablePanelNew } from 'app/components/TablePanelNew';
import { useTableData } from '@cfxjs/sirius-next-common/dist/utils/hooks/useTableData';
import { OPEN_API_URLS } from 'utils/constants';
import { useContractsStatistics } from '@cfxjs/sirius-next-common/dist/utils/hooks/useContractsStatistics';
import styled from 'styled-components';
import { Card } from '@cfxjs/sirius-next-common/dist/components/Card';
import { InternalLink } from '@cfxjs/sirius-next-common/dist/components/Icons';
import { toThousands } from 'utils';
import { Title } from '../Transactions/components';

const LatestInfoCards = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const [data, loading] = useContractsStatistics();
  return (
    <InfoWrapper>
      <Card
        loading={loading}
        onClick={() => {
          history.push('/pow-charts/contracts');
        }}
      >
        <div className="title">
          <span>
            {t(translations.verifiedContracts.totalContractsDeployed)}
          </span>
          <InternalLink />
        </div>
        <div className="content">
          {toThousands(data.totalContractsDeployed) || '-'}
        </div>
      </Card>
      <Card
        loading={loading}
        onClick={() => {
          history.push('/pow-charts/contracts');
        }}
      >
        <div className="title">
          <span>{t(translations.verifiedContracts.newContractsDeployed)}</span>
          <InternalLink />
        </div>
        <div className="content">
          {toThousands(data.newContractsDeployed) || '-'}
        </div>
      </Card>
      <Card
        loading={loading}
        onClick={() => {
          history.push('/pow-charts/verified-contracts');
        }}
      >
        <div className="title">
          <span>
            {t(translations.verifiedContracts.totalContractsVerified)}
          </span>
          <InternalLink />
        </div>
        <div className="content">
          {toThousands(data.totalContractsVerified) || '-'}
        </div>
      </Card>
      <Card
        loading={loading}
        onClick={() => {
          history.push('/pow-charts/verified-contracts');
        }}
      >
        <div className="title">
          <span>{t(translations.verifiedContracts.newContractsVerified)}</span>
          <InternalLink />
        </div>
        <div className="content">
          {toThousands(data.newContractsVerified) || '-'}
        </div>
      </Card>
    </InfoWrapper>
  );
};

export function VerifiedContracts() {
  const { t } = useTranslation();
  const { data, loading, pagination, setPagination } = useTableData({
    url: OPEN_API_URLS.verifiedContractsLatest,
  });

  const columnsWidth = [5, 7, 4, 4, 4, 2, 4, 4, 4];
  const columns = [
    verifiedContractsColumns.address,
    verifiedContractsColumns.contractName,
    verifiedContractsColumns.compiler,
    verifiedContractsColumns.version,
    verifiedContractsColumns.balance,
    verifiedContractsColumns.txns,
    verifiedContractsColumns.setting,
    verifiedContractsColumns.verified,
    verifiedContractsColumns.license,
  ].map((item, i) => ({ ...item, width: columnsWidth[i] }));

  const title = ({ total, listLimit }) => (
    <Title
      total={total}
      listLimit={listLimit}
      showSearch={true}
      searchOptions={{
        contractName: true,
        button: {
          col: {
            xs: 24,
            sm: 18,
          },
        },
      }}
    />
  );

  return (
    <>
      <Helmet>
        <title>{t(translations.verifiedContracts.title)}</title>
        <meta
          name="description"
          content={t(translations.verifiedContracts.description)}
        />
      </Helmet>
      <PageHeader>{t(translations.verifiedContracts.title)}</PageHeader>

      <LatestInfoCards />

      <TablePanelNew
        columns={columns}
        dataSource={data?.list}
        pagination={pagination}
        loading={loading}
        onChange={setPagination}
        title={title}
        total={data?.total}
        listLimit={data?.listLimit}
        rowKey="address"
      ></TablePanelNew>
    </>
  );
}

export const InfoWrapper = styled.section`
  margin-bottom: 24px;
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 24px;

  > div {
    flex: 1;
    min-width: 230px;
    .card {
      padding: 18px;
      cursor: pointer;
      &:hover {
        .title {
          svg {
            display: block;
          }
        }
        .content {
          color: #1e3de4;
        }
      }
    }
    .title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: rgba(38, 36, 75, 0.6);
      font-size: 14px;
      font-weight: 450;
      line-height: 24px; /* 171.429% */
      svg {
        display: none;
      }
    }
    .content {
      color: #26244b;
      font-size: 18px;
      font-weight: 700;
      line-height: 24px; /* 133.333% */
    }
  }
`;
