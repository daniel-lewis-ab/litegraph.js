/* eslint-disable no-console */
import { useState } from 'react';
import { Button } from '@/shared/components/button/Button';
import { useWebSocket } from '@/hooks/useWebsocket/useWebsocket';

export const EditorDevTools = () => {
  const [msg, setMsg] = useState<string>(`{
    "errors": [],
    "data": {
        "type": "executing",
        "data": {
            "node": "1",
            "prompt_id": "2b850387-f84c-48a9-8370-af35ff1033c9",
            "execution_id": "f8a3dd12-d851-4926-b772-f856f0bacc7f"
        }
    },
    "action": "artcraft_status",
    "response_status": 200,
    "request_id": null
}
`);
  const { sendMessage } = useWebSocket();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sendWebsocketMessage = (message: any) => {
    try {
      const msg = JSON.stringify(message);
      sendMessage(msg);
    } catch (e) {
      console.error('Error parsing JSON', e);
      sendMessage(message as string);
      return;
    }
  };

  return (
    <div className="absolute bottom-0 right-0 w-[400px] bg-surface-4 p-2 *:text-surface-2">
      <p>Send message from websocket:</p>
      <textarea className="h-96 w-full" onChange={(e) => setMsg(e.target.value)} value={msg} />
      <Button onClick={() => sendWebsocketMessage(msg)}>Send websocket echo</Button>
    </div>
  );
};
