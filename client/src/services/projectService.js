import api from './axiosInstance';

const normalizeProjectPayload = (payload) => ({
  title: payload.title,
  description: payload.description,
  deadLine: payload.deadLine || payload.deadline || undefined,
  workspaceId: payload.workspaceId || undefined
});

export const projectService = {
  createProject: async (payload) => {
    const { data } = await api.post('/projects', normalizeProjectPayload(payload));
    return data;
  },

  getProjects: async () => {
    const { data } = await api.get('/projects');
    return data;
  },

  getProject: async (id) => {
    const { data } = await api.get(`/projects/${id}`);
    return data;
  },

  updateProject: async ({ id, payload }) => {
    const { data } = await api.patch(`/projects/${id}`, normalizeProjectPayload(payload));
    return data;
  },

  deleteProject: async (id) => {
    const { data } = await api.delete(`/projects/${id}`);
    return data;
  }
};
