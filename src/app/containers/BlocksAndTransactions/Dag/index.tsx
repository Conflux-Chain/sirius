import React, { useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../../locales/i18n';
import { DagGraph } from './Dag';
import { useBreakpoint } from 'styles/media';
import SkeletonContainer from '../../../components/SkeletonContainer/Loadable';

export function Dag() {
  const { t } = useTranslation();
  const bp = useBreakpoint();
  const [loading, setLoading] = useState<boolean>(true);

  return (
    <>
      {bp !== 's' && [
        loading && (
          <SkeletonContainer key="skeleton" shown={true}>
            <FakeDag />
          </SkeletonContainer>
        ),
        <DagContainer key="dag" isLoading={loading}>
          <DagGraph onLoaded={() => setLoading(false)}>
            <DagTitle isLoading={loading}>
              {t(translations.block.title)}
            </DagTitle>
          </DagGraph>
        </DagContainer>,
      ]}
    </>
  );
}

const FakeDag = styled.div`
  min-height: 17.1429rem;
  width: 100%;
  border-radius: 0.2857rem;
`;

const DagContainer = styled.div<{ isLoading: boolean }>`
  position: ${props => (props.isLoading ? 'absolute' : 'relative')};
  margin-top: 1.71rem;
  margin-bottom: 1.14rem;
  width: 100%;
  min-height: 17.1429rem;
  #dag-viewer {
    min-height: 17.1429rem;
    width: 100%;
    > canvas {
      border-radius: 0.2857rem;
    }
  }
`;
const DagTitle = styled.div<{ isLoading: boolean }>`
  display: ${props => (props.isLoading ? 'none' : 'block')};
  position: absolute;
  top: 1rem;
  left: 2rem;
  font-size: 1.14rem;
  font-weight: bold;
  // color: #0b132e;
  color: white;
`;
