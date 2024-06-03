import React, { CSSProperties, useEffect, useCallback } from 'react';
import { formatAddress, formatBalance } from 'utils';
import { Link } from '@cfxjs/sirius-next-common/dist/components/Link';
import { decodeData, filterByTokenAddress, MultiAction } from './minibus';
import styled from 'styled-components';
import { AddressContainer } from '@cfxjs/sirius-next-common/dist/components/AddressContainer';
import { reqContractAndToken, reqNametag } from 'utils/httpRequest';
import { useNametagCacheStore } from 'utils/store';

const LogoStyle = styled.img`
  width: 16px;
  height: 16px;
  margin-top: 2px;
`;
const StyleWrap: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  alignContent: 'center',
  gap: '5px',
};
const BalanceStyle = styled.div`
  font-weight: 800;
`;
const TransactionActionWrapper = styled.div`
  max-height: 119px;
  overflow-y: auto;
`;

const TokenName = 'Undefined';
const TokenSymbol = 'N/A';
const TokenIcon =
  'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMzNweCIgaGVpZ2h0PSIzM3B4IiB2aWV3Qm94PSIwIDAgMzMgMzMiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDYxLjIgKDg5NjUzKSAtIGh0dHBzOi8vc2tldGNoLmNvbSAtLT4KICAgIDx0aXRsZT5Ub2tlbnM8L3RpdGxlPgogICAgPGRlc2M+Q3JlYXRlZCB3aXRoIFNrZXRjaC48L2Rlc2M+CiAgICA8ZyBpZD0i6aG16Z2iLTEiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxnIGlkPSLnlLvmnb8iIHRyYW5zZm9ybT0idHJhbnNsYXRlKC00NzUuMDAwMDAwLCAtMzEuMDAwMDAwKSI+CiAgICAgICAgICAgIDxnIGlkPSJUb2tlbnMiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDQ2My4wMDAwMDAsIDE4LjAwMDAwMCkiPgogICAgICAgICAgICAgICAgPGcgaWQ9Ik1haW4iIHRyYW5zZm9ybT0idHJhbnNsYXRlKDEyLjAwMDAwMCwgMTMuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTE0LjA5Mzc5NDEsOS42MTI5NjI4NiBDMTMuODI1MTcwNSw5LjIzMjgzNDcgMTMuMzU0NjM0MSw5LjAwMTM2MzM1IDEyLjg0Nzc5NjcsOSBMNC4xNTUyOTU4Niw5IEMzLjY0NTgzNTIxLDguOTk5MTE2MzYgMy4xNzE5MzgxMiw5LjIzMDg3MDA1IDIuOTAxOTI0ODUsOS42MTI5NjI4NyBMMC4yMjU2MTM1MjcsMTMuNDAxNDg4OCBDLTAuMTE4NTc4MzcxLDEzLjg4NjUyMzggLTAuMDY0NzQ2MDY4OCwxNC41MTMzOTYyIDAuMzU4MzIzMzY0LDE0Ljk0Njg4NyBMNy45Mzc1MjYzNCwyMi43NzE3MTM4IEM4LjIwMjE2NjI4LDIzLjA0NTQxMDcgOC42Njc1Njc0MywyMy4wNzc1NDY0IDguOTc3MDMwNTIsMjIuODQzNDkxNiBDOS4wMDYxNTA3MywyMi44MjE0NjcyIDkuMDMzMjg1MzEsMjIuNzk3NDY4NiA5LjA1ODE4NzY5LDIyLjc3MTcxMzggTDE2LjYzNzM5MDcsMTQuOTQ2ODg3IEMxNy4wNjI4MDQxLDE0LjUxNDg3ODIgMTcuMTE5NjMzNywxMy44ODc5MTQzIDE2Ljc3NzQ3MzIsMTMuNDAxNDg4OCBMMTQuMDkzNzk0MSw5LjYxMjk2Mjg2IFoiIGlkPSLot6/lvoQiIGZpbGw9IiNDNEM2RDIiIGZpbGwtcnVsZT0ibm9uemVybyI+PC9wYXRoPgogICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0yNi43Nzc2MDcyLDE4LjQ2NTY5MjYgQzI2LjU3MjE4OTIsMTguMTc2ODkzOSAyNi4yMTIzNjczLDE4LjAwMTAzNTggMjUuODI0Nzg1NywxOCBMMTkuMTc3NTc5MiwxOCBDMTguNzg3OTkxNiwxNy45OTkzMjg3IDE4LjQyNTU5OTcsMTguMTc1NDAxMyAxOC4yMTkxMTksMTguNDY1NjkyNiBMMTYuMTcyNTI4LDIxLjM0Mzk4ODIgQzE1LjkwOTMyMjQsMjEuNzEyNDg4OSAxNS45NTA0ODgzLDIyLjE4ODc0OSAxNi4yNzQwMTIsMjIuNTE4MDg5NCBMMjIuMDY5ODczMSwyOC40NjI5MjU0IEMyMi4yNzIyNDQ4LDI4LjY3MDg2NCAyMi42MjgxMzk4LDI4LjY5NTI3ODcgMjIuODY0Nzg4LDI4LjUxNzQ1NzkgQzIyLjg4NzA1NjQsMjguNTAwNzI1MSAyMi45MDc4MDY0LDI4LjQ4MjQ5MjQgMjIuOTI2ODQ5NCwyOC40NjI5MjU0IEwyOC43MjI3MTA1LDIyLjUxODA4OTQgQzI5LjA0ODAyNjYsMjIuMTg5ODc1IDI5LjA5MTQ4NDYsMjEuNzEzNTQ1MiAyOC44Mjk4MzI1LDIxLjM0Mzk4ODIgTDI2Ljc3NzYwNzIsMTguNDY1NjkyNiBaIiBpZD0i6Lev5b6EIiBmaWxsPSIjN0Y4Mjk2IiBmaWxsLXJ1bGU9Im5vbnplcm8iPjwvcGF0aD4KICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMjUuNTgwOTM0MiwzLjc0NDMxMjcyIEMyNS4yNjQ5MDY1LDMuMjgyNzI4MTEgMjQuNzExMzM0MywzLjAwMTY1NTQ5IDI0LjExNTA1NSwzIEwxMy44ODg1ODM0LDMgQzEzLjI4OTIxNzksMi45OTg5MjcwMSAxMi43MzE2OTE5LDMuMjgwMzQyNDYgMTIuNDE0MDI5MiwzLjc0NDMxMjc0IEw5LjI2NTQyNzY4LDguMzQ0NjY5ODMgQzguODYwNDk2MDMsOC45MzM2NDE0OSA4LjkyMzgyODE1LDkuNjk0ODQ0MzMgOS40MjE1NTY5LDEwLjIyMTIyNjUgTDE4LjMzODI2NjMsMTkuNzIyODEwNiBDMTguNjQ5NjA3NCwyMC4wNTUxNTcxIDE5LjE5NzEzODIsMjAuMDk0MTc5MSAxOS41NjEyMTI0LDE5LjgwOTk2OTUgQzE5LjU5NTQ3MTQsMTkuNzgzMjI1NSAxOS42MjczOTQ1LDE5Ljc1NDA4NDMgMTkuNjU2NjkxNCwxOS43MjI4MTA2IEwyOC41NzM0MDA4LDEwLjIyMTIyNjUgQzI5LjA3Mzg4NzEsOS42OTY2NDM5NSAyOS4xNDA3NDU2LDguOTM1MzI5ODggMjguNzM4MjAzOCw4LjM0NDY2OTgyIEwyNS41ODA5MzQyLDMuNzQ0MzEyNzIgWiIgaWQ9Iui3r+W+hCIgZmlsbD0iIzRDNEY2MCIgZmlsbC1ydWxlPSJub256ZXJvIj48L3BhdGg+CiAgICAgICAgICAgICAgICAgICAgPGcgaWQ9InNwYXJrIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyLjAwMDAwMCwgMTAuMDAwMDAwKSIgZmlsbD0iI0ZGRkZGRiI+CiAgICAgICAgICAgICAgICAgICAgICAgIDxyZWN0IGlkPSLnn6nlvaIiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE0LjAwMDAwMCwgNC42MDAwMDApIHJvdGF0ZSg0Ny4wMDAwMDApIHRyYW5zbGF0ZSgtMTQuMDAwMDAwLCAtNC42MDAwMDApICIgeD0iMTAiIHk9IjQiIHdpZHRoPSI4IiBoZWlnaHQ9IjEuMiIgcng9IjAuNiI+PC9yZWN0PgogICAgICAgICAgICAgICAgICAgICAgICA8cmVjdCBpZD0i55+p5b2i5aSH5Lu9IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg0LjAwMDAwMCwgOC42MDAwMDApIHJvdGF0ZSg0Ny4wMDAwMDApIHRyYW5zbGF0ZSgtNC4wMDAwMDAsIC04LjYwMDAwMCkgIiB4PSIwLjUiIHk9IjgiIHdpZHRoPSI3IiBoZWlnaHQ9IjEuMiIgcng9IjAuNiI+PC9yZWN0PgogICAgICAgICAgICAgICAgICAgICAgICA8cmVjdCBpZD0i55+p5b2i5aSH5Lu9LTIiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE5LjI1MDAwMCwgMTUuNjAwMDAwKSByb3RhdGUoNDcuMDAwMDAwKSB0cmFuc2xhdGUoLTE5LjI1MDAwMCwgLTE1LjYwMDAwMCkgIiB4PSIxNyIgeT0iMTUiIHdpZHRoPSI0LjUiIGhlaWdodD0iMS4yIiByeD0iMC42Ij48L3JlY3Q+CiAgICAgICAgICAgICAgICAgICAgICAgIDxjaXJjbGUgaWQ9IuakreWchuW9oiIgY3g9IjEwIiBjeT0iMC41IiByPSIxIj48L2NpcmNsZT4KICAgICAgICAgICAgICAgICAgICAgICAgPGNpcmNsZSBpZD0i5qSt5ZyG5b2i5aSH5Lu9LTMiIGN4PSIwLjUiIGN5PSI1IiByPSIxIj48L2NpcmNsZT4KICAgICAgICAgICAgICAgICAgICAgICAgPGNpcmNsZSBpZD0i5qSt5ZyG5b2i5aSH5Lu9LTQiIGN4PSIxNi41IiBjeT0iMTIuNSIgcj0iMSI+PC9jaXJjbGU+CiAgICAgICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICA8L2c+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4=';
