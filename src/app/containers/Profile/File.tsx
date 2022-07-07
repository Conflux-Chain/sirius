import React, { createRef } from 'react';
import { FileUpload } from 'app/components/FileUpload';
import { LOCALSTORAGE_KEYS_MAP } from 'utils/constants';
import { useGlobalData } from 'utils/hooks/useGlobal';
import lodash from 'lodash';
import { InfoIconWithTooltip } from 'app/components/InfoIconWithTooltip/Loadable';
import styled from 'styled-components/macro';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { message } from '@cfxjs/antd';

interface Props {
  onLoading?: (loading: boolean) => void;
}
export const File = ({ onLoading = () => {} }: Props) => {
  const [globalData, setGlobalData] = useGlobalData();
  const inputRef = createRef<any>();
  const { t } = useTranslation();

  const handleImport = () => {
    inputRef.current.click();
  };

  const handleFileChange = file => {
    try {
      onLoading(true);

      let { txPrivateNotes, addressNameTags } = JSON.parse(file);

      if (addressNameTags !== null && addressNameTags.length > 0) {
        const oldTags = localStorage.getItem(
          LOCALSTORAGE_KEYS_MAP.addressLabel,
        );
        const oldList = oldTags ? JSON.parse(oldTags) : [];

        // New imports have higher priority
        const tags = lodash
          .unionBy(addressNameTags, oldList, 'a')
          .sort((a, b) => b.u - a.u);

        localStorage.setItem(
          LOCALSTORAGE_KEYS_MAP.addressLabel,
          JSON.stringify(tags),
        );
        setGlobalData({
          ...globalData,
          [LOCALSTORAGE_KEYS_MAP.addressLabel]: tags.reduce((prev, curr) => {
            return {
              ...prev,
              [curr.a]: curr.l,
            };
          }, {}),
        });

        message.info(
          t(translations.profile.file.import.address, {
            amount: tags.length - oldList.length,
          }),
        );
      }

      if (txPrivateNotes !== null && txPrivateNotes.length > 0) {
        const oldNotes = localStorage.getItem(
          LOCALSTORAGE_KEYS_MAP.txPrivateNote,
        );
        const oldList = oldNotes ? JSON.parse(oldNotes) : [];
        // New imports have higher priority
        const notes = lodash
          .unionBy(txPrivateNotes, oldList, 'h')
          .sort((a, b) => b.u - a.u);

        localStorage.setItem(
          LOCALSTORAGE_KEYS_MAP.txPrivateNote,
          JSON.stringify(notes),
        );
        setGlobalData({
          ...globalData,
          [LOCALSTORAGE_KEYS_MAP.txPrivateNote]: notes.reduce((prev, curr) => {
            return {
              ...prev,
              [curr.h]: curr.n,
            };
          }, {}),
        });

        message.info(
          t(translations.profile.file.import.tx, {
            amount: notes.length - oldList.length,
          }),
        );
      }
    } catch (e) {
      console.log(e);
      message.error(t(translations.profile.file.error.invalid));
    }

    onLoading(false);
  };

  const handleFileError = () => {
    message.error(t(translations.profile.file.error.invalid));
  };

  const handleExport = () => {
    onLoading(true);

    try {
      const notes = localStorage.getItem(LOCALSTORAGE_KEYS_MAP.txPrivateNote);
      const tags = localStorage.getItem(LOCALSTORAGE_KEYS_MAP.addressLabel);
      const data = {
        txPrivateNotes: notes ? JSON.parse(notes) : null,
        addressNameTags: tags ? JSON.parse(tags) : null,
      };
      const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
        JSON.stringify(data),
      )}`;

      const link = document.createElement('a');
      link.href = jsonString;
      link.download = 'data.json';
      link.click();
    } catch (e) {
      message.error(t(translations.profile.file.export.failed));
    }

    message.info(t(translations.profile.file.export.complete));

    onLoading(false);
  };

  return (
    <div>
      <FileUpload
        accept=".json"
        ref={inputRef}
        onChange={handleFileChange}
        onError={handleFileError}
      />
      <StyledFileManagementWrapper>
        <InfoIconWithTooltip info={t(translations.profile.file.import.tip)}>
          <span className="button" onClick={handleImport}>
            {t(translations.profile.file.import.button)}
          </span>
        </InfoIconWithTooltip>
        <span> / </span>
        <InfoIconWithTooltip info={t(translations.profile.file.export.tip)}>
          <span className="button" onClick={handleExport}>
            {t(translations.profile.file.export.button)}
          </span>
        </InfoIconWithTooltip>
      </StyledFileManagementWrapper>
    </div>
  );
};

const StyledFileManagementWrapper = styled.div`
  margin-top: 100px;
  text-align: right;

  .button {
    color: #1e3de4;
    cursor: pointer;

    &:hover {
      color: #0f23bd;
    }
  }
`;
