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
            background: '#1A1A1A',
            color: '#FAFAFA',
            border: '1px solid #2A2A2A',
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
