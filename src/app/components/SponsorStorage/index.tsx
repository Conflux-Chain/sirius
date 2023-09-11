import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { formatNumber, processSponsorStorage } from 'utils';
import styled from 'styled-components';
import { Popover } from '@cfxjs/antd';
import { FileSearchOutlined } from '@ant-design/icons';

interface StorageInfo {
  point: string;
  collateral: string;
}

interface SponsorStorageProps {
  storageUsed?: StorageInfo | null;
  storageQuota?: StorageInfo | null;
}

type NativeAttrs = Omit<React.HTMLAttributes<any>, keyof SponsorStorageProps>;

export declare type Props = SponsorStorageProps & NativeAttrs;

const fN = number =>
  formatNumber(number, {
    withUnit: false,
  });

const SponsorStorage = ({ children, storageUsed, storageQuota }: Props) => {
  const { t } = useTranslation();

  const used = useMemo(
    () => processSponsorStorage(storageUsed?.point, storageUsed?.collateral),
    [storageUsed],
  );
  const quota = useMemo(
    () => processSponsorStorage(storageQuota?.point, storageQuota?.collateral),
    [storageQuota],
  );

  return (
    <StyledSponsorStorageWrapper>
      {children}
      <Popover
        content={
          <StyledSponsorStorageContentWrapper>
            {storageUsed && (
              <div>
                <div className="total">
                  {t(translations.sponsor.storage.used)} {fN(used.total)} KB
                </div>
                <div>
                  {t(translations.sponsor.storage.point)} {fN(used.point)} ≈{' '}
                  {fN(used.fPoint)} KB
                </div>
                <div>
                  {t(translations.sponsor.storage.collateral)}{' '}
                  {fN(used.collateral)} CFX ≈ {fN(used.fCollateral)} KB
                </div>
              </div>
            )}
            {storageQuota && (
              <div>
                <div className={`total ${storageUsed ? 'mt10' : ''}`}>
                  {t(translations.sponsor.storage.quota)} {fN(quota.total)} KB
                </div>
                <div>
                  {t(translations.sponsor.storage.point)} {fN(quota.point)} ≈{' '}
                  {fN(quota.fPoint)} KB
                </div>
                <div>
                  {t(translations.sponsor.storage.collateral)}{' '}
                  {fN(quota.collateral)} CFX ≈ {fN(quota.fCollateral)} KB
                </div>
              </div>
            )}
            <div className="tip mt10">
              {t(translations.sponsor.storage.example)}
            </div>
            <div
              className="tip mt10"
              dangerouslySetInnerHTML={{
                __html: t(translations.sponsor.storage.desc),
              }}
            ></div>
          </StyledSponsorStorageContentWrapper>
        }
      >
        <FileSearchOutlined className="icon-file" />
      </Popover>
    </StyledSponsorStorageWrapper>
  );
};

SponsorStorage.defaultProps = {
  shown: false,
};

SponsorStorage.propTypes = {
  shown: PropTypes.bool,
};

const StyledSponsorStorageContentWrapper = styled.div`
  max-width: 420px;
  color: #282d30;
  font-size: 14px;
  line-height: 22px;

  .total {
    font-weight: 700;
    margin-bottom: 10px;
  }

  .tip {
    color: #9b9eac;
  }

  .mt10 {
    margin-top: 10px;
  }

  .mb10 {
    margin-bottom: 10px;
  }
`;

const StyledSponsorStorageWrapper = styled.div`
  display: flex;
  align-items: center;

  .icon-file {
    font-size: 14px;
    margin-left: 10px;
  }
`;

export default SponsorStorage;
