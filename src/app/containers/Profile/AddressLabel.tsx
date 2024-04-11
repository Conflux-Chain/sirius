import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { Space, Modal, Input } from '@cfxjs/antd';
import Button from 'sirius-next/packages/common/dist/components/Button';
import { formatTimeStamp } from 'utils';
import { ContentWrapper } from 'utils/tableColumns/utils';
import { TablePanel as TablePanelNew } from 'app/components/TablePanelNew';
import { useGlobalData } from 'utils/hooks/useGlobal';
import { Link } from 'app/components/Link/Loadable';
import { useHistory, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import qs from 'query-string';
import { CreateAddressLabel } from './CreateAddressLabel';
import { LOCALSTORAGE_KEYS_MAP } from 'utils/enum';

const { confirm, warning } = Modal;
const { Search } = Input;

type Type = {
  a: string;
  l: string;
  t: number;
  u: number;
};

export function AddressLabel() {
  const history = useHistory();
  const { search: s } = useLocation();
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [stage, setStage] = useState('create');
  const [list, setList] = useState<Type[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [globalData, setGlobalData] = useGlobalData();
  const [search, setSearch] = useState(() => {
    return qs.parse(s).search || '';
  });
  const [data, setData] = useState({
    address: '',
    label: '',
  });

  useEffect(() => {
    try {
      setLoading(true);
      const l = localStorage.getItem(LOCALSTORAGE_KEYS_MAP.addressLabel);
      if (l) {
        setList(JSON.parse(l));
      }
      setLoading(false);
    } catch (e) {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const columns = [
    {
      title: t(translations.profile.address.address),
      dataIndex: 'a',
      key: 'a',
      width: 8,
      render(v) {
        return (
          <ContentWrapper monospace>
            <Link href={`/address/${v}`}>{v}</Link>
          </ContentWrapper>
        );
      },
    },
    {
      title: t(translations.profile.address.label),
      dataIndex: 'l',
      key: 'l',
      width: 4,
    },
    {
      title: (
        <ContentWrapper right>
          {t(translations.general.timestamp)}
        </ContentWrapper>
      ),
      dataIndex: 'u',
      key: 'u',
      width: 4,
      render(v, r) {
        return (
          <ContentWrapper right>
            {formatTimeStamp(v * 1000, 'standard')}
          </ContentWrapper>
        );
      },
    },
  ];

  const handleClickC = (e, address = '') => {
    if (list.length > 1000) {
      warning({
        title: t(translations.general.warning),
        content: t(translations.general.exceedTip),
        icon: null,
        okText: t(translations.general.buttonOk),
        cancelText: t(translations.general.buttonCancel),
      });

      return;
    }

    setData({
      address: address,
      label: '',
    });
    setStage('create');
    setVisible(true);
  };

  const handleClickE = () => {
    const selectedItem = list.filter(l => l.a === selectedRowKeys[0])[0];
    setData({
      address: selectedItem?.a,
      label: selectedItem?.l,
    });
    setStage('edit');
    setVisible(true);
  };

  const handleClickD = () => {
    confirm({
      title: t(translations.general.warning),
      content: t(translations.general.deleteTip),
      icon: null,
      okText: t(translations.general.buttonOk),
      cancelText: t(translations.general.buttonCancel),
      onOk() {
        const newList = list.filter(l => !selectedRowKeys.includes(l.a));

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

        handleSearch('');

        setList(newList);
        setLoading(false);
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  const handleOk = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const handleSearch = value => {
    const search = value ? `&&search=${value}` : '';
    history.push(`/profile?tab=address-label${search}`);
  };

  const handleSearchChange = e => {
    setSearch(e.target.value.trim());
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    columnWidth: 1,
  };

  const text = {
    create: t(translations.general.create),
    edit: t(translations.general.edit),
    delete: t(translations.general.delete),
  };

  const queryKey = (qs.parse(s).search as string) || '';

  return (
    <>
      <div className="button-group-container " style={{ marginBottom: 16 }}>
        <Space>
          <Button
            onClick={handleClickC}
            type="action"
            color="primary"
            disabled={selectedRowKeys.length > 0}
          >
            {text.create}
          </Button>
          <Button
            onClick={handleClickE}
            type="action"
            disabled={
              selectedRowKeys.length > 1 || selectedRowKeys.length === 0
            }
          >
            {text.edit}
          </Button>
          <Button
            onClick={handleClickD}
            type="action"
            disabled={selectedRowKeys.length === 0}
          >
            {text.delete}
          </Button>
        </Space>

        <SearchWrapper>
          <Search
            value={search}
            onChange={handleSearchChange}
            placeholder={t(translations.profile.address.search)}
            onSearch={handleSearch}
          />
        </SearchWrapper>
      </div>
      <TablePanelNew
        rowSelection={rowSelection}
        dataSource={list.filter(
          l => l.a.includes(queryKey) || l.l.includes(queryKey),
        )}
        columns={columns}
        loading={loading}
        rowKey="a"
        key={Math.random()}
        scroll={{ x: 800 }}
      />
      <CreateAddressLabel
        stage={stage}
        visible={visible}
        data={data}
        onOk={handleOk}
        onCancel={handleCancel}
        list={list}
      ></CreateAddressLabel>
    </>
  );
}

const SearchWrapper = styled.div`
  width: 500px;

  .ant-input {
    border-radius: 16px !important;
    background: rgba(30, 61, 228, 0.04);
    border: none !important;
    padding-right: 41px;
  }

  .ant-input-group {
    display: flex;
  }

  .ant-input-group-addon {
    background: transparent !important;
    left: -38px !important;
    z-index: 80;

    .ant-btn {
      background: transparent !important;
      border: none !important;
      padding: 0 !important;
      margin: 0 !important;
      line-height: 1 !important;
      box-shadow: none !important;

      &:after {
        display: none !important;
      }

      .anticon {
        font-size: 18px;
        margin-bottom: 3px;
      }
    }
  }
`;
