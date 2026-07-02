import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { workspaceService } from '../../services/workspaceService';
import { getErrorMessage } from '../../utils/formatters';

const initialState = {
  workspace: null,
  loading: false,
  saving: false,
  error: null
};

export const fetchCurrentWorkspace = createAsyncThunk('workspace/current', async (_, { rejectWithValue }) => {
  try {
    return await workspaceService.getCurrentWorkspace();
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, 'Unable to load workspace'));
  }
});

export const inviteWorkspaceMember = createAsyncThunk('workspace/invite', async (payload, { rejectWithValue }) => {
  try {
    return await workspaceService.inviteMember(payload);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, 'Unable to invite member'));
  }
});

export const updateWorkspaceMember = createAsyncThunk('workspace/updateMember', async (payload, { rejectWithValue }) => {
  try {
    return await workspaceService.updateMember(payload);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, 'Unable to update member'));
  }
});

export const removeWorkspaceMember = createAsyncThunk('workspace/removeMember', async (memberId, { rejectWithValue }) => {
  try {
    await workspaceService.removeMember(memberId);
    return memberId;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, 'Unable to remove member'));
  }
});

const workspaceSlice = createSlice({
  name: 'workspace',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentWorkspace.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentWorkspace.fulfilled, (state, action) => {
        state.loading = false;
        state.workspace = action.payload.workspace;
      })
      .addCase(fetchCurrentWorkspace.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addMatcher(
        (action) =>
          ['workspace/invite/pending', 'workspace/updateMember/pending', 'workspace/removeMember/pending'].includes(action.type),
        (state) => {
          state.saving = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) =>
          ['workspace/invite/fulfilled', 'workspace/updateMember/fulfilled', 'workspace/removeMember/fulfilled'].includes(action.type),
        (state, action) => {
          state.saving = false;
          if (!state.workspace) {
            return;
          }

          if (action.type === 'workspace/invite/fulfilled') {
            state.workspace.members = [action.payload.member, ...(state.workspace.members || [])];
          }

          if (action.type === 'workspace/updateMember/fulfilled') {
            state.workspace.members = (state.workspace.members || []).map((member) =>
              member._id === action.payload.member._id ? action.payload.member : member
            );
          }

          if (action.type === 'workspace/removeMember/fulfilled') {
            state.workspace.members = (state.workspace.members || []).filter((member) => member._id !== action.payload);
          }
        }
      )
      .addMatcher(
        (action) =>
          ['workspace/invite/rejected', 'workspace/updateMember/rejected', 'workspace/removeMember/rejected'].includes(action.type),
        (state, action) => {
          state.saving = false;
          state.error = action.payload;
        }
      );
  }
});

export default workspaceSlice.reducer;
