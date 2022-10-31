import { createContext, useContext } from 'react';

export interface RefreshContext {
  refreshTrigger: boolean;
  forceRefresh: () => void;
}

export const RefreshContext = createContext<RefreshContext>({
  refreshTrigger: false,
  forceRefresh: () => {
    console.log('undefined forceRefresh');
  }
});

export function useRefreshContext(): RefreshContext {
  const refreshContext = useContext(RefreshContext);
  return refreshContext;
}
