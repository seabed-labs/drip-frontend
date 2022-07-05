import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import { FC, useState } from 'react';
import GoogleLogin, { GoogleLogout, GoogleLoginResponse } from 'react-google-login';
import { Vault } from '../component/Vault';
import { VaultProtoConfig } from '../component/VaultProtoConfig';
import { AuthContext, AuthContextProps } from '../contexts/AdminAuth';

function isGoogleLoginResponse(obj: unknown | undefined): obj is GoogleLoginResponse {
  return obj !== null && obj !== undefined && 'googleId' in obj && 'tokenObj' in obj;
}

const clientId = '540992596258-sa2h4lmtelo44tonpu9htsauk5uabdon.apps.googleusercontent.com';

export const Admin: FC = () => {
  // TODO(Mocha): Remove 'blah'
  const [authToken, setAuthToken] = useState<string | undefined>('blah');
  const authContext: AuthContextProps | undefined = authToken
    ? {
        token: authToken
      }
    : undefined;
  return (
    <AuthContext.Provider value={authContext}>
      {/* TODO(Mocha): Fix the styling here */}
      {!authToken && (
        <GoogleLogin
          clientId={clientId}
          buttonText="Login"
          onSuccess={(res) => {
            console.log('login success');
            if (isGoogleLoginResponse(res)) {
              setAuthToken(res.accessToken);
            } else {
              console.log(res.code);
            }
          }}
          onFailure={(res) => console.log(res)}
          cookiePolicy={'single_host_origin'}
        />
      )}
      {authToken && (
        <GoogleLogout
          clientId={clientId}
          buttonText="Logout"
          onLogoutSuccess={() => {
            console.log('logout success');
            setAuthToken(undefined);
          }}
        />
      )}
      {authToken && (
        <Tabs>
          <TabList>
            <Tab>Vault Proto Config</Tab>
            <Tab>Vault</Tab>
          </TabList>
          <TabPanels w="100%">
            <TabPanel w="100%">
              <VaultProtoConfig />
            </TabPanel>
            <TabPanel>
              <Vault />
            </TabPanel>
          </TabPanels>
        </Tabs>
      )}
    </AuthContext.Provider>
  );
};
