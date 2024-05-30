import React from 'react';
import { Select } from '@cfxjs/sirius-next-common/dist/components/Select';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import Globe from '@zeit-ui/react-icons/globe';
import { trackEvent } from '../../../utils/ga';
import { ScanEvent } from '../../../utils/gaConstants';

export function Language() {
  const { i18n } = useTranslation();
  const lang = i18n.language.includes('zh') ? 'zh' : 'en';

  const handleLanguageChange = l => {
    if (l === 'en') {
      trackEvent({
        category: ScanEvent.preference.category,
        action: ScanEvent.preference.action.changeLang,
        label: 'en',
      });
      i18n.changeLanguage('en');
    } else {
      trackEvent({
        category: ScanEvent.preference.category,
        action: ScanEvent.preference.action.changeLang,
        label: 'zh-CN',
      });
      i18n.changeLanguage('zh-CN');
    }
  };
  const options = [
    {
      value: 'en',
      name: 'EN',
    },
    {
      value: 'zh',
      name: '中文',
    },
  ];
  return (
    <StyledWrapper>
      <Globe size={14} />
      <Select
        value={lang}
        onChange={handleLanguageChange}
        disableMatchWidth
        size="small"
        className="btnSelectContainer"
        variant="text"
      >
        {options.map(o => {
          return (
            <Select.Option key={o.value} value={o.value}>
              {o.name}
            </Select.Option>
          );
        })}
      </Select>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.span`
  position: relative;
  display: flex;
  align-items: center;
  color: var(--theme-color-gray0);

  &:hover {
    color: var(--theme-color-blue0);

    .select.sirius-select.btnSelectContainer .value .option {
      color: var(--theme-color-blue0) !important;
    }
  }

  .select.sirius-select.btnSelectContainer {
    background: transparent;
    position: absolute;
    top: -0.6071rem;
    left: 0.2143rem;

    .value .option {
      font-weight: normal;
      &:not(:hover) {
        color: var(--theme-color-gray0);
      }
    }
  }
`;