const TokenDecimals = 18;

const Token = (
  address: string,
  customInfo: any,
  tokenType: string,
  tokenExhibit: string[], // icon, name, symbol
) => {
  const customInfoToken = filterByTokenAddress(customInfo.token || {}, address);
  return customInfoToken && customInfoToken['token'] ? (
    <>
      {tokenExhibit.includes('icon') ? (
        customInfoToken['token']['iconUrl'] ? (
          <LogoStyle src={customInfoToken['token']['iconUrl']} alt="icon" />
        ) : (
          <>
            <LogoStyle src={TokenIcon} alt="icon" />
          </>
        )
      ) : (
        <></>
      )}
      {tokenExhibit.includes('name') ? (
        <Link href={`/address/${formatAddress(address)}`}>
          {customInfoToken['token']['name'] ? (
            `${customInfoToken['token']['name']}`
          ) : (
            <div>{TokenName}</div>
          )}{' '}
        </Link>
      ) : (
        <></>
      )}
      {tokenExhibit.includes('symbol') ? (
        <Link href={`/address/${formatAddress(address)}`}>
          {customInfoToken['token']['symbol']
            ? customInfoToken['token']['symbol']
            : TokenSymbol}{' '}
        </Link>
      ) : (
        <></>
      )}
    </>
  ) : (
    <>
      {tokenExhibit.includes('icon') && (
        <LogoStyle src={TokenIcon} alt="icon" />
      )}
      {tokenExhibit.includes('name') && <div>{TokenName}</div>}
      {tokenExhibit.includes('symbol') && <div>({TokenSymbol})</div>}
    </>
  );
};

