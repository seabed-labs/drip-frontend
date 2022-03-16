import { FC } from 'react';
import styled from 'styled-components';

// TODO: Finalize the border-shadow on this
const Container = styled.div`
  padding: 20px;
  height: 600px;
  width: 500px;
  background: #101010;
  border-radius: 60px;
  box-shadow: 0 0 128px 1px rgba(98, 170, 255, 0.15);
`;

export const DepositBox: FC = () => {
  return <Container></Container>;
};
