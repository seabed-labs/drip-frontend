import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import { FC } from 'react';
import { VaultProtoConfig } from '../component/VaultProtoConfig';

export const Admin: FC = () => {
  return (
    <Tabs>
      <TabList>
        <Tab>Vault Proto Config</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <VaultProtoConfig />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};
