import React from 'react';
import styled from 'styled-components/macro';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { Image } from '@jnoodle/antd';
import { padLeft } from 'utils';
import { StyledTitle1474798C } from 'app/components/StyledComponent';
import NFTIcon from 'images/fccfx/nft.png';
import NotFoundIcon from 'images/token/tokenIdNotFound.jpg';
import { InfoIconWithTooltip } from 'app/components/InfoIconWithTooltip';
import { Tooltip } from '@jnoodle/antd';

interface PropsType {
  id?: string;
  isActive: boolean;
}

export const FCCFXNFT = ({ id = '0', isActive = false }: PropsType) => {
  let nft = (
    <Image
      src={NFTIcon}
      preview={false}
      fallback={NotFoundIcon}
      alt="nft icon"
    ></Image>
  );

  if (isActive) {
    nft = (
      <Tooltip
        title={
          <div className="fccfx-accountInfo-index"># {padLeft(id, 5)}</div>
        }
      >
        {nft}
      </Tooltip>
    );
  }
  return (
    <StyledFCCFXNFTWrapper isActive={isActive}>{nft}</StyledFCCFXNFTWrapper>
  );
};

export function MyNFTCard({ isActive = false, id = '0' }: PropsType) {
  const { t } = useTranslation();

  return (
    <StyledMyNFTWrapper>
      <StyledTitle1474798C>
        {t(translations.fccfx.titleMyNFT)}
        <span className="tip">
          <InfoIconWithTooltip info={t(translations.fccfx.tip.myNFT)} />
        </span>
      </StyledTitle1474798C>
      <div className="fccfx-nft-container">
        <FCCFXNFT id={id} isActive={isActive} />
      </div>
    </StyledMyNFTWrapper>
  );
}

const StyledMyNFTWrapper = styled.div`
  margin-top: 13px;

  .fccfx-accountInfo-index {
    position: absolute;
    bottom: 26%;
    left: 52px;
    color: #fff;
    font-weight: bold;
    font-size: 12px;
  }

  .tip {
    display: flex;
    align-items: center;
    margin-left: 5px;
  }

  .fccfx-nft-container {
    width: 60%;
  }
`;

const StyledFCCFXNFTWrapper = styled.div<{
  isActive: boolean;
}>`
  display: inline-block;
  position: relative;
  filter: ${props => (props.isActive ? 'grayscale(0)' : 'grayscale(1)')};

  .ant-image {
    vertical-align: middle;
  }
`;
