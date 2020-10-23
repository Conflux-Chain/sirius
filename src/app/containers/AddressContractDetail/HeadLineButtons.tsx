import React from 'react';
import styled from 'styled-components';
import { CopyButton } from '../../components/CopyButton';
import { QrcodeButton } from '../../components/QrcodeButton';
import { IconButton } from './IconButton';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';

export function Copy({ address = '' } = {}) {
  return (
    <HeadAddressLineButton>
      <CopyButton copyText={address} size={8} className="address-line-icon" />
    </HeadAddressLineButton>
  );
}

export function Qrcode({ address = '' } = {}) {
  return (
    <HeadAddressLineButton>
      <QrcodeButton value={address} size={8} className="address-line-icon" />
    </HeadAddressLineButton>
  );
}

export function Edit({ address = '' } = {}) {
  const { t } = useTranslation();
  return (
    <HeadAddressLineButton>
      <IconButton
        size={8}
        className="address-line-icon"
        url={`/contract/${address}`}
        tooltipText={t(translations.general.address.editContract)}
      >
        <path d="M880 1024h-736A144.128 144.128 0 0 1 0 880v-736C0 64.64 64.512 0.128 144 0h373.632a48 48 0 0 1 0 96H144a48 48 0 0 0-48 48v736c0 26.496 21.504 48 48 48h736a48 48 0 0 0 48-48V512A48 48 0 1 1 1024 512v368C1024 959.488 959.488 1023.872 880 1024zM517.632 560a48 48 0 0 1-34.176-81.664L941.696 14.336a48 48 0 1 1 68.48 67.456L551.68 545.792a47.872 47.872 0 0 1-34.176 14.208z" />
      </IconButton>
    </HeadAddressLineButton>
  );
}

export function Jump({ url = '' } = {}) {
  const { t } = useTranslation();

  return (
    <HeadAddressLineButton>
      <IconButton
        size={8}
        className="address-line-icon"
        url={url}
        tooltipText={t(translations.general.address.website)}
      >
        <path d="M827.505778 941.624889H196.494222C119.466667 941.624889 57.002667 879.047111 56.888889 802.019556V171.008C56.888889 93.980444 119.466667 31.516444 196.494222 31.402667h241.664a47.331556 47.331556 0 1 1 0 94.549333H196.494222a45.056 45.056 0 0 0-45.056 45.056v631.011556c0 24.917333 20.252444 45.056 45.056 45.056h631.011556a45.056 45.056 0 0 0 45.056-45.056V545.678222a47.331556 47.331556 0 0 1 94.549333 0V802.133333a139.719111 139.719111 0 0 1-139.605333 139.605334z" />
        <path d="M513.024 512.796444a43.235556 43.235556 0 0 1-30.492444-73.728L860.16 61.44a43.235556 43.235556 0 0 1 60.984889 61.098667L543.516444 500.167111a43.008 43.008 0 0 1-30.492444 12.515556z" />
        <path d="M924.103111 373.304889a43.235556 43.235556 0 0 1-43.235555-43.235556V112.867556H641.137778a43.235556 43.235556 0 0 1 0-86.243556H903.395556c35.271111 0 63.715556 28.672 63.829333 63.829333v239.843556c0 23.893333-19.342222 43.235556-43.235556 43.235555z" />
      </IconButton>
    </HeadAddressLineButton>
  );
}

const HeadAddressLineButton = styled.div`
  width: 1.15rem;
  height: 1.15rem;
  border-radius: 50%;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  background-color: #dbdde4;
  line-height: 12px;
  .address-line-icon {
    path {
      fill: #737682;
    }
  }
  &:hover {
    background-color: #63688a;
    .address-line-icon {
      path {
        fill: #fff;
      }
    }
  }
`;
