import React from 'react';
import { Row, Col } from '@cfxjs/antd';
import { Card } from 'sirius-next/packages/common/dist/components/Card';
import { TotalInfoCard } from './TotalInfoCard';
import { AccountInfoCard } from './AccountInfoCard';
import styled from 'styled-components';
import { useBreakpoint } from 'sirius-next/packages/common/dist/utils/media';

export const InfoCard = ({ totalInfo, accountInfo }) => {
  const bp = useBreakpoint();

  return (
    <StyledInfoCardWrapper>
      <Card className="fccfx-card">
        <Row gutter={24}>
          <Col md={10} sm={24}>
            <TotalInfoCard info={totalInfo} />
          </Col>
          {bp !== 's' && (
            <Col md={14} sm={24}>
              <Row>
                <Col span={2}>
                  <StyledSplitWrapper></StyledSplitWrapper>
                </Col>
                <Col span={22}>
                  <AccountInfoCard info={accountInfo} />
                </Col>
              </Row>
            </Col>
          )}
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
