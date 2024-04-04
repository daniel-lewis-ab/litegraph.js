import { WebSocketMessage } from '@/api/types';
import { constants } from '@/contants';
import { ReactNode, createContext, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import useWebSocket, { ReadyState, SendMessage } from 'react-use-websocket';

type WebSocketContextType = {
  lastMessage: WebSocketMessage | null;
  readyState: ReadyState;
  sendMessage: SendMessage;
};

export const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const WebSocketProvider = ({ children }: { children: ReactNode }) => {
  const [lastMessageData, setLastMessageData] = useState<WebSocketMessage | null>(null);
  // @TODO: Add token refresh logic (once backend returns auth error)
  const token = localStorage.getItem('accessToken');
  const websocketUrl = import.meta.env.VITE_WEBSOCKET_URL + '?bearer=' + token;
  const { lastMessage, readyState, sendMessage } = useWebSocket(websocketUrl, {
    share: true,
    retryOnError: true,
    reconnectAttempts: constants.websocketReconnectAttempts,
    shouldReconnect: () => true,
    onReconnectStop: (numAttempts) => {
      if (numAttempts === constants.websocketReconnectAttempts) {
        toast.error('Unable to update in real-time. Check your internet connection or try again later.', {
          position: 'bottom-center',
        });
      }
    },
  });

  useEffect(() => {
    if (lastMessage?.data) {
      try {
        const message: WebSocketMessage = JSON.parse(lastMessage.data as string);

        // @TODO: Filter out websocket messages to only send the ones that we need + correctly type them
        setLastMessageData(message);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Error parsing websocket message', e);
      }
    }
  }, [lastMessage]);

  const contextValue = useMemo(
    () => ({
      lastMessage: lastMessageData,
      readyState,
      sendMessage,
    }),
    [lastMessageData, readyState, sendMessage],
  );

  return <WebSocketContext.Provider value={contextValue}>{children}</WebSocketContext.Provider>;
};
