import React from 'react';
import { Row, Col } from '@cfxjs/antd';
import { Card } from 'app/components/Card/Loadable';
import { TotalInfoCard } from './TotalInfoCard';
import { AccountInfoCard } from './AccountInfoCard';
import styled from 'styled-components/macro';

export const InfoCard = ({ totalInfo, accountInfo }) => {
  return (
    <StyledInfoCardWrapper>
      <Card className="fccfx-card">
        <Row gutter={24}>
          <Col span={10}>
            <TotalInfoCard info={totalInfo} />
          </Col>
          <Col span={14}>
            <Row>
              <Col span={2}>
                <StyledSplitWrapper></StyledSplitWrapper>
              </Col>
              <Col span={22}>
                <AccountInfoCard info={accountInfo} />
              </Col>
            </Row>
          </Col>
        </Row>
      </Card>
    </StyledInfoCardWrapper>
  );
};

const StyledInfoCardWrapper = styled.div`
  margin-bottom: 24px;
`;

const StyledSplitWrapper = styled.div`
  position: relative;
  height: 100%;

  &::before {
    position: absolute;
    border-left: 1px solid #e8e9ea;
    content: '';
    top: 10%;
    bottom: 0%;
    left: 20%;
  }
`;
