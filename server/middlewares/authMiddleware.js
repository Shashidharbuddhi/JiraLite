import jwt from 'jsonwebtoken';
import User, { USER_ROLES, normalizeUserRole } from '../models/User.js';
import Workspace, { WORKSPACE_STATUSES } from '../models/Workspace.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'No token provided'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId || decoded.id;
    const user = await User.findById(userId).select('-password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized access'
      });
    }

    user.role = normalizeUserRole(user.role);

    if (user.isSuspended) {
      return res.status(403).json({
        success: false,
        message: 'User account is suspended'
      });
    }

    if (user.role !== USER_ROLES.PLATFORM_ADMIN && user.workspaceId) {
      const workspace = await Workspace.findById(user.workspaceId).select('status name');

      if (!workspace || workspace.status === WORKSPACE_STATUSES.SUSPENDED) {
        return res.status(403).json({
          success: false,
          message: 'Workspace is suspended or unavailable'
        });
      }

      req.workspace = workspace;
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized access'
    });
  }
};

export const authorize = (...allowedRoles) => (req, res, next) => {
  const normalizedRole = normalizeUserRole(req.user?.role);

  if (!normalizedRole || !allowedRoles.includes(normalizedRole)) {
    return res.status(403).json({
      success: false,
      message: 'You are not authorized to access this resource'
    });
  }

  next();
};

export default protect;
