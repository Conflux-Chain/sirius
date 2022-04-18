import React, { useCallback, useState } from 'react';
import {
  Row,
  Col,
  Collapse,
  Spin,
  Form,
  Input,
  Tooltip,
  Typography,
  Button,
  Modal,
} from '@cfxjs/antd';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import styled from 'styled-components';
import { isBase32Address } from 'utils';

export const TransferModal = ({ owner, id }) => {
  const { t, i18n } = useTranslation();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const validator = useCallback(() => {
    return {
      validator(_, value) {
        if (isBase32Address(value)) {
          return Promise.resolve();
        }
        return Promise.reject(
          new Error(t(translations.nftDetail.error.invalidAddress)),
        );
      },
    };
  }, [t]);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form
      .validateFields()
      .then(values => {
        console.log('values: ', values);
        // setIsModalVisible(false);
        // form.resetFields();
      })
      .catch(e => {
        console.log(e);
      });
  };

  const handleCancel = () => {
    form.resetFields();
    setIsModalVisible(false);
  };

  return (
    <StyledWrapper>
      <Button type="primary" onClick={showModal} className="button-transfer">
        {t(translations.nftDetail.transfer)}
      </Button>
      <Modal
        title={t(translations.nftDetail.transfer)}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        {id && owner && (
          <Form
            form={form}
            name="basic"
            labelCol={{ span: 4 }}
            initialValues={{ fromAddress: owner, tokenId: id }}
            autoComplete="off"
          >
            <Form.Item
              label="From"
              name="fromAddress"
              validateFirst={true}
              rules={[
                {
                  required: true,
                  message: t(translations.nftDetail.error.fromAddress),
                },
                validator,
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="To"
              name="toAddress"
              validateFirst={true}
              rules={[
                {
                  required: true,
                  message: t(translations.nftDetail.error.toAddress),
                },
                validator,
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item label="Token ID" name="tokenId">
              <Input defaultValue={id} disabled />
            </Form.Item>
          </Form>
        )}
      </Modal>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .button-transfer {
    margin-top: 16px;
  }
`;
