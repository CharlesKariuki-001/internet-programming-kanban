import React, { useCallback, useState, createContext, useContext } from 'react';
import { ConnectionMode, HAS_LIVE_API } from '../services/api';
interface ConnectionContextValue {
  mode: ConnectionMode;
  toggle: () => void;
  setMode: (mode: ConnectionMode) => void;
  hasLiveApi: boolean;
}
const ConnectionContext = createContext<ConnectionContextValue | null>(null);
export function ConnectionProvider({
  children


}: {children: React.ReactNode;}) {
  const [mode, setMode] = useState<ConnectionMode>('local');
  const toggle = useCallback(() => {
    setMode((prev) => prev === 'local' ? 'cloud' : 'local');
  }, []);
  return (
    <ConnectionContext.Provider
      value={{
        mode,
        toggle,
        setMode,
        hasLiveApi: HAS_LIVE_API
      }}>
      
      {children}
    </ConnectionContext.Provider>);

}
export function useConnection() {
  const ctx = useContext(ConnectionContext);
  if (!ctx)
  throw new Error('useConnection must be used within ConnectionProvider');
  return ctx;
}