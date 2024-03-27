import { ReactNode, createContext, useMemo, useState } from 'react';

export const WebSocketContext = createContext<WebSocket | undefined>(undefined);

type WebSocketProviderProps = {
  children: ReactNode;
};

export const WebSocketProvider = ({ children }: WebSocketProviderProps) => {
  const [socket, setSocket] = useState<WebSocket | undefined>(undefined);
  const wsUrl = import.meta.env.VITE_WEBSOCKET_URL;

  useMemo(() => {
    const token = localStorage.getItem('accessToken');
    // @TODO Handle a null token
    const ws = new WebSocket(wsUrl + '?bearer=' + token);
    setSocket(ws);
    return () => ws.close();
  }, [wsUrl]);

  return <WebSocketContext.Provider value={socket}>{children}</WebSocketContext.Provider>;
};
