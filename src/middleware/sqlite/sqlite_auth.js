import jwt from 'jsonwebtoken';
import { checkPermission } from "../models/sqlite_user.js";

export function authenticate(req, c) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    c.set('user', decoded); // Store user in context
    return null;
  } catch (error) {
    return c.json({ error: 'Invalid token' }, 401);
  }
}

export function authorize(resourceType, resourceId, action) {
  return async (req, c) => {
    const user = c.get('user');
    if (!user) return c.json({ error: 'Unauthorized' }, 401);

    const hasPermission = await checkPermission(user, resourceType, resourceId, action);
    if (!hasPermission) {
      return c.json({ error: 'Forbidden' }, 403);
    }
    return null;
  };
}