interface AddressNameTagContainerProps {
  value: string;
}

const AddressNameTagContainer: React.FC<AddressNameTagContainerProps> = ({
  value,
}) => {
  const {
    nametagCache,
    contractCache,
    setNametagCache,
    setContractCache,
  } = useNametagCacheStore(state => ({
    // @ts-ignore
    nametagCache: state.nametagCache,
    // @ts-ignore
    contractCache: state.contractCache,
    // @ts-ignore
    setNametagCache: state.setNametagCache,
    // @ts-ignore
    setContractCache: state.setContractCache,
  }));

  const fetchContractAndToken = useCallback(
    async (address: string) => {
      try {
        const data = await reqContractAndToken({ address: [address] });
        if (data && data.total > 0 && data.map[address]) {
          setContractCache({ [address]: data.map[address] });
        }
      } catch (error) {
        console.error(error);
      }
    },
    [setContractCache],
  );

  const fetchNameTag = useCallback(
    async (address: string) => {
      try {
        const data = await reqNametag([address]);
        if (data && data.total > 0 && data.map[address]) {
          setNametagCache({ [address]: data.map[address] });
        }
      } catch (error) {
        console.error(error);
      }
    },
    [setNametagCache],
  );

  useEffect(() => {
    if (value && !contractCache[value]) {
      fetchContractAndToken(value);
    }

    if (value && !nametagCache[value]) {
      fetchNameTag(value);
    }
  }, [value, fetchContractAndToken, fetchNameTag, nametagCache, contractCache]);

  const nametagInfo = {
    [value]: {
      address: value,
      nametag: nametagCache[value]?.nameTag || '',
    },
  };
  return (
    <AddressContainer
      value={value}
      alias={
        contractCache[value]?.contract?.name ||
        contractCache[value]?.token?.name
      }
      isFullNameTag={true}
      nametagInfo={nametagInfo}
    />
  );
};

