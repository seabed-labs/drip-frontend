import { ChakraProvider } from '@chakra-ui/react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { FC } from 'react';
import { WalletContext } from './contexts';
import { theme } from './theme';

require('./App.css');
require('@solana/wallet-adapter-react-ui/styles.css');

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
    <div className="App">
      <WalletMultiButton />
    </div>
  );
};
