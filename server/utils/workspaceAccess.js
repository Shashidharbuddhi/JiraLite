import { USER_ROLES, normalizeUserRole } from '../models/User.js';

export const isPlatformAdmin = (user) =>
  normalizeUserRole(user?.role) === USER_ROLES.PLATFORM_ADMIN;

export const ensureWorkspaceAccess = (resourceWorkspaceId, user) => {
  if (isPlatformAdmin(user)) {
    return true;
  }

  if (!resourceWorkspaceId || !user?.workspaceId) {
    return false;
  }

  return resourceWorkspaceId.toString() === user.workspaceId.toString();
};

export default ensureWorkspaceAccess;
