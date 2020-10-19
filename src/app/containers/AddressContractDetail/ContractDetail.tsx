/**
 *
 * ContractDetail
 *
 */

import React, { memo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/macro';
import { Card } from '@cfxjs/react-ui';
import { TabsTablePanel } from '../../components/TabsTablePanel/Loadable';
import { media } from 'styles/media';
import { Text } from '@cfxjs/react-ui';
import { translations } from 'locales/i18n';
import { DetailPageCard } from './Loadable';
import { Description } from '../../components/Description/';
import { List } from '../../components/List/';
import { InfoImage } from './InfoImage';
import { HeadAddressLineButton } from './HeadAddressLineButton';
import { copyTextToClipboard } from 'utils/util';
import { CopyButton } from '../../components/CopyButton';
import { QrcodeButton } from '../../components/QrcodeButton';
import { IconButton } from './IconButton';

interface RouteParams {
  address: string;
}

interface Props {}

export const ContractDetail = memo((props: Props) => {
  const { t } = useTranslation();
  const { address } = useParams<RouteParams>();

  return (
    <>
      <Helmet>
        <title>ContractDetail</title>
        <meta name="description" content="Description of ContractDetail" />
      </Helmet>
      <Main>
        <Head>
          <Title>
            <Text>{t(translations.general.contract)}</Text>
          </Title>
          <HeadAddressLine>
            <Text>{address}</Text>
            <HeadAddressLineButton>
              <CopyButton
                copyText={address}
                size={8}
                className="address-icon"
              />
            </HeadAddressLineButton>
            <HeadAddressLineButton>
              <QrcodeButton value={address} size={8} className="address-icon" />
            </HeadAddressLineButton>
            <HeadAddressLineButton>
              <IconButton
                size={8}
                className="address-icon"
                url="http://www.baidu.com"
                tooltipText={t(translations.address.editContract)}
              >
                <path d="M880 1024h-736A144.128 144.128 0 0 1 0 880v-736C0 64.64 64.512 0.128 144 0h373.632a48 48 0 0 1 0 96H144a48 48 0 0 0-48 48v736c0 26.496 21.504 48 48 48h736a48 48 0 0 0 48-48V512A48 48 0 1 1 1024 512v368C1024 959.488 959.488 1023.872 880 1024zM517.632 560a48 48 0 0 1-34.176-81.664L941.696 14.336a48 48 0 1 1 68.48 67.456L551.68 545.792a47.872 47.872 0 0 1-34.176 14.208z" />
              </IconButton>
            </HeadAddressLineButton>
            <HeadAddressLineButton>
              <IconButton
                size={8}
                className="address-icon"
                url="www.baidu.com"
                tooltipText={t(translations.address.website)}
              >
                <path d="M827.505778 941.624889H196.494222C119.466667 941.624889 57.002667 879.047111 56.888889 802.019556V171.008C56.888889 93.980444 119.466667 31.516444 196.494222 31.402667h241.664a47.331556 47.331556 0 1 1 0 94.549333H196.494222a45.056 45.056 0 0 0-45.056 45.056v631.011556c0 24.917333 20.252444 45.056 45.056 45.056h631.011556a45.056 45.056 0 0 0 45.056-45.056V545.678222a47.331556 47.331556 0 0 1 94.549333 0V802.133333a139.719111 139.719111 0 0 1-139.605333 139.605334z" />
                <path d="M513.024 512.796444a43.235556 43.235556 0 0 1-30.492444-73.728L860.16 61.44a43.235556 43.235556 0 0 1 60.984889 61.098667L543.516444 500.167111a43.008 43.008 0 0 1-30.492444 12.515556z" />
                <path d="M924.103111 373.304889a43.235556 43.235556 0 0 1-43.235555-43.235556V112.867556H641.137778a43.235556 43.235556 0 0 1 0-86.243556H903.395556c35.271111 0 63.715556 28.672 63.829333 63.829333v239.843556c0 23.893333-19.342222 43.235556-43.235556 43.235555z" />
              </IconButton>
            </HeadAddressLineButton>
          </HeadAddressLine>
        </Head>
        <Top>
          <DetailPageCard
            title={t(translations.general.balance)}
            content={2630}
            icon={
              <InfoImage
                color="#0054FE"
                alt="balance"
                icon="/contract-address/balance.svg"
              />
            }
          />
          <DetailPageCard
            title={t(translations.general.token)}
            content={2630}
            icon={
              <InfoImage
                color="#16DBCC"
                alt="token"
                icon="/contract-address/token.svg"
              />
            }
          />
          <DetailPageCard
            title={t(translations.general.storageStaking)}
            content={2630}
            icon={
              <InfoImage
                color="#FFBB37"
                alt="storage staking"
                icon="/contract-address/balance.svg"
              />
            }
          />
          <DetailPageCard
            title={t(translations.general.nonce)}
            content={2630}
            icon={
              <InfoImage
                color="#FF82AC"
                alt="nonce"
                icon="/contract-address/nonce.svg"
              />
            }
          />
        </Top>
        <Middle>
          <List
            list={[
              {
                title: t(translations.general.balance),
                children: <span>2630</span>,
              },
              {
                title: t(translations.general.token),
                children: <span> fake token </span>,
              },
              {
                title: t(translations.general.storageStaking),
                children: <span>4572</span>,
              },
              {
                title: t(translations.general.nonce),
                children: <span>4572</span>,
              },
            ]}
          />
        </Middle>
        <Bottom>tabspanel</Bottom>
      </Main>
    </>
  );
});

const Main = styled.div`
  padding: 2.29rem 0;
  max-width: 73.1429rem;
  display: flex;
  flex-direction: column;
  margin-bottom: 4.57rem;
  ${media.s} {
    padding: 2rem 0;
  }
`;

const Head = styled.section`
  position: relative;
  width: 100%;
  border: 1px red solid;
  margin-bottom: 1.71rem;

  ${media.s} {
    margin-bottom: 1rem;
  }
`;
const Title = styled.div`
  font-size: 1.71rem;
  text-transform: capitalize;
  position: relative;
  width: 100%;
  border: 1px black solid;
  margin-bottom: 0.86rem;

  ${media.s} {
    margin-bottom: 1rem;
  }
`;
const HeadAddressLine = styled.div`
  color: #74798c;
  border: 1px black solid;
  display: flex;
  flex-direction: row;
  align-items: center;
  > p,
  > div {
    margin-right: 0.58rem;
  }
`;
const EditContractButton = styled.button``;
const Top = styled.section`
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: row;
  margin-bottom: 1.71rem;
  justify-content: space-between;

  ${media.s} {
    margin-bottom: 1rem;
  }
`;
const Middle = styled.section`
  border: 1px red solid;
  margin-bottom: 2.29rem;

  ${media.s} {
    margin-bottom: 2rem;
  }
`;
const Bottom = styled.section`
  position: relative;
  width: 100%;
  border: 1px red solid;
`;
