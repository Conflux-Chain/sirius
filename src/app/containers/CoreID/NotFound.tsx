import React from 'react';
import imgNotFound from 'images/home/notFoundAddress.svg';
import styled from 'styled-components/macro';

export const NotFound = ({ children = 'reason' }) => {
  return (
    <StyledWrapper>
      <div>
        <img src={imgNotFound} alt="coreid search result not found"></img>
      </div>
      <div className="msg">{children}</div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 30rem;
  justify-content: center;

  img {
    width: 240px;
  }

  .msg {
    font-style: normal;
    font-weight: 450;
    font-size: 1.5714rem;
    line-height: 2rem;
    color: #424242;
    margin-top: 4rem;
    max-width: 650px;
    text-align: center;
  }
`;
