import React from 'react';
import styled from 'styled-components/macro';
import { Link } from 'app/components/Link/Loadable';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { Breadcrumb } from '@cfxjs/antd';

export const Wrapper = ({
  children,
  preview = false,
  title,
  subtitle,
  name,
  ...others
}) => {
  const { t } = useTranslation();
  const url = `/${
    ['supply', 'circulating'].includes(name) ? 'stat' : 'new-charts'
  }/${name}`;

  if (preview) {
    return (
      <StyledPreviewWrapper>
        <div className="header">
          <div className="title">
            {title.replace('Conflux ', '')}
            <div className="subtitle">{subtitle}</div>
          </div>
          <Link href={url} className="view-detail">
            {t(translations.highcharts.preview.viewDetail)}
          </Link>
        </div>
        {children}
      </StyledPreviewWrapper>
    );
  } else {
    return (
      <StyledPageWrapper>
        <Breadcrumb className="breadcrumb">
          <Breadcrumb.Item>
            <Link href="/new-charts">
              {t(translations.highcharts.breadcrumb.charts)}
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link href={url}>
              {t(translations.highcharts.breadcrumb[name])}
            </Link>
          </Breadcrumb.Item>
        </Breadcrumb>
        {children}
      </StyledPageWrapper>
    );
  }
};

const StyledPreviewWrapper = styled.div`
  background-color: #ffffff;
  border: 1px solid var(--theme-color-gray3);
  border-radius: 4px;
  transition: border-color 0.25s;

  &:hover {
    border: 1px solid var(--theme-color-blue0);
  }

  .header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    padding: 16px 20px 0 20px;
  }

  .title {
    font-size: 16px;
    color: var(--theme-color-blue1);

    .subtitle {
      font-size: 14px;
      color: var(--theme-color-gray4);
    }
  }

  .view-detail {
    flex-shrink: 0;
  }
`;

const StyledPageWrapper = styled.div`
  position: relative;

  .breadcrumb {
    position: absolute;
    right: 0;
  }
`;
