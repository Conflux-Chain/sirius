import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { Button, Modal, Textarea } from '@cfxjs/react-ui';
import styled from 'styled-components/macro';
import { translations } from '../../../locales/i18n';
import { PageHeader } from '../../components/PageHeader';
import { media } from '../../../styles/media';
import imgWarning from '../../../images/warning.png';
import { Card } from '../../components/Card/Loadable';
import { cfx } from '../../../utils/cfx';
import imgSuccessBig from '../../../images/success_big.png';
import { getEllipsStr } from '../../../utils';

export function BroadcastTx() {
  const { t } = useTranslation();
  const [error, setError] = useState<string>();
  const [value, setValue] = useState('0x');
  const [txHash, setTxHash] = useState('');
  const [loading, setLoading] = useState<boolean>(false);
  const [modalShown, setModalShown] = useState<boolean>(false);

  const handleConvert = async () => {
    setLoading(true);
    setError('');
    try {
      const txHash = await cfx.sendRawTransaction(value);
      setTxHash(txHash);
      setModalShown(true);
    } catch (e) {
      console.error(e);
      setError(e.message || 'unknown');
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyledPageWrapper>
      <Helmet>
        <title>{t(translations.header.broadcastTx)}</title>
        <meta
          name="description"
          content={t(translations.metadata.description)}
        />
      </Helmet>
      <PageHeader>{t(translations.broadcastTx.title)}</PageHeader>
      <StyledSubtitleWrapper>
        {t(translations.broadcastTx.subtitle)}
      </StyledSubtitleWrapper>
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

        <Modal
          closable
          open={modalShown}
          onClose={() => setModalShown(false)}
          wrapClassName="dappButtonModalContainer"
        >
          <Modal.Content className="contentContainer">
            <>
              <img src={imgSuccessBig} alt="success" className="statusImg" />
              <div className="submitted">
                {t(translations.broadcastTx.success)}.
              </div>
              <div className="txContainer">
                <span className="label">
                  {t(translations.sponsor.txHash)}:{' '}
                </span>
                <a
                  href={`/transaction/${txHash}`}
                  target="_blank"
                  className="content"
                  rel="noopener noreferrer"
                >
                  {getEllipsStr(txHash, 8, 0)}
                </a>
              </div>
            </>
          </Modal.Content>
        </Modal>
      </StyledInputWrapper>
    </StyledPageWrapper>
  );
}

const StyledPageWrapper = styled.div`
  max-width: 73.1429rem;
  margin: 0 auto;
  padding-top: 2.2857rem;

  ${media.s} {
    margin-top: 16px;
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
