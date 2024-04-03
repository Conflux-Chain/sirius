import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Form, Input, Button, Modal, InputNumber } from '@cfxjs/antd';
import { useTranslation } from 'react-i18next';
import { translations } from 'sirius-next/packages/common/dist/locales/i18n';
import styled from 'styled-components';
import { isBase32Address, isCurrentNetworkAddress } from 'utils';
import { usePortal } from 'utils/hooks/usePortal';
import { abi as ERC1155ABI } from 'utils/contract/ERC1155.json';
import { abi as ERC721ABI } from 'utils/contract/ERC721.json';
import { TXN_ACTION, NETWORK_ID } from 'utils/constants';
import { useTxnHistory } from 'utils/hooks/useTxnHistory';
import { useGlobalData } from 'utils/hooks/useGlobal';
import { TxnStatusModal } from 'app/components/ConnectWallet/TxnStatusModal';
import SDK from 'js-conflux-sdk/dist/js-conflux-sdk.umd.min.js';
import ENV_CONFIG from 'sirius-next/packages/common/dist/env';

export const TransferModal = ({
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
  const [NFT1155Quantity, setNFT1155Quantity] = useState(0);
  const isNFT721 = contractType?.includes('721');

  const contract = useMemo(() => {
    const CFX = new SDK.Conflux({
      url: ENV_CONFIG.ENV_RPC_SERVER,
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
      if (id) {
        if (isNFT721) {
          let isOwner = false;

          if ((await contract.ownerOf(id)) === account) {
            isOwner = true;
          }

          setIsOwner(isOwner);
        } else {
          let isOwner = false;

          const quantity = Number(await contract.balanceOf(account, id));
          setNFT1155Quantity(quantity);

          if (quantity) {
            isOwner = true;
          }

          setIsOwner(isOwner);
        }
      }
    }

    fn().catch(e => {
      console.log('error: ', e);
    });
  }, [contract, contractAddress, contractType, account, id, isNFT721]);

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

  const amountValidator = useCallback(() => {
    return {
      validator(_, value) {
        if (value > 0 && value <= NFT1155Quantity) {
          return Promise.resolve();
        } else {
          return Promise.reject(
            new Error(
              t(translations.nftDetail.error.invalidAmount, {
                amount: NFT1155Quantity,
              }),
            ),
          );
        }
      },
    };
  }, [t, NFT1155Quantity]);

  const showTransferModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form
      .validateFields()
      .then(async function ({ fromAddress, toAddress, tokenId, amount }) {
        setSubmitLoading(true);
        setTxnStatusModal({
          ...txnStatusModal,
          show: true,
        });

        let hash = '';

        if (isNFT721) {
          hash = await contract
            .safeTransferFrom(fromAddress, toAddress, tokenId)
            .sendTransaction({ from: account });
        } else {
          hash = await contract
            .safeTransferFrom(fromAddress, toAddress, tokenId, amount, '0x')
            .sendTransaction({ from: account });
        }

        setTxnStatusModal({
          ...txnStatusModal,
          show: true,
          hash,
        });

        addRecord({
          hash,
          info: JSON.stringify({
            code: isNFT721 ? TXN_ACTION.tranferNFT : TXN_ACTION.tranferNFT1155,
            description: '',
            hash,
            id: id,
            type: contractType,
            amount,
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

  return (
    <StyledWrapper>
      <Button
        type="primary"
        onClick={showTransferModal}
        className="button-transfer"
        loading={submitLoading}
        disabled={!isOwner}
      >
        {t(translations.nftDetail.transfer)}
      </Button>
      <Modal
        title={t(translations.nftDetail.transfer)}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        {id && (
          <Form
            form={form}
            name="basic"
            labelCol={{ span: 4 }}
            initialValues={{
              fromAddress: account,
              tokenId: id,
            }}
            autoComplete="off"
          >
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
            {!isNFT721 && (
              <Form.Item
                label={t(translations.nftDetail.amount)}
                extra={t(translations.nftDetail.amountTip, {
                  amount: NFT1155Quantity,
                })}
                name="amount"
                validateFirst={true}
                rules={[
                  {
                    required: true,
                    message: t(translations.nftDetail.error.amount),
                  },
                  amountValidator,
                ]}
              >
                <InputNumber
                  min={1}
                  max={NFT1155Quantity}
                  style={{ width: '100%' }}
                  precision={0}
                />
              </Form.Item>
            )}
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
