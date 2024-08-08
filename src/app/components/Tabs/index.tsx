import React from 'react';
import { Tabs as UITabs } from '@cfxjs/react-ui';
import { TabsProps } from '@cfxjs/react-ui/dist/tabs/tabs';
import styled from 'styled-components';
import clsx from 'clsx';
import { media } from '@cfxjs/sirius-next-common/dist/utils/media';

const Tabs = ({ children, className, ...others }: TabsProps) => {
  return (
    <StyledTabsWrapper>
      <UITabs className={clsx(className, 'sirius-tabs')} {...others}>
        {children}
      </UITabs>
    </StyledTabsWrapper>
  );
};

Tabs.Item = UITabs.Item;
Tabs.useTabsHandle = UITabs.useTabsHandle;

const StyledTabsWrapper = styled.div`
  .tabs.sirius-tabs {
    .tab {
      .label {
        font-size: 1.1429rem;
        color: rgba(11, 19, 46, 0.6);
        line-height: 1.7143rem;
        padding: 0.5714rem 0.2857rem;
        font-weight: 500;
      }
      .nav {
        margin: 0 0.5714rem;
      }
      &.active,
      &:hover {
        .label {
          font-weight: 500;
          color: #0b132e;
        }
      }
      .bottom {
        height: 0.4286rem;
        border-top-left-radius: 0.5714rem;
        border-top-right-radius: 0.5714rem;
      }
      &.disabled {
        display: none;
      }
    }
    header {
      overflow: visible;

      ${media.s} {
        max-width: 100vw;
        overflow-x: auto;
      }
    }
    header + .content {
      margin-top: 1.1rem;
      padding-top: 0;
    }
  }
`;

export { Tabs };
