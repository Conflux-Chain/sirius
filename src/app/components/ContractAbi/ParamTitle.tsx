/**
 *
 * ParamTitle Component
 *
 */
import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Text } from '@cfxjs/sirius-next-common/dist/components/Text';
import { translations } from 'locales/i18n';
import imgInfo from 'images/info.svg';

interface ParamTitleProps {
  name?: string;
  type?: string;
}
type NativeAttrs = Omit<React.HTMLAttributes<any>, keyof ParamTitleProps>;
export declare type Props = ParamTitleProps & NativeAttrs;

const ParamTitle = ({ name, type }: Props) => {
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
`;
export default ParamTitle;
