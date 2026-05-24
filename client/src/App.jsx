import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import AppRoutes from './routes/AppRoutes';
import { fetchMe } from './redux/slices/authSlice';

const App = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token) dispatch(fetchMe());
  }, [dispatch, token]);

  return (
    <>
      <AppRoutes />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 12px 30px rgba(15, 23, 42, 0.08)'
          }
        }}
      />
    </>
  );
};

export default App;
