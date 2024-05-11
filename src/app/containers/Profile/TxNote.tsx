import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { Space, Modal, Input } from '@cfxjs/antd';
import Button from 'sirius-next/packages/common/dist/components/Button';
import { formatTimeStamp } from 'utils';
import { ContentWrapper } from 'utils/tableColumns/utils';
import { TablePanel as TablePanelNew } from 'app/components/TablePanelNew';
import { useGlobalData } from 'utils/hooks/useGlobal';
import { Link } from 'sirius-next/packages/common/dist/components/Link';
import { useHistory, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import qs from 'query-string';
import { CreateTxNote } from './CreateTxNote';
import { LOCALSTORAGE_KEYS_MAP } from 'utils/enum';

const { confirm, warning } = Modal;
const { Search } = Input;

type Type = {
  h: string;
  n: string;
  t: number;
  u: number;
};

export function TxNote() {
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
    hash: '',
    note: '',
  });

  useEffect(() => {
    try {
      setLoading(true);
      const l = localStorage.getItem(LOCALSTORAGE_KEYS_MAP.txPrivateNote);
      if (l) {
        setList(JSON.parse(l));
      }
      setLoading(false);
    } catch (e) {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const columns = [
    {
      title: t(translations.profile.tx.hash),
      dataIndex: 'h',
      key: 'h',
      width: 9,
      render(v) {
        return (
          <ContentWrapper monospace>
            <Link href={`/transaction/${v}`}>{v}</Link>
          </ContentWrapper>
        );
      },
    },
    {
      title: t(translations.profile.tx.note),
      dataIndex: 'n',
      key: 'n',
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

  const handleClickC = (e, hash = '') => {
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
      hash: hash,
      note: '',
    });
    setStage('create');
    setVisible(true);
  };

  const handleClickE = () => {
    const selectedItem = list.filter(l => l.h === selectedRowKeys[0])[0];
    setData({
      hash: selectedItem?.h,
      note: selectedItem?.n,
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
        const newList = list.filter(l => !selectedRowKeys.includes(l.h));

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
    history.push(`/profile?tab=tx-note${search}`);
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
            placeholder={t(translations.profile.tx.search)}
            onSearch={handleSearch}
          />
        </SearchWrapper>
      </div>
      <TablePanelNew
        rowSelection={rowSelection}
        dataSource={list.filter(
          l => l.h.includes(queryKey) || l.n.includes(queryKey),
        )}
        columns={columns}
        loading={loading}
        rowKey="h"
        key={Math.random()}
        scroll={{ x: 800 }}
      />
      <CreateTxNote
        stage={stage}
        visible={visible}
        data={data}
        onOk={handleOk}
        onCancel={handleCancel}
        list={list}
      ></CreateTxNote>
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
