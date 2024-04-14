import { WebSocketContext } from '@/context/websocketContext/WebsocketContextProvider';
import { useContext } from 'react';

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);

  if (context === undefined) {
    throw new Error('useWebSocketContext must be used within a WebSocketProvider');
  }

  return context;
};
