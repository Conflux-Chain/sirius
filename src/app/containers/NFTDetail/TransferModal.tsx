import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Form, Input, Button, Modal } from '@cfxjs/antd';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import styled from 'styled-components';
import { isBase32Address } from 'utils';
import { usePortal } from 'utils/hooks/usePortal';
import { abi as ERC1155ABI } from 'utils/contract/ERC1155.json';
import { abi as ERC721ABI } from 'utils/contract/ERC721.json';
import { TXN_ACTION, RPC_SERVER, NETWORK_ID } from 'utils/constants';
import { useTxnHistory } from 'utils/hooks/useTxnHistory';
import { useGlobalData } from 'utils/hooks/useGlobal';
import { TxnStatusModal } from 'app/components/ConnectWallet/TxnStatusModal';
import SDK from 'js-conflux-sdk/dist/js-conflux-sdk.umd.min.js';

export const TransferModal = ({
  owner = '',
  id = '',
  contractAddress = '',
  contractType = '',
}) => {
  const { t } = useTranslation();
  const [globalData, setGlobalData] = useGlobalData();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const { provider, accounts } = usePortal();
  const [form] = Form.useForm();
  const { addRecord } = useTxnHistory();
  const account = accounts[0];
  const [submitLoading, setSubmitLoading] = useState(false);
  const [txnStatusModal, setTxnStatusModal] = useState({
    show: false,
    hash: '',
    status: '',
    errorMessage: '',
  });
  const isNFT721 = contractType?.includes('721');

  const contract = useMemo(() => {
    const CFX = new SDK.Conflux({
      url: RPC_SERVER,
      networkId: NETWORK_ID,
    });

    CFX.provider = provider;
    return CFX.Contract({
      address: contractAddress,
      abi: isNFT721 ? ERC721ABI : ERC1155ABI,
    });
  }, [contractAddress, isNFT721, provider]);

  useEffect(() => {
    async function fn() {
      if (owner && id) {
        if (isNFT721) {
          let isOwner = false;

          if ((await contract.ownerOf(id)) === account) {
            isOwner = true;
          } else if ((await contract.getApproved(id)) === account) {
            isOwner = true;
          }

          setIsOwner(isOwner);
        } else {
          let isOwner = false;

          if (owner === account) {
            isOwner = true;
          } else if (await contract.isApprovedForAll(owner, account)) {
            isOwner = true;
          }

          setIsOwner(isOwner);
        }
      }
    }

    fn().catch(e => {
      console.log('error: ', e);
    });
  }, [contract, contractAddress, contractType, account, id, isNFT721, owner]);

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

  const showTransferModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form
      .validateFields()
      .then(({ fromAddress, toAddress, tokenId }) => {
        setSubmitLoading(true);
        setTxnStatusModal({
          ...txnStatusModal,
          show: true,
        });

        if (isNFT721) {
          return contract
            .safeTransferFrom(fromAddress, toAddress, tokenId)
            .sendTransaction({ from: account });
        } else {
          return contract
            .safeTransferFrom(fromAddress, toAddress, tokenId, 1, '0x')
            .sendTransaction({ from: account });
        }
      })
      .then(hash => {
        setTxnStatusModal({
          ...txnStatusModal,
          show: true,
          hash,
        });
        addRecord({
          hash,
          info: JSON.stringify({
            code: TXN_ACTION.tranferNFT,
            description: '',
            hash,
            id: id,
            type: contractType,
          }),
        });
      })
      .catch(e => {
        console.log('safeTransferFrom error: ', e);

        setTxnStatusModal({
          ...txnStatusModal,
          show: true,
          status: 'error',
          errorMessage: e.code ? `${e.code} - ${e.message}` : e.message,
        });
      })
      .finally(() => {
        setSubmitLoading(false);
      });
  };

  const handleCancel = () => {
    form.resetFields();
    setIsModalVisible(false);
  };

  const handleTxnStatusClose = () => {
    // reset tx status modal state
    setTxnStatusModal({
      show: false,
      status: '',
      hash: '',
      errorMessage: '',
    });
  };

  const handleTxSuccess = () => {
    // force to refresh project
    setGlobalData({
      ...globalData,
      random: Math.random(),
    });
  };

  if (!isOwner) {
    return null;
  }

  return (
    <StyledWrapper>
      <Button
        type="primary"
        onClick={showTransferModal}
        className="button-transfer"
        loading={submitLoading}
      >
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
            initialValues={{
              fromAddress: owner,
              tokenId: id,
            }}
            autoComplete="off"
          >
            <Form.Item
              label={t(translations.nftDetail.from)}
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
              <Input disabled />
            </Form.Item>
            <Form.Item
              label={t(translations.nftDetail.to)}
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
            <Form.Item
              label={t(translations.nftDetail.id)}
              name="tokenId"
              rules={[
                {
                  required: true,
                  message: t(translations.nftDetail.error.toAddress),
                },
              ]}
            >
              <Input disabled />
            </Form.Item>
          </Form>
        )}
      </Modal>

      <TxnStatusModal
        show={txnStatusModal.show}
        status={txnStatusModal.status}
        onClose={handleTxnStatusClose}
        hash={txnStatusModal.hash}
        onTxSuccess={handleTxSuccess}
        errorMessage={txnStatusModal.errorMessage}
      />
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .button-transfer {
    margin-top: 16px;
  }
`;
