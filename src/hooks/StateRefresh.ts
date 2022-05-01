import { useInterval } from '@chakra-ui/react';
import { useState } from 'react';

export function useStateRefresh(): boolean {
  const [refreshTrigger, setRefreshTrigger] = useState<boolean>(false);

  useInterval(() => {
    setRefreshTrigger((x) => !x);
  }, 10_000);

  return refreshTrigger;
}
