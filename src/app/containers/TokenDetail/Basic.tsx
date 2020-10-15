/**
 * TokenDetail
 */
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/macro';
import { List } from '../../components/List/Loadable';
import { useTokenQuery } from '../../../utils/api';

export const Basic = ({ tokenAddr }) => {
  const { t } = useTranslation();
  const params = { address: tokenAddr };
  const { data } = useTokenQuery(params);

  return (
    <BasicWrap>
      <List list={data} />
    </BasicWrap>
  );
};

const BasicWrap = styled.div`
  margin-bottom: 20px;
`;
