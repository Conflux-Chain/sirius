import styled from 'styled-components';
import { media } from 'styles/media';

export const Main = styled.div`
  padding: 2.29rem 0 0;
  max-width: 100%;
  display: flex;
  flex-direction: column;

  ${media.s} {
    padding: 2rem 0 0;
  }
`;

export const Head = styled.section`
  position: relative;
  width: 100%;
  margin-bottom: 1.71rem;

  ${media.s} {
    margin-bottom: 1rem;
  }
`;
export const Title = styled.div`
  font-size: 1.71rem;
  text-transform: capitalize;
  position: relative;
  width: 100%;
  margin-bottom: 0.86rem;
  font-weight: 700;

  ${media.s} {
    margin-bottom: 1rem;
  }
`;
export const HeadAddressLine = styled.span`
  position: relative;
  line-height: 1.29rem;
  color: #74798c;
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
  text-align: left;

  ${media.s} {
    align-items: baseline;
    flex-direction: column;

    .address,
    icons {
      margin-bottom: 0.5rem;
    }
  }

  @media (max-width: 400px) {
    .address {
      font-size: 12px;
    }
  }

  .icons {
    display: flex;
    flex-direction: row;
    align-items: center;
    > span,
    > div {
      margin-right: 0.58rem;
    }
  }

  > span,
  > div {
    margin-right: 0.58rem;
  }
`;
export const Top = styled.section`
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: row;
  margin-bottom: 1.71rem;
  justify-content: space-between;
  flex-wrap: nowrap;

  > div {
    width: calc(50% - 24px);
  }

  > * + * {
    margin-left: 24px;
  }

  ${media.m} {
    flex-wrap: wrap;

    > *:nth-child(1),
    > *:nth-child(2) {
      margin-bottom: 24px;
    }

    > *:nth-child(3) {
      margin-left: 0;
    }
  }

  ${media.s} {
    > div {
      width: 100%;
      margin-left: 0;
      margin-bottom: 10px !important;
    }
    margin-bottom: 10px;
  }
`;
export const Middle = styled.section`
  margin-bottom: 2.29rem;

  ${media.s} {
    margin-bottom: 2rem;
  }
`;
export const Bottom = styled.section`
  position: relative;
  width: 100%;
`;
