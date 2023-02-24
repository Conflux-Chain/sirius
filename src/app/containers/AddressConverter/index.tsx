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
import { Remark } from '../../components/Remark';
import { CopyButton } from '../../components/CopyButton';
import { Input, Button, Link } from '@cfxjs/react-ui';
import SDK from 'js-conflux-sdk/dist/js-conflux-sdk.umd.min.js';

import { useParams } from 'react-router-dom';
import { List } from './List';
import { trackEvent } from 'utils/ga';
import { ScanEvent } from 'utils/gaConstants';
import { isZeroAddress, isInnerContractAddress } from 'utils';
import { NETWORK_TYPE, NETWORK_TYPES } from 'utils/constants';
import { getCode } from 'utils/rpcRequest';

interface FormattedAddressesType {
  hexAddress: string;
  hexChecksumAddress: string;
  bytes32MainnetAddress: string;
  bytes32MainnetAddressWithType: string;
  bytes32TestnetAddress: string;
  bytes32TestnetAddressWithType: string;
  bytes32NetAddress: string;
  bytes32NetAddressWithType: string;
}

const DEFAULT_FORMATTED_ADDRESSES = {
  hexAddress: '',
  hexChecksumAddress: '',
  bytes32MainnetAddress: '',
  bytes32MainnetAddressWithType: '',
  bytes32TestnetAddress: '',
  bytes32TestnetAddressWithType: '',
  bytes32NetAddress: '',
  bytes32NetAddressWithType: '',
};

