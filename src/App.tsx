import { ChakraProvider } from '@chakra-ui/react';
import { FC } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import styled from 'styled-components';
import { Header } from './component/Header';
import { DripContext } from './contexts/DripContext';
import { RefreshContext } from './contexts/Refresh';
import { TokenInfoContext } from './contexts/TokenInfo';
import { useDrip } from './hooks/Drip';
import { useStateRefresh } from './hooks/StateRefresh';
import { useTokenInfoMap } from './hooks/TokenInfoMap';
import { Deposits, Positions } from './pages';
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
  const drip = useDrip();
  const tokenInfoMap = useTokenInfoMap();
  const [refreshTrigger, forceRefresh] = useStateRefresh();

  return (
    <ChakraProvider theme={theme}>
      <DripContext.Provider value={drip}>
        <RefreshContext.Provider value={{ refreshTrigger, forceRefresh }}>
          <TokenInfoContext.Provider value={tokenInfoMap}>
            <StyledAppContainer>
              <Header />
              <Routes>
                <Route path="/deposit" element={<Deposits />} />
                <Route path="/positions" element={<Positions />} />
                <Route path="*" element={<Navigate to="/deposit" />} />
              </Routes>
            </StyledAppContainer>
          </TokenInfoContext.Provider>
        </RefreshContext.Provider>
      </DripContext.Provider>
    </ChakraProvider>
  );
};
export default App;
