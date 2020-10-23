import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../../locales/i18n';
import { DagGraph } from './Dag';
import { useBreakpoint } from 'styles/media';

export function Dag() {
  const { t } = useTranslation();
  const bp = useBreakpoint();

  return (
    <DagContainer>
      {bp !== 's' && (
        <DagGraph>
          <DagTitle>{t(translations.blocks.title)}</DagTitle>
        </DagGraph>
      )}
    </DagContainer>
  );
}

const DagContainer = styled.div`
  position: relative;
  margin-top: 1.71rem;
  margin-bottom: 1.14rem;
  #dag-viewer {
    min-height: 240px;
    width: 100%;
    > canvas {
      border-radius: 4px;
    }
  }
`;
const DagTitle = styled.div`
  position: absolute;
  top: 1rem;
  left: 2rem;
  font-size: 1.14rem;
  font-weight: bold;
  // color: #0b132e;
  color: white;
`;
