import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { taskService } from '../../services/taskService';
import { getErrorMessage } from '../../utils/formatters';

const initialState = {
  tasks: [],
  activity: [],
  totalTasks: 0,
  totalPages: 1,
  currentPage: 1,
  loading: false,
  activityLoading: false,
  saving: false,
  error: null
};

export const fetchTasks = createAsyncThunk('tasks/fetchAll', async (params = {}, { rejectWithValue }) => {
  try {
    return await taskService.getTasks(params);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, 'Unable to load tasks'));
  }
});

export const createTask = createAsyncThunk('tasks/create', async (payload, { rejectWithValue }) => {
  try {
    return await taskService.createTask(payload);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, 'Unable to create task'));
  }
});

export const updateTask = createAsyncThunk('tasks/update', async (payload, { rejectWithValue }) => {
  try {
    return await taskService.updateTask(payload);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, 'Unable to update task'));
  }
});

export const deleteTask = createAsyncThunk('tasks/delete', async (id, { rejectWithValue }) => {
  try {
    await taskService.deleteTask(id);
    return id;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, 'Unable to delete task'));
  }
});

export const fetchActivity = createAsyncThunk('tasks/activity', async (_, { rejectWithValue }) => {
  try {
    return await taskService.getActivity();
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, 'Unable to load activity'));
  }
});

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    clearTaskError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload.tasks || [];
        state.totalTasks = action.payload.totalTasks || action.payload.tasks?.length || 0;
        state.totalPages = action.payload.totalPages || 1;
        state.currentPage = action.payload.currentPage || 1;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchActivity.pending, (state) => {
        state.activityLoading = true;
      })
      .addCase(fetchActivity.fulfilled, (state, action) => {
        state.activityLoading = false;
        state.activity = action.payload.activities || [];
      })
      .addCase(fetchActivity.rejected, (state) => {
        state.activityLoading = false;
      })
      .addMatcher(
        (action) => ['tasks/create/pending', 'tasks/update/pending', 'tasks/delete/pending'].includes(action.type),
        (state) => {
          state.saving = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) => ['tasks/create/fulfilled', 'tasks/update/fulfilled', 'tasks/delete/fulfilled'].includes(action.type),
        (state, action) => {
          state.saving = false;
          if (action.type === 'tasks/create/fulfilled') state.tasks.unshift(action.payload.task);
          if (action.type === 'tasks/update/fulfilled') {
            state.tasks = state.tasks.map((task) => (task._id === action.payload.task._id ? action.payload.task : task));
          }
          if (action.type === 'tasks/delete/fulfilled') {
            state.tasks = state.tasks.filter((task) => task._id !== action.payload);
          }
        }
      )
      .addMatcher(
        (action) => ['tasks/create/rejected', 'tasks/update/rejected', 'tasks/delete/rejected'].includes(action.type),
        (state, action) => {
          state.saving = false;
          state.error = action.payload;
        }
      );
  }
});

export const { clearTaskError } = taskSlice.actions;
export default taskSlice.reducer;
