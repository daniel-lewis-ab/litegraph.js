import { RouterProvider } from 'react-router-dom';
import { router } from '@/app/router/router';
import { AuthContextProvider } from '@/context/authContext/AuthContext';

function App() {
  return (
    <AuthContextProvider>
      <RouterProvider router={router} />
    </AuthContextProvider>
  );
}

export default App;
