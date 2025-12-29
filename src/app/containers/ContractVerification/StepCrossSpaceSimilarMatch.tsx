import React, { Fragment, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { Button, Checkbox } from '@cfxjs/antd';
import { Remark } from '@cfxjs/sirius-next-common/dist/components/Remark';
import { Link } from '@cfxjs/sirius-next-common/dist/components/Link';
import { ReactComponent as ChevronLeftIcon } from 'images/chevron-left.svg';
import { StyledButtonWrapper, StyledContentWrapper } from './StyledComponents';
import { IS_MAINNET } from 'env';
import imgSuccess from 'images/success.svg';

export interface StepCrossSpaceSimilarMatchSubmitData {
  address: string;
  includeAllOtherSpace: boolean;
}

export const StepCrossSpaceSimilarMatch: React.FC<{
  contractDetails: {
    address: string;
  };
  modalStatus?: string;
  respErrors: string[];
  loading: boolean;
  onSubmit: (data: StepCrossSpaceSimilarMatchSubmitData) => void;
  onBack: () => void;
}> = ({
  contractDetails,
  modalStatus,
  respErrors,
  onSubmit,
  loading,
  onBack,
}) => {
  const { t } = useTranslation();
  const [includeAllOtherSpace, setIncludeAllOtherSpace] = useState(false);

  const onFinish = () => {
    onSubmit({
      address: contractDetails.address,
      includeAllOtherSpace,
    });
  };

  if (modalStatus === 'success') {
    return (
      <StyledContentWrapper
        className="center"
        style={{ minHeight: '400px', flexDirection: 'column' }}
      >
        <StyledContentWrapper
          className="center"
          style={{ marginBottom: '24px' }}
        >
          <img
            src={imgSuccess}
            alt="success"
            style={{ width: '56px', height: '56px' }}
          />
        </StyledContentWrapper>
        <StyledContentWrapper
          className="center"
          style={{ marginBottom: '8px' }}
        >
          <Trans
            i18nKey={translations.contractVerification.similarMatch.verified}
            values={{
              address: contractDetails.address,
            }}
          >
            The Contract Source code for
            <pre style={{ color: '#282D30', fontWeight: '500' }}>address</pre>
            has already been verified.
          </Trans>
        </StyledContentWrapper>
        <StyledContentWrapper className="center">
          <Trans
            i18nKey={translations.contractVerification.similarMatch.viewLink}
          >
            Click here to view the
            <Link
              href={`/address/${contractDetails.address}?tab=contract-viewer`}
              style={{ whiteSpace: 'pre' }}
            >
              Verified Contract Source Code
            </Link>
          </Trans>
        </StyledContentWrapper>
      </StyledContentWrapper>
    );
  }

  return (
    <>
      {respErrors.length ? (
        <StyledContentWrapper
          className="error"
          style={{
            marginBottom: '16px',
          }}
        >
          {respErrors.map((e, index) => {
            if (e === 'contract_not_deployed') {
              return (
                <Fragment key={index}>
                  <div className="error-item">
                    <Trans
                      i18nKey={
                        translations.contractVerification.similarMatch.errors
                          .notContract
                      }
                      values={{
                        address: contractDetails.address,
                      }}
                    >
                      Error! Unable to locate Contract Code at
                      <Link href={`/address/${contractDetails.address}`}>
                        address
                      </Link>
                    </Trans>
                  </div>
                  <div className="error-item">
                    {t(
                      translations.contractVerification.similarMatch.errors
                        .askIsContract,
                    )}
                  </div>
                </Fragment>
              );
            }
            if (e === 'no_similar_match_found') {
              return (
                <Fragment key={index}>
                  <div className="error-item">
                    {t(
                      translations.contractVerification.similarMatch.errors
                        .verifyFailed,
                    )}
                  </div>
                  <div className="error-item">
                    {t(
                      translations.contractVerification.similarMatch.errors
                        .noSimilarMatchFound,
                    )}
                  </div>
                </Fragment>
              );
            }
            return <div className="error-item">{e}</div>;
          })}
        </StyledContentWrapper>
      ) : null}
      <div className="form-title">
        {t(translations.contractVerification.stepTitle.stepSimilarMatch)}
      </div>
      <Remark
        items={[
          t(translations.contractVerification.similarMatch.tip1),
          t(translations.contractVerification.similarMatch.tip2),
        ]}
        hideTitle
      />
      <StyledContentWrapper
        className="content-box center"
        style={{ marginTop: '48px', marginBottom: '12px' }}
      >
        <div className="content-label">
          {t(translations.contractVerification.contractAddress)}:
        </div>
        <div className="content-value">
          <Link href={`/address/${contractDetails.address}`}>
            {contractDetails.address}
          </Link>
        </div>
      </StyledContentWrapper>
      <StyledContentWrapper className="center" style={{ marginBottom: '48px' }}>
        <Checkbox
          id="includeAllOtherSpace"
          checked={includeAllOtherSpace}
          onChange={e => setIncludeAllOtherSpace(e.target.checked)}
          style={{ marginRight: '8px' }}
        />
        <label htmlFor="includeAllOtherSpace" style={{ cursor: 'pointer' }}>
          {t(
            translations.contractVerification.similarMatch[
              IS_MAINNET ? 'includeTestnet' : 'includeMainnet'
            ],
          )}
        </label>
      </StyledContentWrapper>
      <StyledButtonWrapper>
        <Button type="default" className="submit-button" onClick={onBack}>
          <ChevronLeftIcon />
          {t(translations.contractVerification.button.previous)}
        </Button>
        <Button
          type="primary"
          loading={loading}
          className="submit-button"
          onClick={onFinish}
        >
          {t(translations.report.submit)}
        </Button>
      </StyledButtonWrapper>
    </>
  );
};
