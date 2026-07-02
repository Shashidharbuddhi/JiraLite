import { normalizeUserRole } from '../models/User.js';

export const buildAuthUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: normalizeUserRole(user.role),
  workspaceId: user.workspaceId || null
});

export default buildAuthUser;
