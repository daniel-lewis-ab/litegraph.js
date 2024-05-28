export const initWebsocket = (app: any) => {
  (app as any).ws('/echo', (ws: any, _req: any) => {
    console.log('WebSocket connection established');

    ws.on('message', (msg: any) => {
      console.log(`Received message: ${msg}`);
      if (msg.includes('CL')) {
        console.log('Closing WebSocket connection by server request');
        ws.close(1001, 'Closing by request'); // 100 is a normal close
        return;
      }

      ws.send(msg); // Echoes received messages back to the client
    });

    ws.on('close', () => {
      console.log('WebSocket connection closed');
    });
  });
}
