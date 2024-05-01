import { ExecutionErrorData, WebSocketMessage } from '@/api/types';
import { useEffect, useState } from 'react';
import { useWebSocket } from '../useWebsocket/useWebsocket';

export const useWorkflowExecutionWsLogs = () => {
  const { lastMessage } = useWebSocket();
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const handleWebsocketMessage = (message: WebSocketMessage | null) => {
      if (!message?.data) return;

      if (message.data.type === 'execution_start') {
        setLogs([]);
      }

      if (message.data.type === 'execution_error') {
        const data = (message.data as ExecutionErrorData).data;
        if (data && data.error_message.length > 0) {
          setLogs([data.error_message]);
        }
      }
    };

    handleWebsocketMessage(lastMessage);
  }, [lastMessage]);

  return logs;
};
