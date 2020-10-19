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
              <CopyButton copyText={address} size={8} />
            </HeadAddressLineButton>
            <HeadAddressLineButton>
              <QrcodeButton value={address} />
            </HeadAddressLineButton>
            <HeadAddressLineButton>
              <div onClick={() => {}}>
                <img src="/edit.svg" />
              </div>
            </HeadAddressLineButton>
            <HeadAddressLineButton>
              <div onClick={() => {}}>
                <img src="/share.svg" />
              </div>
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
