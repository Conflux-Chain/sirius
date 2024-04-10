import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';

export const Remark = function ({
  title: outerTitle,
  items,
  hideTitle,
  className,
}: {
  title?: React.ReactNode;
  items: Array<React.ReactNode>;
  hideTitle?: boolean;
  className?: string;
}) {
  const { t } = useTranslation();
  const title = outerTitle || t(translations.general.remark);

  return (
    <StyledRemarkWrapper className={className}>
      {hideTitle ? null : <div className="title">{title}</div>}
      <div className="content">
        {items.map((i, index) => (
          <div key={index}>{i}</div>
        ))}
      </div>
    </StyledRemarkWrapper>
  );
};

const StyledRemarkWrapper = styled.div`
  .title {
    font-size: 1.1429rem;
    font-weight: bold;
    color: #1a1a1a;
    margin-bottom: 0.8571rem;
  }
  .content {
    font-weight: normal;
    color: #7e8598;
    line-height: 1.5714rem;
    font-size: 1rem;
  }
`;
