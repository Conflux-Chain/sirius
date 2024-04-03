import React from 'react';
import styled from 'styled-components';
import { Link } from 'app/components/Link/Loadable';
import { useTranslation } from 'react-i18next';
import { translations } from 'sirius-next/packages/common/dist/locales/i18n';
import { Breadcrumb } from '@cfxjs/antd';
import { useHistory } from 'react-router-dom';
import { media } from 'styles/media';

export const Wrapper = ({
  children,
  preview = false,
  title,
  subtitle,
  name,
  plain = false,
  path = 'charts',
  type = 'pow',
  ...others
}) => {
  const { t } = useTranslation();
  const url = `/${path}/${name}`;
  const history = useHistory();

  const handleClick = e => {
    e.preventDefault();
    e.stopPropagation();
    // @ts-ignore
    const from = history.location.state?.from;
    if (from === `/${path}`) {
      history.goBack();
    } else {
      history.push(`/${path}`);
    }
  };

  if (preview) {
    return (
      <StyledPreviewWrapper>
        <div className="header">
          <div className="title">
            {title.replace('Conflux ', '')}
            <div className="subtitle">{subtitle}</div>
          </div>
          <Link
            href={url}
            state={{
              from: `/${path}`,
            }}
            className="view-detail"
          >
            {t(translations.highcharts[type].preview.viewDetail)}
          </Link>
        </div>
        {children}
      </StyledPreviewWrapper>
    );
  } else {
    return (
      <StyledPageWrapper>
        {!plain && (
          <Breadcrumb className="breadcrumb">
            <Breadcrumb.Item>
              <Link onClick={handleClick}>
                {t(translations.highcharts[type].breadcrumb.charts)}
              </Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Link href={url}>
                {t(translations.highcharts[type].breadcrumb[name])}
              </Link>
            </Breadcrumb.Item>
          </Breadcrumb>
        )}
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

    ${media.s} {
      top: -1.7143rem;
    }
  }
`;