const customUI: MultiAction = {
  ERC20_Transfer: ({ address, toAddress, value, customInfo }) => {
    return (
      <div style={{ ...StyleWrap }}>
        Transfer
        <BalanceStyle>
          {formatBalance(value, customInfo['decimals'] || TokenDecimals, true)}
        </BalanceStyle>{' '}
        {Token(address, customInfo, 'ERC20', ['icon', 'symbol'])} to{' '}
        <Link href={`/address/${formatAddress(toAddress)}`}>
          <AddressNameTagContainer value={formatAddress(toAddress)} />
        </Link>
      </div>
    );
  },
  ERC20_Approved: ({ address, toAddress, customInfo }) => {
    return (
      <div style={{ ...StyleWrap }}>
        Approved
        {Token(address, customInfo, 'ERC20', ['icon', 'symbol'])} for
        {toAddress && (
          <Link href={`/address/${formatAddress(toAddress)}`}>
            <AddressNameTagContainer value={formatAddress(toAddress)} />
          </Link>
        )}
      </div>
    );
  },
  ERC20_Revoked: ({ address, toAddress, customInfo }) => {
    return (
      <div style={{ ...StyleWrap }}>
        Revoked
        {Token(address, customInfo, 'ERC20', ['icon', 'symbol'])} from
        {toAddress && (
          <Link href={`/address/${formatAddress(toAddress)}`}>
            <AddressNameTagContainer value={formatAddress(toAddress)} />
          </Link>
        )}
      </div>
    );
  },
  ERC721_Mint: ({ value, address, customInfo }) => {
    return (
      <div style={{ ...StyleWrap }}>
        Mint <BalanceStyle>{value}</BalanceStyle> of{' '}
        {Token(address, customInfo, 'ERC721', ['icon', 'name', 'symbol'])}
      </div>
    );
  },
  ERC721_Transfer: ({ value, address, customInfo }) => {
    return (
      <div style={{ ...StyleWrap }}>
        Transfer <BalanceStyle>{value}</BalanceStyle> of{' '}
        {Token(address, customInfo, 'ERC721', ['icon', 'name', 'symbol'])}
      </div>
    );
  },
  ERC721_Burn: ({ value, address, customInfo }) => {
    return (
      <div style={{ ...StyleWrap }}>
        Burn <BalanceStyle>{value}</BalanceStyle> of{' '}
        {Token(address, customInfo, 'ERC721', ['icon', 'name', 'symbol'])}
      </div>
    );
  },
  ERC721_SafeTransferFrom: ({ value, address, customInfo }) => {
    return (
      <div style={{ ...StyleWrap }}>
        Transfer <BalanceStyle>{value}</BalanceStyle> of{' '}
        {Token(address, customInfo, 'ERC721', ['icon', 'name', 'symbol'])}
      </div>
    );
  },
  ERC721_Revoked: ({ address, toAddress, customInfo }) => {
    return (
      <div style={{ ...StyleWrap }}>
        Revoked {Token(address, customInfo, 'ERC721', ['icon', 'symbol'])}
        from
        {toAddress && (
          <Link href={`/address/${formatAddress(toAddress)}`}>
            <AddressNameTagContainer value={formatAddress(toAddress)} />
          </Link>
        )}
      </div>
    );
  },
  ERC721_Approved: ({ address, toAddress, customInfo }) => {
    return (
      <div style={{ ...StyleWrap }}>
        Approved {Token(address, customInfo, 'ERC721', ['icon', 'symbol'])}
        for
        {toAddress && (
          <Link href={`/address/${formatAddress(toAddress)}`}>
            <AddressNameTagContainer value={formatAddress(toAddress)} />
          </Link>
        )}
      </div>
    );
  },
  ERC1155_Approved: ({ address, toAddress, customInfo }) => {
    return (
      <div style={{ ...StyleWrap }}>
        Approved {Token(address, customInfo, 'ERC1155', ['icon', 'symbol'])}
        for
        {toAddress && (
          <Link href={`/address/${formatAddress(toAddress)}`}>
            <AddressNameTagContainer value={formatAddress(toAddress)} />
          </Link>
        )}
      </div>
    );
  },
  ERC1155_Revoked: ({ address, toAddress, customInfo }) => {
    return (
      <div style={{ ...StyleWrap }}>
        Revoked {Token(address, customInfo, 'ERC1155', ['icon', 'symbol'])}
        from
        {toAddress && (
          <Link href={`/address/${formatAddress(toAddress)}`}>
            <AddressNameTagContainer value={formatAddress(toAddress)} />
          </Link>
        )}
      </div>
    );
  },
  ERC1155_Mint: ({ value, address, customInfo }) => {
    return (
      <div style={{ ...StyleWrap }}>
        Mint <BalanceStyle>{value}</BalanceStyle> of{' '}
        {Token(address, customInfo, 'ERC1155', ['icon', 'name', 'symbol'])}
      </div>
    );
  },
  ERC1155_SafeTransferFrom: ({ value, address, customInfo }) => {
    return (
      <div style={{ ...StyleWrap }}>
        Transfer <BalanceStyle>{value}</BalanceStyle> of{' '}
        {Token(address, customInfo, 'ERC1155', ['icon', 'name', 'symbol'])}
      </div>
    );
  },
  ERC1155_Burn: ({ value, address, customInfo }) => {
    return (
      <div style={{ ...StyleWrap }}>
        Burn <BalanceStyle>{value}</BalanceStyle> of{' '}
        {Token(address, customInfo, 'ERC1155', ['icon', 'name', 'symbol'])}
      </div>
    );
  },
  ERC1155_Transfer: ({ value, address, customInfo }) => {
    return (
      <div style={{ ...StyleWrap }}>
        Transfer <BalanceStyle>{value}</BalanceStyle> of{' '}
        {Token(address, customInfo, 'ERC1155', ['icon', 'name', 'symbol'])}
      </div>
    );
  },
  ERC1155_SafeBatchTransferFrom: ({ value, address, customInfo }) => {
    return (
      <div style={{ ...StyleWrap }}>
        Transfer <BalanceStyle>{value}</BalanceStyle> of{' '}
        {Token(address, customInfo, 'ERC1155', ['icon', 'name', 'symbol'])}
      </div>
    );
  },
  ERC1155_BatchBurn: ({ value, address, customInfo }) => {
    return (
      <div style={{ ...StyleWrap }}>
        Burn <BalanceStyle>{value}</BalanceStyle> of{' '}
        {Token(address, customInfo, 'ERC1155', ['icon', 'name', 'symbol'])}
      </div>
    );
  },
  ERC1155_BatchMint: ({ value, address, customInfo }) => {
    return (
      <div style={{ ...StyleWrap }}>
        Mint <BalanceStyle>{value}</BalanceStyle> of{' '}
        {Token(address, customInfo, 'ERC1155', ['icon', 'name', 'symbol'])}
      </div>
    );
  },
};

export const TransactionAction = ({ transaction, event, customInfo }: any) => {
  const res = decodeData(transaction, event, customInfo, customUI);

  if (res && res.content && res.content.length > 0) {
    return {
      show: true,
      content: (
        <TransactionActionWrapper>
          {res.content.map((e: any) => {
            return <div>{e}</div>;
          })}
        </TransactionActionWrapper>
      ),
    };
  }
  return {
    show: false,
    content: undefined,
  };
};
