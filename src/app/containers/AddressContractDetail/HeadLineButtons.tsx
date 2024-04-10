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
        url={`/contract-info/${address}`}
        tooltipText={t(translations.general.address.editContract)}
      >
        <path d="M880 1024h-736A144.128 144.128 0 0 1 0 880v-736C0 64.64 64.512 0.128 144 0h373.632a48 48 0 0 1 0 96H144a48 48 0 0 0-48 48v736c0 26.496 21.504 48 48 48h736a48 48 0 0 0 48-48V512A48 48 0 1 1 1024 512v368C1024 959.488 959.488 1023.872 880 1024zM517.632 560a48 48 0 0 1-34.176-81.664L941.696 14.336a48 48 0 1 1 68.48 67.456L551.68 545.792a47.872 47.872 0 0 1-34.176 14.208z" />
      </IconButton>
    </HeadAddressLineButton>
  );
}

export function Jump({ onClick = () => {} }) {
  const { t } = useTranslation();

  return (
    <HeadAddressLineButton>
      <IconButton
        size={8}
        className="address-line-icon"
        tooltipText={t(translations.general.address.website)}
        onClick={onClick}
      >
        <path d="M827.505778 941.624889H196.494222C119.466667 941.624889 57.002667 879.047111 56.888889 802.019556V171.008C56.888889 93.980444 119.466667 31.516444 196.494222 31.402667h241.664a47.331556 47.331556 0 1 1 0 94.549333H196.494222a45.056 45.056 0 0 0-45.056 45.056v631.011556c0 24.917333 20.252444 45.056 45.056 45.056h631.011556a45.056 45.056 0 0 0 45.056-45.056V545.678222a47.331556 47.331556 0 0 1 94.549333 0V802.133333a139.719111 139.719111 0 0 1-139.605333 139.605334z" />
        <path d="M513.024 512.796444a43.235556 43.235556 0 0 1-30.492444-73.728L860.16 61.44a43.235556 43.235556 0 0 1 60.984889 61.098667L543.516444 500.167111a43.008 43.008 0 0 1-30.492444 12.515556z" />
        <path d="M924.103111 373.304889a43.235556 43.235556 0 0 1-43.235555-43.235556V112.867556H641.137778a43.235556 43.235556 0 0 1 0-86.243556H903.395556c35.271111 0 63.715556 28.672 63.829333 63.829333v239.843556c0 23.893333-19.342222 43.235556-43.235556 43.235555z" />
      </IconButton>
    </HeadAddressLineButton>
  );
}

export function Apply({ address = '' } = {}) {
  const { t } = useTranslation();

  return (
    <HeadAddressLineButton>
      <IconButton
        url={`/sponsor/${address}`}
        className="address-line-icon"
        size={16}
        viewBox="0 0 16 16"
        tooltipText={t(translations.contractDetail.clickToApply)}
      >
        <path
          transform="translate(8.500000, 8.500000) scale(1, -1) translate(-8.500000, -8.500000) translate(4.000000, 4.000000)"
          d="M4.0439812,1.00025396 C4.25108145,1.00025396 4.41896992,1.16814244 4.41896992,1.37524268 C4.41896993,1.58234292 4.25108145,1.7502314 4.0439812,1.7502314 L1.12496217,1.7502314 C0.917947088,1.75043811 0.750180486,1.91820503 0.749973455,2.12522012 L0.749973447,7.87503885 C0.750175592,8.08205393 0.917939267,8.24982444 1.12495357,8.25003538 L6.8747806,8.25003538 C7.08179568,8.24982866 7.24956228,8.08206174 7.24976931,7.87504666 L7.24976931,5.00013712 C7.24976928,4.79303688 7.41765701,4.6251484 7.62475803,4.6251484 C7.80597074,4.62514838 7.95716196,4.75368741 7.99212832,4.92456368 L7.99974677,5.00013712 L7.99974677,5.00013712 L7.99974677,7.87502708 C7.99906873,8.49604265 7.4958165,8.99930964 6.87480015,9.00001277 L1.12496222,9.00001277 C0.503946654,8.99932042 0.000687475014,8.4960595 -4.73446562e-08,7.87504706 L-4.73446562e-08,2.12523965 C0.000678021413,1.50422408 0.503930227,1.00095709 1.12494657,1.00025396 L4.0439812,1.00025396 Z M5.79405242,0.943371 C6.00119517,0.942077214 6.17016571,1.10895022 6.17145948,1.316093 L6.18299995,2.78736353 L7.657221,2.77542512 C7.8643637,2.77413134 8.03333424,2.94100487 8.034628,3.14814764 C8.03592179,3.3552904 7.86904878,3.52426094 7.661906,3.5255547 L6.18999995,3.53736353 L6.20265508,5.011262 C6.20336694,5.11156232 6.16378626,5.20795006 6.09279298,5.27880588 C5.94641885,5.42531675 5.70898901,5.42542983 5.56247659,5.27905828 C5.49260784,5.20925559 5.45309715,5.1147075 5.4525255,5.015946 L5.43999995,3.54436353 L3.966737,3.5567503 C3.86643668,3.55746216 3.77004794,3.51788148 3.69919249,3.44688783 C3.55268125,3.30051407 3.55256917,3.06308423 3.69894082,2.91657191 C3.76874341,2.84670307 3.8632915,2.80719238 3.962053,2.80662072 L5.43299995,2.79436353 L5.4213299,1.320778 C5.42003612,1.1136353 5.58690964,0.944664764 5.79405242,0.943371 Z"
        ></path>
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
