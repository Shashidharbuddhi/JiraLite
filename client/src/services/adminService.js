import api from './axiosInstance';

export const adminService = {
  getAnalytics: async () => {
    const { data } = await api.get('/admin/analytics');
    return data;
  },
  getWorkspaces: async () => {
    const { data } = await api.get('/admin/workspaces');
    return data;
  },
  getUsers: async () => {
    const { data } = await api.get('/admin/users');
    return data;
  },
  updateWorkspaceStatus: async ({ workspaceId, status }) => {
    const { data } = await api.patch(`/admin/workspaces/${workspaceId}/status`, { status });
    return data;
  },
  deleteWorkspace: async (workspaceId) => {
    const { data } = await api.delete(`/admin/workspaces/${workspaceId}`);
    return data;
  },
  deleteUser: async (userId) => {
    const { data } = await api.delete(`/admin/users/${userId}`);
    return data;
  }
};
