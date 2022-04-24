import { Tab, TabList, TabPanels, Tabs } from '@chakra-ui/react';
import { FC } from 'react';
// import { Vault } from '../component/Vault';
// import { VaultProtoConfig } from '../component/VaultProtoConfig';

export const Admin: FC = () => {
  return (
    <Tabs w="500px">
      <TabList>
        <Tab>Vault Proto Config</Tab>
        <Tab>Vault</Tab>
      </TabList>
      <TabPanels w="100%">
        {/* <TabPanel w="100%">
          <VaultProtoConfig />
        </TabPanel> */}
        {/* <TabPanel>
          <Vault />
        </TabPanel> */}
      </TabPanels>
    </Tabs>
  );
};
