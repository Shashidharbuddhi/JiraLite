import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { adminService } from '../../services/adminService';
import { getErrorMessage } from '../../utils/formatters';

const initialState = {
  analytics: null,
  workspaces: [],
  users: [],
  loading: false,
  saving: false,
  error: null
};

export const fetchAdminOverview = createAsyncThunk('admin/overview', async (_, { rejectWithValue }) => {
  try {
    const [analytics, workspaces, users] = await Promise.all([
      adminService.getAnalytics(),
      adminService.getWorkspaces(),
      adminService.getUsers()
    ]);

    return {
      analytics: analytics.analytics,
      workspaces: workspaces.workspaces || [],
      users: users.users || []
    };
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, 'Unable to load admin overview'));
  }
});

export const changeWorkspaceStatus = createAsyncThunk('admin/changeWorkspaceStatus', async (payload, { rejectWithValue }) => {
  try {
    return await adminService.updateWorkspaceStatus(payload);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, 'Unable to update workspace status'));
  }
});

export const destroyWorkspace = createAsyncThunk('admin/destroyWorkspace', async (workspaceId, { rejectWithValue }) => {
  try {
    await adminService.deleteWorkspace(workspaceId);
    return workspaceId;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, 'Unable to delete workspace'));
  }
});

export const destroyUser = createAsyncThunk('admin/destroyUser', async (userId, { rejectWithValue }) => {
  try {
    const response = await adminService.deleteUser(userId);
    return response.userId;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, 'Unable to delete user'));
  }
});

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminOverview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminOverview.fulfilled, (state, action) => {
        state.loading = false;
        state.analytics = action.payload.analytics;
        state.workspaces = action.payload.workspaces;
        state.users = action.payload.users;
      })
      .addCase(fetchAdminOverview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addMatcher(
        (action) =>
          ['admin/changeWorkspaceStatus/pending', 'admin/destroyWorkspace/pending', 'admin/destroyUser/pending'].includes(
            action.type
          ),
        (state) => {
          state.saving = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) =>
          ['admin/changeWorkspaceStatus/fulfilled', 'admin/destroyWorkspace/fulfilled', 'admin/destroyUser/fulfilled'].includes(
            action.type
          ),
        (state, action) => {
          state.saving = false;
          if (action.type === 'admin/changeWorkspaceStatus/fulfilled') {
            state.workspaces = state.workspaces.map((workspace) =>
              workspace._id === action.payload.workspace._id ? action.payload.workspace : workspace
            );
          }
          if (action.type === 'admin/destroyWorkspace/fulfilled') {
            state.workspaces = state.workspaces.filter((workspace) => workspace._id !== action.payload);
          }
          if (action.type === 'admin/destroyUser/fulfilled') {
            state.users = state.users.filter((user) => user._id !== action.payload);
          }
        }
      )
      .addMatcher(
        (action) =>
          ['admin/changeWorkspaceStatus/rejected', 'admin/destroyWorkspace/rejected', 'admin/destroyUser/rejected'].includes(
            action.type
          ),
        (state, action) => {
          state.saving = false;
          state.error = action.payload;
        }
      );
  }
});

export default adminSlice.reducer;
