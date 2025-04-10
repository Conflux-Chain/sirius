import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import styled from 'styled-components';
import { Helmet } from 'react-helmet-async';
import { PageHeader } from '@cfxjs/sirius-next-common/dist/components/PageHeader';
import { AddressLabel } from './AddressLabel';
import { TxNote } from './TxNote';
import { File } from './File';
import { Row, Col } from '@cfxjs/sirius-next-common/dist/components/Grid';
import { Card } from '@cfxjs/sirius-next-common/dist/components/Card';
import { useLocation, useHistory } from 'react-router-dom';
import qs from 'query-string';

export function Profile() {
  const { search } = useLocation();
  const history = useHistory();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const tabs = [
    {
      value: 'address-label',
      label: t(translations.profile.address.title),
      content: <AddressLabel />,
    },
    {
      value: 'tx-note',
      label: t(translations.profile.tx.title),
      content: <TxNote />,
    },
  ];
  const { tab = 'address-label' } = qs.parse(search);
  const activeTab = tabs.filter(t => t.value === tab)?.[0] || tabs[0];

  const handleClick = (_, key) => {
    history.push(`/profile?tab=${key}`);
  };

  const handleLoading = loading => {
    setLoading(loading);
  };

  return (
    <StyledWrapper>
      <Helmet>
        <title>{t(translations.profile.title)}</title>
        <meta name="description" content={t(translations.profile.title)} />
      </Helmet>
      <PageHeader subtitle={t(translations.profile.subtitle)}>
        {t(translations.profile.title)}
      </PageHeader>
      <Row gutter={32}>
        <Col xxl={6} xl={6} lg={6} md={6} sm={24} xs={24}>
          <StyledNavWrapper>
            <Card>
              {tabs.map(t => (
                <div
                  className={`nav ${t.value === tab ? 'active' : ''}`}
                  key={t.value}
                  onClick={e => handleClick(e, t.value)}
                >
                  {t.label}
                </div>
              ))}

              <File onLoading={handleLoading}></File>
            </Card>
          </StyledNavWrapper>
        </Col>
        <Col xxl={18} xl={18} lg={18} md={18} sm={24} xs={24}>
          <Card loading={loading}>
            <StyledContentWrapper>{activeTab.content}</StyledContentWrapper>
          </Card>
        </Col>
      </Row>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .button-group-container {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .sirius-btn {
      min-width: 124px;
    }
  }

  .card.sirius-card {
    padding: 1rem;
  }
`;

const StyledNavWrapper = styled.div`
  margin-bottom: 24px;
  .nav {
    display: flex;
    align-items: center;
    height: 42px;
    margin: 8px 0;
    border-radius: 4px;
    background: #fff;
    transition: background 0.25s;
    padding: 12px;

    .card.sirius-card {
      padding: 0;
    }

    &:hover {
      background: #eee;
      cursor: pointer;
    }

    &.active {
      background: #eee;
    }

    &:last-child {
      margin-bottom: 8px;
    }
  }
`;
const StyledContentWrapper = styled.div`
  .ant-table-wrapper.shadowed div.ant-table {
    padding: 0;
    box-shadow: none;
  }

  ul.ant-table-pagination.ant-pagination {
    margin-bottom: 0;
  }
`;
