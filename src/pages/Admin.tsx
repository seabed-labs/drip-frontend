import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import { FC } from 'react';
import { Vault } from '../component/Vault';
import { VaultProtoConfig } from '../component/VaultProtoConfig';

export const Admin: FC = () => {
  return (
    <Tabs>
      <TabList>
        <Tab>Vault Proto Config</Tab>
        <Tab>Vault</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <VaultProtoConfig />
          <Vault />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};
