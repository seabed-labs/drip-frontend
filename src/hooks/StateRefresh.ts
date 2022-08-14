import { useInterval } from '@chakra-ui/react';
import { useCallback, useState } from 'react';

export function useStateRefresh(): [refreshTrigger: boolean, forceRefresh: () => void] {
  const [refreshTrigger, setRefreshTrigger] = useState<boolean>(false);

  useInterval(() => {
    setRefreshTrigger((x) => !x);
  }, 10_000);

  const forceRefresh = useCallback(() => {
    setRefreshTrigger((x) => !x);
  }, [setRefreshTrigger]);

  return [refreshTrigger, forceRefresh];
}
