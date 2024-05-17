import { ExecutionErrorData, WebSocketLoggingData, LogData, WebSocketMessage } from '@/api/types';
import { useEffect, useState } from 'react';
import { useWebSocket } from '../useWebsocket/useWebsocket';

export const useWorkflowExecutionWsLogs = () => {
  const { lastMessage } = useWebSocket();
  const [logs, setLogs] = useState<LogData[]>([]);

  useEffect(() => {
    const addLog = (log: LogData) => {
      setLogs((prevLogs) => [...prevLogs, log]);
    };

    const handleWebsocketMessage = (message: WebSocketMessage | null) => {
      if (!message?.data) return;

      if (message.data.type === 'execution_start') {
        setLogs([]);
      }

      if (message.data.type === 'execution_error') {
        const data = (message.data as ExecutionErrorData).data;
        if (data && data.error_message?.length > 0) {
          const log: LogData = {
            message: data.error_message,
            logger_name: 'salt',
            level: 'ERROR',
            filename: 'salt',
            module: 'salt',
          };
          addLog(log);
        }
      }

      if (message.data.type === 'salt.logging') {
        const data = (message.data as WebSocketLoggingData).data;
        if (data && data.message?.length > 0) {
          addLog(data);
        }
      }
    };

    handleWebsocketMessage(lastMessage);
  }, [lastMessage]);

  return logs;
};
