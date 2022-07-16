import { createContext, useContext } from 'react';

export interface RefreshContextProps {
  refreshTrigger: boolean;
  forceRefresh: () => void;
}

export const RefreshContext = createContext<RefreshContextProps>({
  refreshTrigger: false,
  forceRefresh: () => {
    console.log('undefined forceRefresh');
  }
});

export function useRefreshContext(): RefreshContextProps {
  const refreshContext = useContext(RefreshContext);
  return refreshContext;
}
