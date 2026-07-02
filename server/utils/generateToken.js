import jwt from 'jsonwebtoken';
import { normalizeUserRole } from '../models/User.js';

const generateToken = (user) =>
  jwt.sign(
    {
      userId: user._id,
      role: normalizeUserRole(user.role),
      workspaceId: user.workspaceId || null
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '7d'
    }
  );

export default generateToken;
