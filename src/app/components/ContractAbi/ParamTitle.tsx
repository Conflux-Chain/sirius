/**
 *
 * ParamTitle Component
 *
 */
import React, { Dispatch, SetStateAction } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Text } from '@cfxjs/sirius-next-common/dist/components/Text';
import { translations } from 'locales/i18n';
import imgInfo from 'images/info.svg';
import { ArrowDown } from '@cfxjs/sirius-next-common/dist/components/Icons';

interface ParamTitleProps {
  name?: string;
  type?: string;
  expandable?: boolean;
  expand?: boolean;
  setExpand?: Dispatch<SetStateAction<boolean>>;
}
type NativeAttrs = Omit<React.HTMLAttributes<any>, keyof ParamTitleProps>;
export declare type Props = ParamTitleProps & NativeAttrs;

const ParamTitle = ({ name, type, expandable, expand, setExpand }: Props) => {
  const { t } = useTranslation();
  let nameText = name || '<input>';
  return (
    <>
      <TitleContainer>
        {nameText}
        {type !== 'cfx' && (
          <span>
            &nbsp;(<i>{type}</i>)
          </span>
        )}
        {(type + '').startsWith('tuple') ? (
          <Text
            tag="span"
            hoverValue={
              <span
                className="inputComp-tip"
                dangerouslySetInnerHTML={{
                  __html: t(translations.contract.tupleTips),
                }}
              />
            }
          >
            <img src={imgInfo} alt="tips" />
          </Text>
        ) : null}
        {expandable && (
          <ArrowDown
            className={`down-icon ${expand ? 'expand' : ''}`}
            onClick={() => setExpand?.(e => !e)}
          />
        )}
      </TitleContainer>
    </>
  );
};
const TitleContainer = styled.span`
  display: inline-block;
  font-size: 14px;
  color: #002257;
  line-height: 22px;
  margin-top: 8px;

  img {
    width: 16px;
    height: 16px;
    margin-left: 8px;
  }
  .down-icon {
    width: 16px;
    margin-top: -3px;
    margin-left: 5px;
    cursor: pointer;
    transition: transform 0.3s;
    &.expand {
      transform: rotate(180deg);
    }
  }
`;
export default ParamTitle;
