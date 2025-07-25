import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { PageHeader } from '@cfxjs/sirius-next-common/dist/components/PageHeader';
import styled from 'styled-components';
import { Card } from '@cfxjs/sirius-next-common/dist/components/Card';
import {
  reqContractCodeFormat,
  reqSolidityContractCompiler,
  reqVyperContractCompiler,
  reqContractLicense,
  reqContractVerification,
  reqEVMVersion,
} from 'utils/httpRequest';
import { StatusModal } from 'app/components/ConnectWallet/TxnStatusModal';
import { useLocation } from 'react-router-dom';
import querystring from 'query-string';
import { Step1 } from './Step1';
import { Step2, Step2SubmitData } from './Step2';

export const ContractVerification = () => {
  const { t } = useTranslation();
  const { search } = useLocation();
  const searchAddress = querystring.parse(search).address as string;
  const [contractDetails, setContractDetails] = useState<{
    address: string;
    codeFormat?: string;
    codeFormatLabel?: string;
    compiler?: string;
    compilerLabel?: string;
  }>({
    address: searchAddress,
  });
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [codeFormats, setCodeFormats] = useState<
    {
      key: string;
      value: string;
    }[]
  >([]);
  const [license, setLicense] = useState<Array<any>>([]);
  const [solidityCompilers, setSolidityCompilers] = useState<Array<any>>([]);
  const [vyperCompilers, setVyperCompilers] = useState<Array<any>>([]);
  const [versions, setVersions] = useState<Array<any>>([]);
  const [modalStatus, setModalStatus] = useState('loading');
  const [modalShow, setModalShow] = useState(false);
  const [respErrors, setRespErrors] = useState<Array<string>>([]);

  useEffect(() => {
    reqSolidityContractCompiler().then(resp => {
      setSolidityCompilers(
        Object.keys(resp).map(r => ({
          key: r,
          value: resp[r].replace(/soljson-|.js/g, ''),
        })),
      );
    });
    reqVyperContractCompiler().then(resp => {
      setVyperCompilers(
        Object.keys(resp).map(r => ({
          key: r,
          value: resp[r],
        })),
      );
    });

    reqContractCodeFormat().then(resp => {
      setCodeFormats(
        resp.map(r => ({
          key: r.code,
          value: r.desc,
        })),
      );
    });

    reqContractLicense().then(resp => {
      setLicense(
        Object.keys(resp).map(r => ({
          key: r,
          value: resp[r],
        })),
      );
    });

    reqEVMVersion().then(resp => {
      setVersions(
        [
          {
            key: 'default',
            value: ' ',
          },
        ].concat(
          resp.map(r => ({
            key: r,
            value: r,
          })),
        ),
      );
    });
  }, []);

  const onFinish = (data: Step2SubmitData) => {
    const payload: {
      address: string;
      codeFormat: string;
      compiler: string;
      name: string;
      sourceCode: string;
      license: string;
      optimizeRuns?: number;
      evmVersion?: string;
    } = {
      address: contractDetails.address,
      codeFormat: contractDetails.codeFormat!,
      compiler: contractDetails.compiler!,
      name: data.name,
      sourceCode: data.sourceCode,
      license: data.license,
    };

    if (data.optimization === 'yes') {
      payload.optimizeRuns = Number(data.runs);
    }

    payload.evmVersion = data.evmVersion.trim();

    data.library?.forEach(l => {
      if (l.name && l.address) {
        payload[`libraryName${l.key}`] = l.name;
        payload[`libraryAddress${l.key}`] = l.address;
      }
    });

    setModalStatus('loading');
    setModalShow(true);
    setLoading(true);
    setRespErrors([]);

    reqContractVerification(payload)
      .then(resp => {
        if (resp.exactMatch) {
          setModalStatus('success');
        } else {
          setModalStatus('error');
          if (resp.errors?.length) {
            setRespErrors(resp.errors);
          } else {
            // bytecode not match
            setRespErrors([
              t(translations.contractVerification.error.notMatch),
            ]);
          }
        }
      })
      .catch(e => {
        setModalStatus('error');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onStatusModalClose = () => {
    setModalShow(false);
  };

  return (
    <StyledContractVerificationWrapper>
      <Helmet>
        <title>{t(translations.contractVerification.title)}</title>
        <meta
          name="description"
          content={t(translations.contractVerification.description)}
        />
      </Helmet>
      <StatusModal
        status={modalStatus}
        show={modalShow}
        onClose={onStatusModalClose}
        loadingText={t(translations.contractVerification.status.loading)}
        successText={t(translations.contractVerification.status.success)}
        errorText={t(translations.contractVerification.status.error)}
      />
      <PageHeader>{t(translations.contractVerification.title)}</PageHeader>
      <Card className="contract-verification-form-container">
        {step === 1 && (
          <Step1
            loading={loading}
            solidityCompilers={solidityCompilers}
            vyperCompilers={vyperCompilers}
            codeFormats={codeFormats}
            initialValues={{
              address: contractDetails.address,
              codeFormat: contractDetails.codeFormat,
              compiler: contractDetails.compiler,
            }}
            onNext={data => {
              setContractDetails(d => ({ ...d, ...data }));
              setStep(2);
            }}
          />
        )}
        {step === 2 && (
          <Step2
            license={license}
            versions={versions}
            respErrors={respErrors}
            contractDetails={contractDetails}
            loading={loading}
            onSubmit={onFinish}
            onBack={() => {
              setStep(1);
              setContractDetails({
                address: searchAddress,
              });
            }}
          />
        )}
      </Card>
    </StyledContractVerificationWrapper>
  );
};

const StyledContractVerificationWrapper = styled.div`
  div.card.contract-verification-form-container {
    padding: 0.8571rem 1.4286rem 1.2857rem 1.4286rem;
    .form-title {
      font-size: 1.2857rem;
      font-weight: 500;
      line-height: 1.2857rem;
      margin-bottom: 1.7143rem;
    }
    .submit-button {
      display: flex;
      align-items: center;
      gap: 0.2rem;
      svg {
        width: 1rem;
        height: 1rem;
      }
    }
  }

  .link-and-fullscreen {
    position: absolute;
    right: 0;
    top: -2rem;
    display: flex;
    align-items: center;
    justify-content: center;

    .link {
      color: var(--theme-color-blue2);
      font-weight: 500;
      line-height: 1.2857rem;
      text-align: right;
      text-decoration: underline;
      cursor: pointer;
    }
  }

  .errors-container {
    color: #e64e4e;
    margin-bottom: 0.7143rem;
    margin-top: -0.7143rem;

    .error-item {
      font-size: 12px;
      line-height: 1.2;
    }
  }

  .collapse-body {
    border-bottom: none !important;
    margin-top: -12px;

    .ant-collapse-header {
      background-color: #ffffff;

      & > span {
        margin-left: -1rem !important;
      }
    }

    .ant-collapse-content-box {
      padding-top: 16px !important;
    }

    .ant-collapse-arrow {
      float: right;
      margin-right: -1rem !important;
      color: var(--theme-color-blue2);
      text-decoration: underline;
      font-weight: 500;
    }
  }
`;
