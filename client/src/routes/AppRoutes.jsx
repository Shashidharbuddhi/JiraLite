import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from '../components/common/ProtectedRoute';
import AuthLayout from '../layouts/AuthLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import AdminLogin from '../pages/auth/AdminLogin';
import ForgotPassword from '../pages/auth/ForgotPassword';
import ResetPassword from '../pages/auth/ResetPassword';
import VerifyEmail from '../pages/auth/VerifyEmail';
import Dashboard from '../pages/dashboard/Dashboard';
import Projects from '../pages/projects/Projects';
import ProjectDetails from '../pages/projects/ProjectDetails';
import Tasks from '../pages/tasks/Tasks';
import WorkspaceSettings from '../pages/workspace/WorkspaceSettings';
import AdminConsole from '../pages/admin/AdminConsole';

const AppRoutes = () => (
  <Routes>
    <Route element={<AuthLayout />}>
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/verify-email/:token" element={<VerifyEmail />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
    </Route>

    <Route element={<ProtectedRoute />}>
      <Route element={<DashboardLayout />}>
        <Route index element={<Dashboard />} />
        <Route element={<ProtectedRoute allowedRoles={['platform_admin']} />}>
          <Route path="/admin-console" element={<AdminConsole />} />
        </Route>
        <Route element={<ProtectedRoute allowedRoles={['platform_admin', 'workspace_admin', 'workspace_member']} />}>
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:id" element={<ProjectDetails />} />
          <Route path="/tasks" element={<Tasks />} />
        </Route>
        <Route element={<ProtectedRoute allowedRoles={['workspace_admin']} />}>
          <Route path="/settings" element={<WorkspaceSettings />} />
        </Route>
      </Route>
    </Route>

    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default AppRoutes;
