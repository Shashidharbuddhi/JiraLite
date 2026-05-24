import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import AppRoutes from './routes/AppRoutes';
import { fetchMe } from './redux/slices/authSlice';

const App = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const theme = useSelector((state) => state.ui.theme);

  useEffect(() => {
    if (token) dispatch(fetchMe());
  }, [dispatch, token]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.style.colorScheme = theme;
  }, [theme]);

  return (
    <>
      <AppRoutes />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: '8px',
            border: theme === 'dark' ? '1px solid #334155' : '1px solid #e2e8f0',
            background: theme === 'dark' ? '#0f172a' : '#ffffff',
            color: theme === 'dark' ? '#e2e8f0' : '#0f172a',
            boxShadow: '0 12px 30px rgba(15, 23, 42, 0.18)'
          }
        }}
      />
    </>
  );
};

export default App;
