import React, { useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { Form, Modal, Input, message } from '@cfxjs/antd';
import { isHash, publishRequestError } from 'utils';
import { LOCALSTORAGE_KEYS_MAP } from 'utils/constants';
import { useGlobalData } from 'utils/hooks/useGlobal';

type Type = {
  h: string;
  n: string;
  t: number;
  u: number;
};

type Props = {
  visible: boolean;
  stage: string;
  data: {
    hash: string;
    note?: string;
  };
  list?: null | Array<Type>;
  noteLengthLimit?: number;
  onOk: () => void;
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
  noteLengthLimit = 20,
  onOk = () => {},
  onCancel = () => {},
}: Props) {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [list, setList] = useState<Type[]>(outerList || []);
  const [loading, setLoading] = useState(false);
  const [globalData, setGlobalData] = useGlobalData();

  useEffect(() => {
    try {
      if (!outerList) {
        setLoading(true);
        const l = localStorage.getItem(LOCALSTORAGE_KEYS_MAP.txPrivateNote);
        if (l) {
          setList(JSON.parse(l));
        }
        setLoading(false);
      } else {
        setList(outerList);
      }
    } catch (e) {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [outerList]);

  useEffect(() => {
    form.setFieldsValue(data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const handleOk = () => {
    form.validateFields().then(async function ({ hash, note }) {
      try {
        let newList: Array<Type> = list;
        const timestamp = Math.floor(+new Date() / 1000);

        if (stage === 'create') {
          if (list.some(l => l.h === hash)) {
            message.error(t(translations.profile.tx.error.duplicated));
            return;
          }

          const item: Type = {
            h: hash as string, // hash
            n: note as string, // note
            t: timestamp, // create timestamp
            u: timestamp, // update timestamp
          };

          newList = [item].concat(list);
        } else if (stage === 'edit') {
          const i = list.findIndex(l => l.h === hash);
          const old = list[i];

          newList.splice(i, 1);
          newList = [
            {
              ...old,
              u: timestamp,
              n: note as string,
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
        onOk();
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
        if (value.length > noteLengthLimit) {
          return Promise.reject(
            new Error(
              t(translations.profile.tx.error.invalidNoteRange, {
                amount: 20,
              }),
            ),
          );
        } else {
          return Promise.resolve();
        }
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
