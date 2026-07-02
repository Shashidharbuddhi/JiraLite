import api from './axiosInstance';

export const workspaceService = {
  getCurrentWorkspace: async () => {
    const { data } = await api.get('/workspaces/current');
    return data;
  },
  inviteMember: async (payload) => {
    const { data } = await api.post('/workspaces/current/members', payload);
    return data;
  },
  updateMember: async ({ memberId, payload }) => {
    const { data } = await api.patch(`/workspaces/current/members/${memberId}`, payload);
    return data;
  },
  removeMember: async (memberId) => {
    const { data } = await api.delete(`/workspaces/current/members/${memberId}`);
    return data;
  }
};
