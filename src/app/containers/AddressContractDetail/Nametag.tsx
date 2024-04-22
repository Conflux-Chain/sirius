import React, { useMemo } from 'react';
import { useNametag } from 'utils/hooks/useNametag';
import { Tooltip } from 'sirius-next/packages/common/dist/components/Tooltip';
import externallinkIcon from 'images/nametag/externallink.svg';
import verifiedIcon from 'images/nametag/verified.svg';
import warningIcon from 'images/nametag/warning.svg';
import { getLabelInfo } from 'app/components/AddressContainer';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { Link as ComponentLink } from 'app/components/Link';
import { StyledLabelWrapper } from './layouts';

const Nametag = ({ address }) => {
  const { t } = useTranslation();
  const nametags = useNametag([address]);
  const nametag = {
    ...nametags[address],
    labels: nametags[address]?.labels || [],
  };

  const { label: labelOfNametag /* icon: iconOfNametag */ } = useMemo(
    () =>
      nametag
        ? getLabelInfo(nametag.nameTag, 'nametag')
        : { label: '', icon: '' },
    [nametag],
  );

  let tag = (
    <StyledLabelWrapper show={!!labelOfNametag}>
      # {labelOfNametag}
    </StyledLabelWrapper>
  );

  if (nametag?.website) {
    tag = (
      <ComponentLink
        href={
          nametag?.website.startsWith('http')
            ? nametag?.website
            : `https://${nametag?.website}`
        }
        target="__blank"
      >
        <StyledLabelWrapper show={!!labelOfNametag}>
          # {labelOfNametag}{' '}
          <img
            src={externallinkIcon}
            style={{ marginLeft: '4px' }}
            alt="external-link-icon"
          ></img>
        </StyledLabelWrapper>
      </ComponentLink>
    );
  }

  return (
    <>
      {labelOfNametag && (
        <Tooltip
          title={
            <>
              <div>
                {t(translations.nametag.tip)} {nametag?.nameTag}
              </div>
              {nametag?.desc}
            </>
          }
        >
          {tag}
        </Tooltip>
      )}

      {nametag?.labels.map(label => (
        <StyledLabelWrapper
          show={!!nametag?.labels.length}
          color={nametag?.caution ? '#E15C56' : ''}
          backgroundColor={nametag?.caution ? '#FBEBEB' : ''}
          bordered={!!nametag?.caution}
        >
          <img
            src={nametag?.caution ? warningIcon : verifiedIcon}
            style={{ marginRight: '6px' }}
            alt="status-icon"
          ></img>
          {label}
        </StyledLabelWrapper>
      ))}
    </>
  );
};

export default Nametag;
