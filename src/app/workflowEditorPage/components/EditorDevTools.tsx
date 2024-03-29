import { useState } from 'react';
import { Button } from '@/shared/components/button/Button';
import { useWebsocket } from '@/hooks/useWebsocket/useWebsocket';

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
  const socket = useWebsocket();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sendMessage = (message: any) => {
    socket?.send(JSON.stringify(message));
  };

  return (
    <div className="absolute bottom-0 left-0 w-[400px] bg-surface-4 p-4 *:text-surface-2">
      <p>Send message from websocket:</p>
      <textarea className="h-96 w-full" onChange={(e) => setMsg(e.target.value)} value={msg} />
      <Button onClick={() => sendMessage(JSON.parse(msg))}>Send websocket echo</Button>
    </div>
  );
};
