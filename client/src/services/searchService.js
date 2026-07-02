import api from './axiosInstance';

export const searchService = {
  search: async (query) => {
    const { data } = await api.get('/search', {
      params: { q: query }
    });
    return data;
  }
};
