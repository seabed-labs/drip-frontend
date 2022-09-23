import { ChakraProvider } from '@chakra-ui/react';
import { FC, useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import styled from 'styled-components';
import { Banner } from './component/Banner';
import { Header } from './component/Header';
import { DripContext } from './contexts/DripContext';
import { RefreshContext } from './contexts/Refresh';
import { TokenMapContext } from './contexts/TokenMap';
import { useDrip } from './hooks/Drip';
import { useStateRefresh } from './hooks/StateRefresh';
import { useTokenMap } from './hooks/TokenInfoMap';
import { Deposit, Positions } from './pages';
import { theme } from './theme';
import { Device } from './utils/ui/css';
import ReactGA from 'react-ga';
require('./App.css');
require('@solana/wallet-adapter-react-ui/styles.css');

const TRACKING_ID = process.env.REACT_APP_TRACKING_ID ?? 'UA-237792885-1'; // OUR_TRACKING_ID
ReactGA.initialize(TRACKING_ID);

const StyledAppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 25px;

  @media ${Device.MobileL} {
    padding: 50px;
  }
`;

const App: FC = () => {
  const drip = useDrip();
  const tokenMap = useTokenMap();
  const [refreshTrigger, forceRefresh] = useStateRefresh();

  useEffect(() => {
    ReactGA.pageview(window.location.pathname + window.location.search);
  }, []);

  return (
    <ChakraProvider theme={theme}>
      <DripContext.Provider value={drip}>
        <RefreshContext.Provider value={{ refreshTrigger, forceRefresh }}>
          <TokenMapContext.Provider value={tokenMap}>
            <Banner />
            <StyledAppContainer>
              <Header />
              <Routes>
                <Route path="/deposit" element={<Deposit />} />
                <Route path="/positions" element={<Positions />} />
                <Route path="*" element={<Navigate to="/deposit" />} />
              </Routes>
            </StyledAppContainer>
          </TokenMapContext.Provider>
        </RefreshContext.Provider>
      </DripContext.Provider>
    </ChakraProvider>
  );
};
export default App;
