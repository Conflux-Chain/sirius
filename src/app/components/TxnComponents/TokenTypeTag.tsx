import React from 'react';
import styled from 'styled-components/macro';
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
  color: #ffffff;
  font-size: 10px;
  border-radius: 0.7143rem;
  padding: 0 0.3571rem;
  white-space: nowrap;

  &.crc20 {
    background-color: rgb(104, 206, 252);
  }

  &.crc721 {
    background-color: rgb(44, 72, 198);
  }

  &.crc1155 {
    background-color: rgb(97, 152, 249);
  }
`;
