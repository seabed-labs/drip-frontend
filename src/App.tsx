import { ChakraProvider } from '@chakra-ui/react';
import { FC } from 'react';
import styled from 'styled-components';
import { Header } from './component/Header';
import { WalletContext } from './contexts';
import { theme } from './theme';

require('./App.css');
require('@solana/wallet-adapter-react-ui/styles.css');

const StyledAppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 50px;
`;

const App: FC = () => {
  return (
    <ChakraProvider theme={theme}>
      <WalletContext>
        <Content />
      </WalletContext>
    </ChakraProvider>
  );
};
export default App;

const Content: FC = () => {
  return (
    <StyledAppContainer>
      <Header />
    </StyledAppContainer>
  );
};
