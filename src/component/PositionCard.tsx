import { FC } from 'react';
import styled from 'styled-components';

// TODO: Finalize the border-shadow on this
const Container = styled.div`
  padding: 20px;
  height: 252px;
  width: 367px;
  background: #101010;
  border-radius: 60px;
  box-shadow: 0 0 64px 1px rgba(49, 85, 128, 0.15);
`;

export const PositionCard: FC = () => {
  return <Container></Container>;
};
