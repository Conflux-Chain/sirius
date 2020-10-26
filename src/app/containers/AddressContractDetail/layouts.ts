import styled from 'styled-components';
import { media } from 'styles/media';

export const Main = styled.div`
  padding: 2.29rem 0 0;
  max-width: 73.1429rem;
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

  ${media.s} {
    margin-bottom: 1rem;
  }
`;
export const HeadAddressLine = styled.span`
  line-height: 1.29rem;
  color: #74798c;
  display: flex;
  flex-direction: row;
  align-items: center;
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
  flex-wrap: wrap;

  ${media.s} {
    > div {
      margin-bottom: 1rem;
    }
    margin-bottom: 1rem;
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
