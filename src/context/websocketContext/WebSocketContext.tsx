import { ReactNode, createContext, useMemo, useState } from 'react';

export type WebSocketContextType = {
  socket: WebSocket | undefined;
};
export const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

type WebSocketProviderProps = {
  children: ReactNode;
};

export const WebSocketProvider = ({ children }: WebSocketProviderProps) => {
  const [socket, setSocket] = useState<WebSocket | undefined>(undefined);
  const wsUrl = import.meta.env.VITE_WEBSOCKET_URL;

  useMemo(() => {
    const ws = new WebSocket(wsUrl);
    setSocket(ws);
    return () => ws.close();
  }, [wsUrl]);
  const contextValue: WebSocketContextType = { socket };

  return <WebSocketContext.Provider value={contextValue}>{children}</WebSocketContext.Provider>;
};
