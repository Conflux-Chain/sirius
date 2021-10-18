import React from 'react';
import { Row, Col } from '@jnoodle/antd';
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
            <AccountInfoCard info={accountInfo} />
          </Col>
        </Row>
      </Card>
    </StyledInfoCardWrapper>
  );
};

const StyledInfoCardWrapper = styled.div`
  margin-bottom: 24px;
`;
