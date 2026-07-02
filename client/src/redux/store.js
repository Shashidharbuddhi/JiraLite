import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import adminReducer from './slices/adminSlice';
import projectReducer from './slices/projectSlice';
import taskReducer from './slices/taskSlice';
import uiReducer from './slices/uiSlice';
import workspaceReducer from './slices/workspaceSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    admin: adminReducer,
    projects: projectReducer,
    tasks: taskReducer,
    ui: uiReducer,
    workspace: workspaceReducer
  }
});
