import { RouterProvider } from 'react-router-dom';
import { router } from '@/app/router/router';
import { AuthContextProvider } from '@/context/authContext/AuthContext';
import { QueryClientProvider } from '@/providers/QueryClientProvider';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <AuthContextProvider>
      <QueryClientProvider>
        <RouterProvider router={router} />
        <Toaster
          position="bottom-right"
          toastOptions={{ success: { className: '!bg-success' }, error: { className: '!bg-error !text-white' } }}
        />
      </QueryClientProvider>
    </AuthContextProvider>
  );
}

export default App;
