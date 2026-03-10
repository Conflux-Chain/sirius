import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import styled from 'styled-components';
import { media } from '@cfxjs/sirius-next-common/dist/utils/media';
import { isAddress, isSafeNumberOrNumericStringInput } from 'utils';
import { Form, Col, Row, Button, Input } from '@cfxjs/antd';
import { useHistory, useLocation } from 'react-router-dom';
import qs from 'query-string';
import Search from '@zeit-ui/react-icons/search';
import ChevronUp from '@zeit-ui/react-icons/chevronUp';
import lodash from 'lodash';
import { IconButton } from '@cfxjs/sirius-next-common/dist/components/Button';

interface QueryProps {
  [index: string]: string;
}
interface TitleProps {
  total: number;
  showSearch?: boolean;
  totalTip?: string;
}

const normalizeNumericString = (value, prevValue) => {
  return value === '' || isSafeNumberOrNumericStringInput(value)
    ? value
    : prevValue;
};
export const Title = ({
  total,
  showSearch = true,
  totalTip,
}: Readonly<TitleProps>) => {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const { pathname, search } = useLocation();
  const history = useHistory();
  const [fold, setFold] = useState(true);

  const getSearch = useMemo(() => {
    return showSearch ? (
      <IconButton onClick={() => setFold(!fold)}>
        {fold ? <Search size={18} /> : <ChevronUp size={18} />}
      </IconButton>
    ) : null;
  }, [fold, showSearch]);

  useEffect(() => {
    const { tokenId, owner } = qs.parse(search);
    try {
      const value = {
        tokenId,
        owner,
      };

      form.setFieldsValue(value);
    } catch (e) {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const handleFinish = (values: any) => {
    const { tokenId, owner, ...others } = qs.parse(search);

    const query: QueryProps = {
      ...(others as QueryProps),
      skip: '0',
    };

    if (values.owner) {
      query.owner = values.owner;
    }

    if (values.tokenId) {
      query.tokenId = values.tokenId;
    }

    const urlWithQuery = qs.stringifyUrl({
      url: pathname,
      query,
    });

    history.push(urlWithQuery);
  };
  const handleReset = () => {
    const query = lodash.omit(qs.parse(search), ['owner', 'tokenId']);

    const urlWithQuery = qs.stringifyUrl({
      url: pathname,
      query,
    });

    form.resetFields();

    history.push(urlWithQuery);
  };

  return (
    <StyledTableHeaderWrapper>
      <div className="table-header-top">
        <div className="table-title-tip-total">{totalTip}</div>
        <div className="table-title-filter-wrapper">{getSearch}</div>
      </div>
      {fold ? null : (
        <div className="table-header-bottom">
          <Form
            form={form}
            name="advanced_search"
            className="ant-advanced-search-form"
            onFinish={handleFinish}
            layout="vertical"
          >
            <Row gutter={24}>
              <Col xs={24} sm={6} key="tokenId">
                <Form.Item
                  name="tokenId"
                  label={t(translations.general.advancedSearch.label.tokenId)}
                  normalize={normalizeNumericString}
                >
                  <Input
                    placeholder={t(
                      translations.general.advancedSearch.placeholder
                        .pleaseEnterTokenId,
                    )}
                    allowClear
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} key="owner">
                <Form.Item
                  name="owner"
                  label={t(
                    translations.general.searchInputPlaceholder.holderAddress,
                  )}
                  normalize={value => value.trim()}
                  rules={[
                    {
                      validator: (_, value) => {
                        if (!value || isAddress(value)) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error(
                            t(
                              translations.general.advancedSearch.error
                                .invalidAddress,
                            ),
                          ),
                        );
                      },
                    },
                  ]}
                >
                  <Input style={{ width: '100%' }} placeholder="" allowClear />
                </Form.Item>
              </Col>
              <Col
                style={{
                  textAlign: 'right',
                }}
                xs={24}
                sm={6}
                key="buttonGroup"
              >
                <Form.Item label={` `}>
                  <StyledButtonWrapper>
                    <Button
                      className="advanced-search-button"
                      type="primary"
                      htmlType="submit"
                    >
                      {t(translations.general.advancedSearch.button.lookup)}
                    </Button>
                  </StyledButtonWrapper>
                  <StyledButtonWrapper>
                    <Button
                      className="advanced-search-button"
                      style={{ marginLeft: '8px' }}
                      onClick={handleReset}
                    >
                      {t(translations.general.advancedSearch.button.reset)}
                    </Button>
                  </StyledButtonWrapper>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
      )}
    </StyledTableHeaderWrapper>
  );
};

const StyledTableHeaderWrapper = styled.div`
  margin-bottom: 14px;
  .table-header-top {
    display: flex;
    justify-content: space-between;
    align-items: center;

    ${media.s} {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }

    .table-title-button-fold {
      display: flex;
      align-items: center;
    }

    .table-title-filter-wrapper {
      display: flex;
    }
  }
  .table-header-bottom {
    margin-top: 16px;
    border-top: 1px solid #e8e9ea;
    padding: 8px 16px 0;
    margin-bottom: -12px;
  }
`;

const StyledButtonWrapper = styled.span`
  .advanced-search-button {
    width: 8.5rem;
  }
`;
