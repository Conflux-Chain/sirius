/**
 *
 * AddressConverter
 *
 */

import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/macro';
import { media } from 'styles/media';
import { translations } from 'locales/i18n';
import { PageHeader } from '../../components/PageHeader';
import { Card } from '../../components/Card';
import { Input, Button } from '@cfxjs/react-ui';
import { format } from 'js-conflux-sdk/dist/js-conflux-sdk.umd.min.js';
import { CopyButton } from '../../components/CopyButton';
import { useParams } from 'react-router-dom';
import { hasNetworkPrefix } from 'js-conflux-sdk/src/util/address';
import { List } from './List';

interface FormattedAddressesType {
  hexAddress: string;
  hexChecksumAddress: string;
  bytes32MainnetAddress: string;
  bytes32MainnetAddressWithType: string;
  bytes32TestnetAddress: string;
  bytes32TestnetAddressWithType: string;
}

const DEFAULT_FORMATTED_ADDRESSES = {
  hexAddress: '',
  hexChecksumAddress: '',
  bytes32MainnetAddress: '',
  bytes32MainnetAddressWithType: '',
  bytes32TestnetAddress: '',
  bytes32TestnetAddressWithType: '',
};

export function AddressConverter() {
  const { address: routerAddress = '' } = useParams<{
    address?: string;
  }>();
  const { t } = useTranslation();
  const ERROR_MESSAGE = t(translations.addressConverter.incorrectFormat);
  const [address, setAddress] = useState<string>(routerAddress);
  const [error, setError] = useState<string>('');
  const [formattedAddresses, setFormattedAddresses] = useState<
    FormattedAddressesType
  >(DEFAULT_FORMATTED_ADDRESSES);

  const handleConvert = () => {
    let hexAddress,
      hexChecksumAddress,
      bytes32MainnetAddress,
      bytes32MainnetAddressWithType,
      bytes32TestnetAddress,
      bytes32TestnetAddressWithType;

    try {
      if (address === '') {
        setError('');
        setFormattedAddresses(DEFAULT_FORMATTED_ADDRESSES);
      } else if (hasNetworkPrefix(address)) {
        hexAddress = format.hexAddress(address);
        hexChecksumAddress = format.checksumAddress(hexAddress);
        bytes32MainnetAddress = format.address(hexAddress, 1029);
        bytes32MainnetAddressWithType = format.address(hexAddress, 1029, true);
        bytes32TestnetAddress = format.address(hexAddress, 1);
        bytes32TestnetAddressWithType = format.address(hexAddress, 1, true);
      } else {
        hexAddress = address.toLowerCase();
        hexChecksumAddress = format.checksumAddress(hexAddress);
        bytes32MainnetAddress = format.address(hexAddress, 1029);
        bytes32MainnetAddressWithType = format.address(hexAddress, 1029, true);
        bytes32TestnetAddress = format.address(hexAddress, 1);
        bytes32TestnetAddressWithType = format.address(hexAddress, 1, true);
      }

      setFormattedAddresses({
        hexAddress,
        hexChecksumAddress,
        bytes32MainnetAddress,
        bytes32MainnetAddressWithType,
        bytes32TestnetAddress,
        bytes32TestnetAddressWithType,
      });
    } catch (e) {
      setError(ERROR_MESSAGE + ': ' + e.message);
      setFormattedAddresses(DEFAULT_FORMATTED_ADDRESSES);
    }
  };

  const handleInputChange = e => {
    setAddress(e.target.value.trim());
    setError('');
  };

  useEffect(() => {
    if (address) {
      handleConvert();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <StyledPageWrapper>
      <Helmet>
        <title>{t(translations.header.addressConverter)}</title>
        <meta
          name="description"
          content={t(translations.metadata.description)}
        />
      </Helmet>
      <PageHeader>{t(translations.addressConverter.title)}</PageHeader>
      <StyledSubtitleWrapper>
        {t(translations.addressConverter.subtitle)}
      </StyledSubtitleWrapper>
      <StyledInputWrapper>
        <div>
          <Input
            value={address}
            placeholder={t(translations.addressConverter.inputPlaceholder)}
            size="small"
            variant="solid"
            className="convert-address-input"
            onChange={handleInputChange}
            onKeyPress={e => {
              if (e.key === 'Enter') {
                handleConvert();
              }
            }}
          ></Input>
          <div className="convert-address-error">{error}</div>
        </div>
        <Button
          variant="solid"
          color="primary"
          size="small"
          className="convert-address-button"
          onClick={handleConvert}
        >
          {t(translations.addressConverter.button)}
        </Button>
      </StyledInputWrapper>
      <StyledResultWrapper>
        <Card>
          <List title={t(translations.addressConverter.lowercase)}>
            <div>
              {formattedAddresses.hexAddress}{' '}
              {formattedAddresses.hexAddress && (
                <CopyButton copyText={formattedAddresses.hexAddress} />
              )}
            </div>
          </List>
          <List title={t(translations.addressConverter.checksum)}>
            <div>
              {formattedAddresses.hexChecksumAddress}{' '}
              {formattedAddresses.hexChecksumAddress && (
                <CopyButton copyText={formattedAddresses.hexChecksumAddress} />
              )}
            </div>
          </List>
          <List title={t(translations.addressConverter.newMainnetAddress)}>
            <div>
              {formattedAddresses.bytes32MainnetAddress}{' '}
              {formattedAddresses.bytes32MainnetAddress && (
                <CopyButton
                  copyText={formattedAddresses.bytes32MainnetAddress}
                />
              )}
            </div>
            <div>
              {formattedAddresses.bytes32MainnetAddressWithType}{' '}
              {formattedAddresses.bytes32MainnetAddressWithType && (
                <CopyButton
                  copyText={formattedAddresses.bytes32MainnetAddressWithType}
                />
              )}
            </div>
          </List>
          <List
            noBorder
            title={t(translations.addressConverter.newTestnetAddress)}
          >
            <div>
              {formattedAddresses.bytes32TestnetAddress}{' '}
              {formattedAddresses.bytes32TestnetAddress && (
                <CopyButton
                  copyText={formattedAddresses.bytes32TestnetAddress}
                />
              )}
            </div>
            <div>
              {formattedAddresses.bytes32TestnetAddressWithType}{' '}
              {formattedAddresses.bytes32TestnetAddressWithType && (
                <CopyButton
                  copyText={formattedAddresses.bytes32TestnetAddressWithType}
                />
              )}
            </div>
          </List>
        </Card>
      </StyledResultWrapper>
      <StyledRemarkWrapper>
        <h3 className="convert-address-title">
          {t(translations.addressConverter.remark)}
        </h3>
        <div className="convert-address-tip">
          <div>{t(translations.addressConverter.tip1)}</div>
          <div>{t(translations.addressConverter.tip2)}</div>
        </div>
      </StyledRemarkWrapper>
    </StyledPageWrapper>
  );
}

const StyledPageWrapper = styled.div`
  max-width: 73.1429rem;
  margin: 0 auto;
  padding-top: 2.2857rem;

  ${media.s} {
    padding: 1.1429rem;
  }
`;

const StyledSubtitleWrapper = styled.p`
  color: #74798c;
  font-size: 1rem;
  line-height: 1.2857rem;
  margin: 1.1429rem 0 1.7143rem;
`;

const StyledInputWrapper = styled.div`
  display: flex;

  .input-container.convert-address-input {
    height: 32px;

    input {
      width: 399px;
      height: 32px;
      background: rgba(30, 61, 228, 0.04);
      border-radius: 4px;
      margin: 0;
      padding: 0 16px;

      ${media.s} {
        width: 100%;
      }
    }
  }

  .btn.convert-address-button {
    height: 32px;
    line-height: 32px;
    margin: 0 0 0 16px;
    border: none;

    & > div {
      top: 0;
    }
  }

  .convert-address-error {
    width: 399px;
    margin: 8px 0;
    font-size: 12px;
    color: #e64e4e;
    line-height: 16px;
    padding-left: 5px;

    ${media.s} {
      width: 100%;
    }
  }
`;
const StyledResultWrapper = styled.div`
  margin-top: 24px;

  .convert-address-description {
    flex-direction: row;

    .left {
      width: 500px;
    }
  }
`;
const StyledRemarkWrapper = styled.div`
  margin: 2.2857rem 0;

  .convert-address-title {
    font-size: 1.1429rem;
    font-weight: bold;
    color: #1a1a1a;
  }

  .convert-address-tip {
    margin-top: 0.8571rem;
    font-weight: normal;
    color: #7e8598;
    line-height: 1.5714rem;
    font-size: 1rem;
  }
`;
