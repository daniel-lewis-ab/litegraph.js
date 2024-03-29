import { WebSocketContext } from '@/context/websocketContext/WebSocketContext';
import { useContext } from 'react';

export const useWebsocket = () => {
  const socket = useContext(WebSocketContext);

  if (!socket) {
    throw new Error('useWebsocket must be used within a WebSocketProvider');
  }

  return socket;
};
