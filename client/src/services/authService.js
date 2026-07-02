import api from './axiosInstance';

export const authService = {
  register: async (payload) => {
    const { data } = await api.post('/auth/register', payload);
    return data;
  },

  verifyEmailRegistration: async (token) => {
    const { data } = await api.get(`/auth/verify-email/${token}`);
    return data;
  },

  login: async (payload) => {
    const endpoint = payload.portal === 'admin' ? '/auth/admin/login' : '/auth/login';
    const { data } = await api.post(endpoint, payload);
    return data;
  },

  me: async () => {
    const { data } = await api.get('/auth/me');
    return data;
  },

  forgotPassword: async (payload) => {
    const { data } = await api.post('/auth/forgot-password', payload);
    return data;
  },

  resetPassword: async ({ token, password }) => {
    const { data } = await api.post(`/auth/reset-password/${token}`, { password });
    return data;
  }
};
