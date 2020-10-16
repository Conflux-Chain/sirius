/**
 *
 * CopyButton
 *
 */
import React from 'react';
import styled from 'styled-components/macro';
import { Card } from '../Card/Loadable';

interface ListProps {
  list: Array<{ title: string; content: any }>;
}

export const List = ({ list }: ListProps) => {
  return <Card>items</Card>;
};
