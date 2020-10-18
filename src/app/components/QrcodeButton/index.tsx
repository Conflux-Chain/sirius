/**
 *
 * QrcodeButton
 *
 */
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
// import styled from 'styled-components/macro';
import QRCode from 'qrcode.react';
import { Modal } from '@cfxjs/react-ui';
import { Tooltip } from '../Tooltip';
import { translations } from 'locales/i18n';

interface QrcodeButtonProps {
  value: string;
  tooltipText?: string;
  title?: string;
}

export const QrcodeButton = ({
  value,
  tooltipText,
  title,
}: QrcodeButtonProps) => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const handleClick = () => {
    setVisible(true);
  };
  const handleClose = () => {
    setVisible(false);
  };

  return (
    <>
      <Tooltip
        placement="top"
        text={tooltipText || t(translations.general.qrcodeButton.clickToShow)}
      >
        <div
          onClick={handleClick}
          style={{
            cursor: 'pointer',
          }}
        >
          <img alt="qrcode" src="/qrcode.svg" />
        </div>
      </Tooltip>
      <Modal
        wrapClassName="qrcode-modal"
        width="20rem"
        open={visible}
        onClose={handleClose}
      >
        <Modal.Title>{title}</Modal.Title>
        <Modal.Content>
          <QRCode size={200} value={value} />
        </Modal.Content>
      </Modal>
    </>
  );
};
