import React from 'react';
import styled from 'styled-components';
import Button from '@cfxjs/sirius-next-common/dist/components/Button';
import clsx from 'clsx';
import { media } from '@cfxjs/sirius-next-common/dist/utils/media';

interface Props {
  tabs: Array<{
    label: string;
    key: string;
  }>;
  activeKey: string;
  onChange: (activeKey?: string, index?: number) => void;
  className?: string;
  extra?: React.ReactNode;
}

// tabs example: [{
//   label: '',
//   key: ''
// }]
export const SubTabs = ({
  tabs,
  activeKey,
  onChange,
  className,
  extra,
}: Props) => {
  return (
    <StyledSubTabsWrapper className={clsx(className)}>
      {tabs.map((o, index) => (
        <Button
          type="action"
          key={o.key}
          className={clsx('subtabs-tabItem', {
            'subtabs-tabItem-active': o.key === activeKey,
          })}
          onClick={() => onChange(o.key, index)}
        >
          {o.label}
        </Button>
      ))}
      {extra ? <div className="subtabs-tabItem-extra">{extra}</div> : null}
    </StyledSubTabsWrapper>
  );
};

const StyledSubTabsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;

  .subtabs-tabItem {
    border-radius: 1.1429rem;
    padding: 0 1rem;
    min-width: initial;
    height: 1.8571rem;
    line-height: 1.8571rem;
    border: none;
    background-color: #f5f8ff;
    margin-right: 0.2857rem;

    ${media.s} {
      margin: 0.3571rem 0;
    }

    &:hover,
    &:active {
      color: #ffffff;
      background-color: rgba(0, 84, 254, 0.8);
    }

    .text {
      top: 0px !important;
    }
  }

  .subtabs-tabItem-active {
    color: #ffffff;
    background-color: rgba(0, 84, 254, 0.8);
  }

  .subtabs-tabItem-extra {
    flex-grow: 1;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
`;
