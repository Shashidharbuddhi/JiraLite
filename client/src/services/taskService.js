import api from './axiosInstance';

export const taskService = {
  createTask: async (payload) => {
    const { data } = await api.post('/tasks', payload);
    return data;
  },

  getTasks: async (params = {}) => {
    const { data } = await api.get('/tasks', { params });
    return data;
  },

  updateTask: async ({ id, payload }) => {
    const { data } = await api.patch(`/tasks/${id}`, payload);
    return data;
  },

  deleteTask: async (id) => {
    const { data } = await api.delete(`/tasks/${id}`);
    return data;
  },

  getActivity: async () => {
    const { data } = await api.get('/activity');
    return data;
  }
};
