import { useInterval } from '@chakra-ui/react';
import { useCallback, useEffect, useState } from 'react';

export function useStateRefresh(): [refreshTrigger: boolean, forceRefresh: () => void] {
  const [refreshTrigger, setRefreshTrigger] = useState<boolean>(false);

  useInterval(() => {
    console.log('interval refresh');
    setRefreshTrigger((x) => !x);
  }, 10_000);

  useEffect(() => {
    console.log('updated refresh', refreshTrigger);
  }, [refreshTrigger]);

  const forceRefresh = useCallback(() => {
    setRefreshTrigger((x) => !x);
  }, [setRefreshTrigger]);

  return [refreshTrigger, forceRefresh];
}
