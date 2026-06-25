import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import router from './routes';

const App = () => {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#FFFFFF',
            color: '#111111',
            border: '1px solid #E9ECEF',
            borderRadius: '12px',
            fontSize: '14px',
          },
          success: {
            iconTheme: { primary: '#00D68F', secondary: '#0A0A0A' },
          },
          error: {
            iconTheme: { primary: '#FF3D71', secondary: '#0A0A0A' },
          },
        }}
      />
      <RouterProvider router={router} />
    </>
  );
};

export default App;
