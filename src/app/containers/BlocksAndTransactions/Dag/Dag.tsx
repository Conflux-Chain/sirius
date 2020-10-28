// @ts-nocheck
import React, { memo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useLifecycles } from 'react-use';
import { fetchRecentDagBlock } from 'utils/api';

function loadDagJs() {
  if (window.ConfluxDagPlayer) return Promise.resolve();
  const script = document.createElement('script');
  script.src = '/conflux-dag.js';
  document.body.appendChild(script);
  return new Promise(resolve => {
    script.onload = () => {
      resolve();
    };
  });
}
function appendAllSubChain(player, subChains) {
  while (subChains.length) {
    player.appendData(subChains.pop().reverse());
  }
}

function fetchDagData() {
  return fetchRecentDagBlock().then(({ list = [], total = 0 } = {}) => {
    if (this && this instanceof window.ConfluxDagPlayer) {
      return appendAllSubChain(this, list);
    }
    return list;
  });
}

let fetchTimer;
function startFechingDagData() {
  if (window.navigator.onLine) {
    typeof this.onLoaded === 'function' && this.onLoaded();
    fetchTimer = setInterval(fetchDagData.bind(this), 5000);
  }
}

const Container = styled.div``;
const ToolTipWrapper = styled.div`
  position: relative;
  height: 0;
`;
const Tooltip = styled.div`
  position: absolute;
  padding: 14px 13px;
  border-radius: 4px;
  box-shadow: 1px 2px 8px rgba(0, 0, 0, 0.16);
  background: white;
  position: absolute;
  color: #5c5c5c;
  font-size: 12px;
  line-height: 12px;
  white-space: pre-wrap;
  pointer-event: none;
`;
const ArrowLeft = styled.div`
  position: absolute;
  left: -5px;
  width: 0;
  height: 0;
  border-top: 6.5px solid transparent;
  border-bottom: 6.5px solid transparent;
  border-right: 6.5px solid white;
`;
const ArrowRight = styled.div`
  position: absolute;
  right: -5px;
  width: 0;
  height: 0;
  border-top: 6.5px solid transparent;
  border-bottom: 6.5px solid transparent;
  border-left: 6.5px solid white;
`;

const pointSize = 24;

let player;
function DagComp({ id = 'dag-viewer', children, onLoaded } = {}) {
  const [mouseOverBlockWithRef, setMouseOverBlockWithRef] = useState(false);
  const [mouseOverTooltip, setMouseOverTooltip] = useState(false);
  const [tooltipOpt, setTooltipOpt] = useState({
    transform: '',
    direction: '',
    text: '',
    style: {
      top: 0,
      left: 0,
    },
  });
  useLifecycles(
    async () => {
      await loadDagJs();
      const Player = window.ConfluxDagPlayer;
      const initialSubChains = await fetchDagData();
      const container = document.getElementById(id);

      if (container) {
        player = await new Player({
          backgroundColor: '0x0B3560',
          doc: container,
          playByDefault: 500,
          pointSize,
          globalRadius: 100,
          defaultInterval: 500,
          colors: [
            0x76e2e0,
            0xc79af5,
            0xe4dcef,
            0xf2a9b7,
            0xf2be81,
            0xc29af5,
            0xdfdcef,
            0xeca987,
            0xe087ad,
            0x85cfe8,
            0xe0e0e0,
          ],
          chain: initialSubChains.pop().reverse(),
          onBlockClick: ({ hash }) => {
            window.open(`/block/${hash}`);
          },
          onBlockMouseOver: ({ mesh, meshPosition }) => {
            if (mesh.refBlocksInfo.length) {
              let refHashes = '';
              refHashes = 'Ref block hashes:\n';
              // eslint-disable-next-line no-return-assign
              mesh.refBlocksInfo.forEach(({ hash: refHash }, idx) => {
                // there will be undefined hash
                if (refHash) refHashes += `[${idx}]:${refHash}\n`;
              });
              const useRightArrow =
                meshPosition.x > document.getElementById(id).clientWidth / 2;
              setTooltipOpt({
                direction: useRightArrow ? 'right' : 'left',
                text: refHashes,
                style: {
                  transform: useRightArrow ? 'translateX(-100%)' : undefined,
                  left: `${useRightArrow ? meshPosition.x : meshPosition.x}px`,
                  top: `${meshPosition.y - pointSize}px`,
                },
              });
              setMouseOverBlockWithRef(true);
            }
          },
          onBlockMouseOut: () => {
            setMouseOverBlockWithRef(false);
          },
          // debug: true,
        }).catch(err => {
          // know error when this component got unmounted while dag is initializing
          // only throw unknown error
          if (document.getElementById(id)) throw err;
        });
      }
      if (!player) return;
      appendAllSubChain(player, initialSubChains);
      player.onLoaded = onLoaded;
      startFechingDagData.call(player);
    },
    () => {
      if (player) {
        player.destroy && player.destroy();
        player = null;
      }
      if (fetchTimer) {
        clearInterval(fetchTimer);
      }
    },
  );

  // pause if mouse over any of block(with ref block) or tooltip
  useEffect(() => {
    if (player) {
      if (mouseOverTooltip || mouseOverBlockWithRef) {
        player.pause();
      } else {
        player.play();
      }
    }
  }, [mouseOverBlockWithRef, mouseOverTooltip]);
  const { style, direction, text } = tooltipOpt;

  return (
    <Container id={id}>
      {[children]}
      <ToolTipWrapper>
        <Tooltip
          style={{
            ...style,
            visibility: !(mouseOverTooltip || mouseOverBlockWithRef)
              ? 'hidden'
              : 'visible',
          }}
          onFocus={() => setMouseOverTooltip(true)}
          onBlur={() => setMouseOverTooltip(false)}
          onMouseOver={() => setMouseOverTooltip(true)}
          onMouseOut={() => setMouseOverTooltip(false)}
        >
          {direction === 'left' && <ArrowLeft />}
          {direction === 'right' && <ArrowRight />}
          {text}
        </Tooltip>
      </ToolTipWrapper>
    </Container>
  );
}

DagComp.defaultProps = { id: 'dag-viewer', children: undefined };
DagComp.propTypes = { id: PropTypes.string, children: PropTypes.element };

const DagGraph = memo(DagComp);

export { DagGraph };
