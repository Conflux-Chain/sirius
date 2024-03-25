import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { Button, Textarea } from '@cfxjs/react-ui';
import styled from 'styled-components';
import { translations } from 'locales/i18n';
import { PageHeader } from 'app/components/PageHeader';
import imgWarning from 'images/warning.png';
import { Card } from 'sirius-next/packages/common/dist/components/Card';
import { trackEvent } from 'utils/ga';
import { ScanEvent } from 'utils/gaConstants';
import { TxnStatusModal } from 'app/components/ConnectWallet/TxnStatusModal';
import { sendRawTransaction } from 'utils/rpcRequest';

export function BroadcastTx() {
  const { t } = useTranslation();
  const [error, setError] = useState<string>();
  const [value, setValue] = useState('0x');
  const [txHash, setTxHash] = useState('');
  const [loading, setLoading] = useState<boolean>(false);
  const [modalShow, setModalShow] = useState<boolean>(false);

  const handleConvert = async () => {
    setLoading(true);
    setError('');
    try {
      const txHash = await sendRawTransaction(value);
      setTxHash(txHash);
      setModalShow(true);
      trackEvent({
        category: ScanEvent.function.category,
        action: ScanEvent.function.action.broadcastTx,
        label: 'success',
      });
    } catch (e) {
      console.error(e);
      setError(e.message || 'unknown');
      trackEvent({
        category: ScanEvent.function.category,
        action: ScanEvent.function.action.broadcastTx,
        label: 'failure',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>{t(translations.header.broadcastTx)}</title>
        <meta
          name="description"
          content={t(translations.metadata.description)}
        />
      </Helmet>
      <PageHeader subtitle={t(translations.broadcastTx.subtitle)}>
        {t(translations.broadcastTx.title)}
      </PageHeader>
      <StyledInputWrapper>
        <Card className="input-card">
          {/*
            // @ts-ignore */}
          <Textarea value={value} onChange={e => setValue(e.target.value)} />
        </Card>
        <div>
          <Button
            variant="solid"
            color="primary"
            size="small"
            className="button"
            disabled={!(value && value.indexOf('0x') === 0)}
            loading={loading}
            onClick={handleConvert}
          >
            {t(translations.broadcastTx.broadcastBtn)}
          </Button>
        </div>
        {error ? (
          <div className={`warningContainer`}>
            <img src={imgWarning} alt="warning" className="warningImg" />
            <span className="text">
              {t(translations.broadcastTx.error)}
              {error === 'unknown'
                ? t(translations.broadcastTx.unknownError)
                : error}
            </span>
          </div>
        ) : null}

        <TxnStatusModal
          show={modalShow}
          onClose={() => setModalShow(false)}
          hash={txHash}
        />
      </StyledInputWrapper>
    </>
  );
}

const StyledInputWrapper = styled.div`
  display: block;

  .input-card {
    padding: 24px 18px !important;

    .wrapper {
      width: 100%;
      border: none;
      border-radius: 0;
      border-top: 1px solid #e8e9ea;
      background: #fafbfc !important;
    }

    textarea {
      font-size: 1rem;
      min-height: 200px;
    }
  }

  .btn.button {
    height: 2.2857rem;
    line-height: 2.2857rem;
    margin: 24px 0 0;
    border: none;

    & > div {
      top: 0;
    }
  }

  .warningContainer {
    margin-top: 0.5714rem;
    display: flex;
    align-items: center;
    .warningImg {
      width: 1rem;
    }
    .text {
      margin-left: 0.5714rem;
      font-size: 1rem;
      color: #ffa500;
    }
  }
`;
