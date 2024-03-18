import { RouterProvider } from 'react-router-dom';
import { router } from '@/app/router/router';
import { AuthContextProvider } from '@/context/authContext/AuthContext';
import { QueryClientProvider } from '@/providers/QueryClientProvider';
import { Toaster } from 'react-hot-toast';
import { WebSocketProvider } from '@/context/websocketContext/WebSocketContext';
import { createPortal } from 'react-dom';

function App() {
  return (
    <AuthContextProvider>
      <QueryClientProvider>
        <WebSocketProvider>
          {createPortal(
            <Toaster
              position="bottom-right"
              toastOptions={{
                // success: { className: '!bg-success-10' },
                error: { className: '!bg-error-10 !text-white' },
              }}
            />,
            document.body,
          )}
          <RouterProvider router={router} />
        </WebSocketProvider>
      </QueryClientProvider>
    </AuthContextProvider>
  );
}

export default App;
