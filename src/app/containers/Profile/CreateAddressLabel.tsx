import React, { useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { Form, Modal, Input, message } from '@cfxjs/antd';
import { isBase32Address, isCurrentNetworkAddress } from 'utils';
import { publishRequestError } from '@cfxjs/sirius-next-common/dist/utils/pubsub';
import { useGlobalData } from 'utils/hooks/useGlobal';
import { LOCALSTORAGE_KEYS_MAP } from '@cfxjs/sirius-next-common/dist/utils/constants';
import ENV_CONFIG from 'env';
import {
  DEFAULT_ADDRESS_LABEL_LENGTH_LIMIT,
  isValidAddressLabel,
  normalizeAddressLabel,
  sanitizeAddressLabels,
} from '@cfxjs/sirius-next-common/dist/utils/addressLabel';

type Type = {
  a: string;
  l: string;
  t: number;
  u: number;
};

type ListChangeHandler = (list: Type[]) => void;

type Props = {
  visible: boolean;
  stage: string;
  data: {
    address: string;
    label?: string;
    note?: string;
  };
  list?: null | Array<Type>;
  labelLengthLimit?: number;
  onOk: ListChangeHandler;
  onCancel: () => void;
};

export function CreateAddressLabel({
  visible = false,
  stage = 'create',
  data = {
    address: '',
    label: '',
  },
  list: outerList,
  labelLengthLimit = DEFAULT_ADDRESS_LABEL_LENGTH_LIMIT,
  onOk = () => {},
  onCancel = () => {},
}: Props) {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [list, setList] = useState<Type[]>(
    sanitizeAddressLabels(outerList || [], labelLengthLimit),
  );
  const [loading, setLoading] = useState(false);
  const [globalData, setGlobalData] = useGlobalData();

  useEffect(() => {
    try {
      if (!outerList) {
        setLoading(true);
        const l = localStorage.getItem(LOCALSTORAGE_KEYS_MAP.addressLabel);
        const rawList = l ? JSON.parse(l) : [];
        const validList = sanitizeAddressLabels(rawList, labelLengthLimit);

        setList(validList);
        if (l && JSON.stringify(rawList) !== JSON.stringify(validList)) {
          localStorage.setItem(
            LOCALSTORAGE_KEYS_MAP.addressLabel,
            JSON.stringify(validList),
          );
        }
      } else {
        setList(sanitizeAddressLabels(outerList, labelLengthLimit));
      }
    } catch (e) {}
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [outerList, labelLengthLimit]);

  useEffect(() => {
    form.setFieldsValue(data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const handleOk = () => {
    form.validateFields().then(async function ({ address, label }) {
      try {
        const normalizedLabel = normalizeAddressLabel(label);
        let newList: Array<Type> = [...list];
        const timestamp = Math.floor(+new Date() / 1000);

        if (stage === 'create') {
          for (let i = 0, len = list.length; i < len; i++) {
            const { a, l } = list[i];
            if (a === address) {
              message.error(t(translations.profile.address.error.duplicated));
              return;
            } else if (l === normalizedLabel) {
              message.error(
                t(translations.profile.address.error.duplicatedNameTag),
              );
              return;
            }
          }

          const item: Type = {
            a: address as string, // address
            l: normalizedLabel, // label
            t: timestamp, // create timestamp
            u: timestamp, // update timestamp
          };

          newList = [item].concat(list);
        } else if (stage === 'edit') {
          const i = list.findIndex(l => l.a === address);
          if (i < 0) {
            return;
          }
          const old = list[i];

          newList.splice(i, 1);
          newList = [
            {
              ...old,
              u: timestamp,
              l: normalizedLabel,
            },
          ].concat(newList);
        }

        setLoading(true);

        localStorage.setItem(
          LOCALSTORAGE_KEYS_MAP.addressLabel,
          JSON.stringify(newList),
        );

        setGlobalData({
          ...globalData,
          [LOCALSTORAGE_KEYS_MAP.addressLabel]: newList.reduce((prev, curr) => {
            return {
              ...prev,
              [curr.a]: curr.l,
            };
          }, {}),
        });

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
        if (isBase32Address(value)) {
          if (isCurrentNetworkAddress(value)) {
            return Promise.resolve();
          } else {
            return Promise.reject(
              new Error(
                t(translations.nftDetail.error.invalidNetwork, {
                  network: t(
                    translations.general.networks[
                      ENV_CONFIG.ENV_NETWORK_TYPE.toLowerCase()
                    ],
                  ),
                }),
              ),
            );
          }
        }
        return Promise.reject(
          new Error(t(translations.nftDetail.error.invalidAddress)),
        );
      },
    };
  }, [t]);

  const tagValidator = useCallback(() => {
    return {
      validator(_, value) {
        const label = normalizeAddressLabel(value);
        if (label.length > labelLengthLimit) {
          return Promise.reject(
            new Error(
              t(translations.profile.address.error.invalidLabelRange, {
                amount: labelLengthLimit,
              }),
            ),
          );
        }

        if (!isValidAddressLabel(label, labelLengthLimit)) {
          return Promise.reject(
            new Error(t(translations.profile.address.error.invalidLabel)),
          );
        }
        return Promise.resolve();
      },
    };
  }, [labelLengthLimit, t]);

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
      <Form form={form} name="basic" labelCol={{ span: 5 }} autoComplete="off">
        <Form.Item
          label={t(translations.profile.address.address)}
          name="address"
          validateFirst={true}
          rules={[
            {
              required: true,
              message: t(translations.profile.address.error.address),
            },
            validator,
          ]}
        >
          <Input disabled={stage === 'edit'} />
        </Form.Item>
        <Form.Item
          label={t(translations.profile.address.label)}
          name="label"
          validateFirst={true}
          rules={[
            {
              required: true,
              message: t(translations.profile.address.error.label),
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