export function AddressConverter() {
  const { address: routerAddress = '' } = useParams<{
    address?: string;
  }>();
  const { t } = useTranslation();
  const ERROR_MESSAGE = t(translations.addressConverter.incorrectFormat);
  const [address, setAddress] = useState<string>(routerAddress);
  const [networkId, setNetworkId] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [formattedAddresses, setFormattedAddresses] = useState<
    FormattedAddressesType
  >(DEFAULT_FORMATTED_ADDRESSES);

  const checkAddress = address => {
    return new Promise((resolve, reject) => {
      if (address.startsWith('0x0')) {
        if (!(isInnerContractAddress(address) || isZeroAddress(address))) {
          reject(new Error(translations.addressConverter.errorMessage['0x0']));
        }
        resolve('');
      } else if (address.startsWith('0x8')) {
        getCode(address)
          .then(code => {
            resolve('');
          })
          .catch(() => {
            reject(
              new Error(translations.addressConverter.errorMessage['0x8']),
            );
          });
      } else {
        resolve('');
      }
    });
  };

  const handleConvert = () => {
    let hexAddress,
      hexChecksumAddress,
      bytes32MainnetAddress,
      bytes32MainnetAddressWithType,
      bytes32TestnetAddress,
      bytes32TestnetAddressWithType,
      bytes32NetAddress,
      bytes32NetAddressWithType;

    try {
      if (address === '') {
        setError('');
        setFormattedAddresses(DEFAULT_FORMATTED_ADDRESSES);
      } else if (SDK.address.hasNetworkPrefix(address)) {
        // 有network前缀
        hexAddress = SDK.format.hexAddress(address);
        hexChecksumAddress = SDK.format.checksumAddress(hexAddress);
        bytes32MainnetAddress = SDK.format.address(hexAddress, 1029);
        bytes32MainnetAddressWithType = SDK.format.address(
          hexAddress,
          1029,
          true,
        );
        bytes32TestnetAddress = SDK.format.address(hexAddress, 1);
        bytes32TestnetAddressWithType = SDK.format.address(hexAddress, 1, true);
      } else {
        // 没有network前缀
        hexAddress = address.toLowerCase();
        hexChecksumAddress = SDK.format.checksumAddress(hexAddress);
        bytes32MainnetAddress = SDK.format.address(hexAddress, 1029);
        bytes32MainnetAddressWithType = SDK.format.address(
          hexAddress,
          1029,
          true,
        );
        bytes32TestnetAddress = SDK.format.address(hexAddress, 1);
        bytes32TestnetAddressWithType = SDK.format.address(hexAddress, 1, true);
        if (networkId !== '') {
          const num = Number(networkId);
          bytes32NetAddress = SDK.format.address(hexAddress, num);
          bytes32NetAddressWithType = SDK.format.address(hexAddress, num, true);
        }
      }

      checkAddress(hexAddress)
        .then(() => {
          if (hexChecksumAddress) {
            trackEvent({
              category: ScanEvent.function.category,
              action: ScanEvent.function.action.addressConvert,
              label: hexChecksumAddress,
            });
          }

          setFormattedAddresses({
            hexAddress,
            hexChecksumAddress,
            bytes32MainnetAddress,
            bytes32MainnetAddressWithType,
            bytes32TestnetAddress,
            bytes32TestnetAddressWithType,
            bytes32NetAddress,
            bytes32NetAddressWithType,
          });
        })
        .catch(e => {
          setError(e.message);
          setFormattedAddresses(DEFAULT_FORMATTED_ADDRESSES);
        });
    } catch (e) {
      setError(e.message);
      setFormattedAddresses(DEFAULT_FORMATTED_ADDRESSES);
    }
  };

  const handleAddressChange = e => {
    setAddress(e.target.value.trim());
    setError('');
  };

  const handleNetworkIdChange = e => {
    let num = e.target.value.trim();
    if (num !== '' && Number(num) < 0) {
      return;
    } else {
      setNetworkId(num);
    }
    setError('');
  };

  useEffect(() => {
    if (address) {
      handleConvert();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const errorMessage = error
    ? `${ERROR_MESSAGE}: ${
        error.startsWith('addressConverter') ? t(error) : error
      }`
    : '';

  const WARNINGS = [
    t(translations.addressConverter.warnings.one),
    t(translations.addressConverter.warnings.two),
    t(translations.addressConverter.warnings.three),
    t(translations.addressConverter.warnings.four),
  ];

  return (
    <>
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
        <StyledColoredWrapper>
          <span className="title">
            {t(translations.addressConverter.warning)}
          </span>
          {WARNINGS.map((w, i) => (
            <span
              key={i}
              dangerouslySetInnerHTML={{
                __html: w,
              }}
            ></span>
          ))}
        </StyledColoredWrapper>
      </StyledSubtitleWrapper>
      <StyledInputWrapper>
        <div>
          <Input
            value={address}
            placeholder={
              [NETWORK_TYPES.mainnet, NETWORK_TYPES.testnet].includes(
                NETWORK_TYPE,
              )
                ? 'cfx:... / cfxtest:... / hex'
                : ''
            }
            size="small"
            variant="solid"
            className="convert-address-input input-address"
            onChange={handleAddressChange}
            onKeyPress={e => {
              if (e.key === 'Enter') {
                handleConvert();
              }
            }}
          ></Input>
          {address.startsWith('0x') && (
            <>
              <span className="input-spacer"></span>
              <Input
                type="number"
                min="0"
                size="small"
                variant="solid"
                className="convert-address-input input-network-id"
                value={networkId}
                placeholder={t(translations.addressConverter.networkId)}
                onChange={handleNetworkIdChange}
                onKeyPress={e => {
                  if (e.key === 'Enter') {
                    handleConvert();
                  }
                }}
              ></Input>
            </>
          )}
          <div className="convert-address-error">{errorMessage}</div>
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
          <List title={t(translations.addressConverter.newTestnetAddress)}>
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

          {formattedAddresses.bytes32NetAddress ? (
            <List title={t(translations.addressConverter.newCustomnetAddress)}>
              <div>
                {formattedAddresses.bytes32NetAddress}{' '}
                {formattedAddresses.bytes32NetAddress && (
                  <CopyButton copyText={formattedAddresses.bytes32NetAddress} />
                )}
              </div>
              <div>
                {formattedAddresses.bytes32NetAddressWithType}{' '}
                {formattedAddresses.bytes32NetAddressWithType && (
                  <CopyButton
                    copyText={formattedAddresses.bytes32NetAddressWithType}
                  />
                )}
              </div>
            </List>
          ) : null}
        </Card>
      </StyledResultWrapper>
      <StyledRemarkWrapper>
        <Remark
          items={[
            t(translations.addressConverter.tip1),
            t(translations.addressConverter.tip2),
            <span>
              {t(translations.addressConverter.tip3)}
              <Link
                target="_blank"
                href={t(translations.addressConverter.tip3Link)}
              >
                {t(translations.addressConverter.tip3end)}
              </Link>
            </span>,
            t(translations.addressConverter.tip4),
            <span className="warning">
              {t(translations.addressConverter.tip5)}
              <Link
                target="_blank"
                href={t(translations.addressConverter.tip5Link)}
              >
                {t(translations.addressConverter.tip5Middle)}
              </Link>
              {t(translations.addressConverter.tip5end)}
            </span>,
          ]}
        />
      </StyledRemarkWrapper>
    </>
  );
}

const StyledSubtitleWrapper = styled.div`
  color: #74798c;
  font-size: 1rem;
  line-height: 1.2857rem;
  margin: 1.1429rem 0 1.7143rem;
`;

const StyledInputWrapper = styled.div`
  display: flex;

  .input-container.convert-address-input {
    height: 2.2857rem;

    input {
      height: 2.2857rem;
      background: rgba(0, 84, 254, 0.04);
      border: 1px solid #ebeced;
      border-radius: 0.2857rem;
      margin: 0;
      padding: 0 1.1429rem;
    }

    &.input-address {
      input {
        width: 28.5714rem;

        ${media.s} {
          width: 100%;
        }
      }
    }

    &.input-network-id {
      input {
        width: 11.7143rem;
      }
    }
  }

  /* solve react-ui input margin issue */
  .input-spacer {
    width: 1.1429rem;
    display: inline-block;

    ${media.s} {
      display: block;
      width: 0;
      margin-top: 0.5714rem;
    }
  }

  .btn.convert-address-button {
    height: 2.2857rem;
    line-height: 2.2857rem;
    margin: 0 0 0 1.1429rem;
    border: none;

    & > div {
      top: 0;
    }
  }

  .convert-address-error {
    width: 28.5714rem;
    margin: 0.5714rem 0;
    font-size: 0.8571rem;
    color: #e64e4e;
    line-height: 1.1429rem;
    padding-left: 0.3571rem;

    ${media.s} {
      width: 100%;
    }
  }
`;
const StyledResultWrapper = styled.div`
  margin-top: 1.7143rem;

  .convert-address-description {
    flex-direction: row;

    .left {
      width: 35.7143rem;
    }
  }
`;
const StyledRemarkWrapper = styled.div`
  margin: 1.7143rem 0 2rem;

  .warning {
    color: #e64e4e;

    a {
      color: #e64e4e;
      text-decoration: underline;

      &:hover,
      &:active {
        color: #cb2b2b;
      }
    }
  }
`;

const StyledColoredWrapper = styled.div`
  color: #fa953c;
  line-height: 18px;
  margin-top: 5px;
  display: flex;
  align-items: flex-start;
  flex-direction: column;

  .title {
    margin-top: 1rem;
  }
`;
