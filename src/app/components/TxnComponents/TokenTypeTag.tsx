import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';

interface Props {
  type: 'crc20' | 'crc721' | 'crc1155';
}

export const TokenTypeTag = ({
  type,
}: Props): React.ReactComponentElement<'span'> => {
  const { t } = useTranslation();

  return (
    <StyledTokenTypeTag className={type}>
      {type.toUpperCase()} {t(translations.general.tokenTypeTag.token)}
    </StyledTokenTypeTag>
  );
};

const StyledTokenTypeTag = styled.span`
  color: #010101;
  font-size: 10px;
  border-radius: 0.7143rem;
  padding: 0 0.3571rem;
  white-space: nowrap;
  background-color: #60bbf9;
`;
