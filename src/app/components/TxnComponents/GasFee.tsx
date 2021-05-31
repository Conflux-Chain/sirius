import { useTranslation } from 'react-i18next';
import styled from 'styled-components/macro';
import React from 'react';
import { toThousands } from 'utils';
import _ from 'lodash';

import imgSponsoredEn from 'images/sponsored.png';
import imgSponsoredZh from 'images/sponsored-zh.png';

export const GasFee = ({ fee, sponsored }) => {
  const { i18n } = useTranslation();
  const imgSponsored = i18n.language.startsWith('en')
    ? imgSponsoredEn
    : imgSponsoredZh;

  return (
    <StyledFeeWrapper>
      {`${_.isNil(fee) ? '--' : toThousands(fee)} drip `}
      {sponsored && (
        <img src={imgSponsored} alt="sponsored" className="icon-sponsored" />
      )}
    </StyledFeeWrapper>
  );
};

const StyledFeeWrapper = styled.span`
  .icon-sponsored {
    height: 1.4286rem;
    margin-left: 0.5714rem;
  }
`;
