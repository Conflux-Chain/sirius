import React from 'react';
import styled from 'styled-components';

export const Event = ({ fnName, args }) => {
  // TODO how to display when fnName is empty, such as call a non-exist contract function
  return (
    <StyledEventWrapper>
      <span className="fn-name">{fnName}</span>
      <span className="parenthesis parenthesis-left">(</span>
      {args.map((a, index) => {
        let topic_index = a.indexed ? (
          <span className="topic-index">{`index_topic_${a.indexed} `}</span>
        ) : null;
        let type = <span className="type">{a.type} </span>;
        let arg = <span className="arg-name">{a.argName}</span>;
        let comma =
          index !== args.length - 1 ? <span className="comma">, </span> : null;
        return (
          <span key={index}>
            {topic_index}
            {type}
            {arg}
            {comma}
          </span>
        );
      })}
      <span className="parenthesis parenthesis-right">)</span>
    </StyledEventWrapper>
  );
};

const StyledEventWrapper = styled.div`
  .parenthesis {
    margin: 0.1rem;

    &.parenthesis-left {
      margin-left: 0.3571rem;
    }

    &.parenthesis-right {
      margin-right: 0.3571rem;
    }
  }

  .topic-index,
  .type,
  .comma {
    margin-right: 0.3571rem;
  }

  .arg-name {
    color: #e79d35;
  }

  .type {
    color: #d96349;
  }
`;
