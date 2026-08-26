import React, { useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { Form, Modal, Input, message } from '@cfxjs/antd';
import { isHash } from '@cfxjs/sirius-next-common/dist/utils';
import { publishRequestError } from '@cfxjs/sirius-next-common/dist/utils/pubsub';
import { useGlobalData } from 'utils/hooks/useGlobal';
import { LOCALSTORAGE_KEYS_MAP } from '@cfxjs/sirius-next-common/dist/utils/constants';
import {
  DEFAULT_TX_NOTE_LENGTH_LIMIT,
  isValidTxNote,
  normalizeTxNote,
  sanitizeTxNotes,
} from '@cfxjs/sirius-next-common/dist/utils/txNote';

type Type = {
  h: string;
  n: string;
  t: number;
  u: number;
};

type ListChangeHandler = (list: Type[]) => void;

type Props = {
  visible: boolean;
  stage: string;
  data: {
    hash: string;
    note?: string;
  };
  list?: null | Array<Type>;
  noteLengthLimit?: number;
  onOk: ListChangeHandler;
  onCancel: () => void;
};

export function CreateTxNote({
  visible = false,
  stage = 'create',
  data = {
    hash: '',
    note: '',
  },
  list: outerList,
  noteLengthLimit = DEFAULT_TX_NOTE_LENGTH_LIMIT,
  onOk = () => {},
  onCancel = () => {},
}: Props) {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [list, setList] = useState<Type[]>(
    sanitizeTxNotes(outerList || [], noteLengthLimit),
  );
  const [loading, setLoading] = useState(false);
  const [globalData, setGlobalData] = useGlobalData();

  useEffect(() => {
    try {
      if (!outerList) {
        setLoading(true);
        const l = localStorage.getItem(LOCALSTORAGE_KEYS_MAP.txPrivateNote);
        const rawList = l ? JSON.parse(l) : [];
        const validList = sanitizeTxNotes(rawList, noteLengthLimit);

        setList(validList);
        if (l && JSON.stringify(rawList) !== JSON.stringify(validList)) {
          localStorage.setItem(
            LOCALSTORAGE_KEYS_MAP.txPrivateNote,
            JSON.stringify(validList),
          );
        }
      } else {
        setList(sanitizeTxNotes(outerList, noteLengthLimit));
      }
    } catch (e) {}
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [outerList, noteLengthLimit]);

  useEffect(() => {
    form.setFieldsValue(data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const handleOk = () => {
    form.validateFields().then(async function ({ hash, note }) {
      try {
        const normalizedNote = normalizeTxNote(note);
        let newList: Array<Type> = [...list];
        const timestamp = Math.floor(+new Date() / 1000);

        if (stage === 'create') {
          if (list.some(l => l.h === hash)) {
            message.error(t(translations.profile.tx.error.duplicated));
            return;
          }

          const item: Type = {
            h: hash as string, // hash
            n: normalizedNote, // note
            t: timestamp, // create timestamp
            u: timestamp, // update timestamp
          };

          newList = [item].concat(list);
        } else if (stage === 'edit') {
          const i = list.findIndex(l => l.h === hash);
          if (i < 0) {
            return;
          }
          const old = list[i];

          newList.splice(i, 1);
          newList = [
            {
              ...old,
              u: timestamp,
              n: normalizedNote,
            },
          ].concat(newList);
        }

        setLoading(true);

        localStorage.setItem(
          LOCALSTORAGE_KEYS_MAP.txPrivateNote,
          JSON.stringify(newList),
        );

        const d = {
          ...globalData,
          [LOCALSTORAGE_KEYS_MAP.txPrivateNote]: newList.reduce(
            (prev, curr) => {
              return {
                ...prev,
                [curr.h]: curr.n,
              };
            },
            {},
          ),
        };

        setGlobalData(d);
        setLoading(false);
        onOk(newList);
      } catch (e) {
        publishRequestError(e, 'code');
      }
    });
  };

  const handleCancel = () => {
    form.resetFields();
    setLoading(false);
    onCancel();
  };

  const validator = useCallback(() => {
    return {
      validator(_, value) {
        if (isHash(value)) {
          return Promise.resolve();
        }
        return Promise.reject(
          new Error(t(translations.profile.tx.error.invalidHash)),
        );
      },
    };
  }, [t]);

  const tagValidator = useCallback(() => {
    return {
      validator(_, value) {
        const note = normalizeTxNote(value);

        if (note.length > noteLengthLimit) {
          return Promise.reject(
            new Error(
              t(translations.profile.tx.error.invalidNoteRange, {
                amount: noteLengthLimit,
              }),
            ),
          );
        }

        if (!isValidTxNote(note, noteLengthLimit)) {
          return Promise.reject(
            new Error(t(translations.profile.tx.error.invalidNote)),
          );
        }

        return Promise.resolve();
      },
    };
  }, [noteLengthLimit, t]);

  const text = {
    create: t(translations.general.create),
    edit: t(translations.general.edit),
    delete: t(translations.general.delete),
  };

  return (
    <Modal
      title={text[stage]}
      visible={visible}
      okText={t(translations.general.buttonOk)}
      cancelText={t(translations.general.buttonCancel)}
      onOk={handleOk}
      onCancel={handleCancel}
      confirmLoading={loading}
    >
      <Form form={form} name="basic" labelCol={{ span: 4 }} autoComplete="off">
        <Form.Item
          label={t(translations.profile.tx.hash)}
          name="hash"
          validateFirst={true}
          rules={[
            {
              required: true,
              message: t(translations.profile.tx.error.hash),
            },
            validator,
          ]}
        >
          <Input disabled={stage === 'edit'} />
        </Form.Item>
        <Form.Item
          label={t(translations.profile.tx.note)}
          name="note"
          validateFirst={true}
          rules={[
            {
              required: true,
              message: t(translations.profile.tx.error.note),
            },
            tagValidator,
          ]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
}
