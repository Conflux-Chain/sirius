import React, { useState } from 'react';
import styled from 'styled-components/macro';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { Link } from 'app/components/Link';
import { Modal } from '@cfxjs/react-ui';
import ReCAPTCHA from 'react-google-recaptcha';
import iconInfo from 'images/info.svg';
import { Tooltip } from 'app/components/Tooltip/Loadable';

export const DownloadCSV = ({ url }) => {
  const { t, i18n } = useTranslation();
  const [recaptchaVisible, setRecaptchaVisible] = useState(false);

  const handleRecaptchaModalClose = () => setRecaptchaVisible(false);
  const onRecaptchaChange = value => {
    if (value) {
      // download csv file
      window.open(url);
      // close google recaptcha
      setRecaptchaVisible(false);
    }
  };
  const handleDownloadCSV = e => {
    e.preventDefault();
    setRecaptchaVisible(true);
  };

  return (
    <StyledDownloadCSVWrapper>
      <Tooltip
        className="download-csv-tooltip"
        text={t(translations.general.downloadCSV.latest5000records)}
        placement="top"
      >
        <IconWrapper>
          <img src={iconInfo} alt="warning-icon" className="img"></img>
        </IconWrapper>
      </Tooltip>
      <span>{t(translations.general.downloadCSV.download)} </span>
      <Link onClick={handleDownloadCSV}>
        {t(translations.general.downloadCSV.csvFile)}
      </Link>
      <Modal
        open={recaptchaVisible}
        onClose={handleRecaptchaModalClose}
        closable
        width={'26.0714rem'}
      >
        <ReCAPTCHA
          sitekey="6Ldmm8gaAAAAABt8eZ-CvVw7nKKYg7gD1T1J5Pl6"
          onChange={onRecaptchaChange}
          hl={i18n.language.indexOf('en') > -1 ? 'en' : 'zh'}
        />
      </Modal>
    </StyledDownloadCSVWrapper>
  );
};

const StyledDownloadCSVWrapper = styled.div`
  text-align: right;

  .tooltip.download-csv-tooltip + .tooltip-content {
    div.tooltip-arrow {
      left: -0.8571rem !important;
    }
  }
`;

const IconWrapper = styled.div`
  padding-right: 0.2857rem;
  width: 1.2857rem;
  cursor: pointer;
`;
