import React, { useRef } from 'react';
import { FileUpload } from 'sirius-next/packages/common/dist/components/FileUpload';
import { NETWORK_ID } from 'utils/constants';
import { useGlobalData } from 'utils/hooks/useGlobal';
import lodash from 'lodash';
import { InfoIconWithTooltip } from 'sirius-next/packages/common/dist/components/InfoIconWithTooltip';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { message } from '@cfxjs/antd';
import MD5 from 'md5.js';
import { LOCALSTORAGE_KEYS_MAP } from 'utils/enum';

interface Props {
  onLoading?: (loading: boolean) => void;
}
export const File = ({ onLoading = () => {} }: Props) => {
  const [globalData, setGlobalData] = useGlobalData();
  const inputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation();

  const handleImport = () => {
    inputRef.current?.click();
  };

  const handleFileChange = file => {
    try {
      onLoading(true);

      const { data, key } = JSON.parse(file);

      if (new MD5().update(JSON.stringify(data)).digest('hex') !== key) {
        message.error(t(translations.profile.file.error.fileChanged));
        onLoading(false);
        return;
      }

      const { chainId, txPrivateNotes, addressNameTags } = data;

      if (chainId && chainId !== NETWORK_ID) {
        message.error(
          t(translations.profile.file.error.chainIdError, {
            chainId: NETWORK_ID,
          }),
        );
        onLoading(false);
        return;
      }

      if (addressNameTags !== null && addressNameTags.length > 0) {
        const oldTags = localStorage.getItem(
          LOCALSTORAGE_KEYS_MAP.addressLabel,
        );
        const oldList = oldTags ? JSON.parse(oldTags) : [];

        let updateAmount = 0;
        // New imports have higher priority
        const tags = lodash
          .unionWith<any>(addressNameTags, oldList, (arrVal, othVal) => {
            if (arrVal.a === othVal.a) {
              if (arrVal.l !== othVal.l) {
                updateAmount += 1;
              }
              return true;
            } else {
              return false;
            }
          })
          .sort((a, b) => b.u - a.u);

        if (tags.length > 1000) {
          message.error(
            t(translations.profile.tip.exceed, {
              type: t(translations.profile.address.label),
              amount: 1000,
            }),
          );
        } else {
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
              updateAmount,
            }),
          );
        }
      }

      if (txPrivateNotes !== null && txPrivateNotes.length > 0) {
        const oldNotes = localStorage.getItem(
          LOCALSTORAGE_KEYS_MAP.txPrivateNote,
        );
        const oldList = oldNotes ? JSON.parse(oldNotes) : [];

        let updateAmount = 0;
        // New imports have higher priority
        const notes = lodash
          .unionWith<any>(txPrivateNotes, oldList, (arrVal, othVal) => {
            if (arrVal.h === othVal.h) {
              if (arrVal.n !== othVal.n) {
                updateAmount += 1;
              }
              return true;
            } else {
              return false;
            }
          })
          .sort((a, b) => b.u - a.u);

        if (notes.length > 1000) {
          message.error(
            t(translations.profile.tip.exceed, {
              type: t(translations.profile.tx.hash),
              amount: 1000,
            }),
          );
        } else {
          localStorage.setItem(
            LOCALSTORAGE_KEYS_MAP.txPrivateNote,
            JSON.stringify(notes),
          );
          setGlobalData({
            ...globalData,
            [LOCALSTORAGE_KEYS_MAP.txPrivateNote]: notes.reduce(
              (prev, curr) => {
                return {
                  ...prev,
                  [curr.h]: curr.n,
                };
              },
              {},
            ),
          });

          message.info(
            t(translations.profile.file.import.tx, {
              amount: notes.length - oldList.length,
              updateAmount,
            }),
          );
        }
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
        chainId: NETWORK_ID,
        version: '1.0.0',
      };
      const dataStr = JSON.stringify(data);
      const key = new MD5().update(dataStr).digest('hex');

      const file = {
        data,
        key,
      };

      const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
        JSON.stringify(file),
      )}`;

      const link = document.createElement('a');
      link.href = jsonString;
      link.download = `confluxscan-${NETWORK_ID}-user-profile.json`;
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
