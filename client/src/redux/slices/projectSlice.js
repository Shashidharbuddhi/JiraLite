import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { projectService } from '../../services/projectService';
import { getErrorMessage } from '../../utils/formatters';

const initialState = {
  projects: [],
  currentProject: null,
  loading: false,
  saving: false,
  error: null
};

export const fetchProjects = createAsyncThunk('projects/fetchAll', async (_, { rejectWithValue }) => {
  try {
    return await projectService.getProjects();
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, 'Unable to load projects'));
  }
});

export const fetchProjectById = createAsyncThunk('projects/fetchOne', async (id, { rejectWithValue }) => {
  try {
    return await projectService.getProject(id);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, 'Unable to load project'));
  }
});

export const createProject = createAsyncThunk('projects/create', async (payload, { rejectWithValue }) => {
  try {
    return await projectService.createProject(payload);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, 'Unable to create project'));
  }
});

export const updateProject = createAsyncThunk('projects/update', async (payload, { rejectWithValue }) => {
  try {
    return await projectService.updateProject(payload);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, 'Unable to update project'));
  }
});

export const deleteProject = createAsyncThunk('projects/delete', async (id, { rejectWithValue }) => {
  try {
    await projectService.deleteProject(id);
    return id;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, 'Unable to delete project'));
  }
});

const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    clearProjectError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload.projects || [];
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchProjectById.fulfilled, (state, action) => {
        state.currentProject = action.payload.project;
      })
      .addMatcher(
        (action) => ['projects/create/pending', 'projects/update/pending', 'projects/delete/pending'].includes(action.type),
        (state) => {
          state.saving = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) => ['projects/create/fulfilled', 'projects/update/fulfilled', 'projects/delete/fulfilled'].includes(action.type),
        (state, action) => {
          state.saving = false;
          if (action.type === 'projects/create/fulfilled') state.projects.unshift(action.payload.project);
          if (action.type === 'projects/update/fulfilled') {
            state.projects = state.projects.map((project) =>
              project._id === action.payload.project._id ? action.payload.project : project
            );
            state.currentProject = action.payload.project;
          }
          if (action.type === 'projects/delete/fulfilled') {
            state.projects = state.projects.filter((project) => project._id !== action.payload);
          }
        }
      )
      .addMatcher(
        (action) => ['projects/create/rejected', 'projects/update/rejected', 'projects/delete/rejected'].includes(action.type),
        (state, action) => {
          state.saving = false;
          state.error = action.payload;
        }
      );
  }
});

export const { clearProjectError } = projectSlice.actions;
export default projectSlice.reducer;
