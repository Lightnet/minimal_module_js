import jwt from 'jsonwebtoken';

export function generateTestToken(user) {
  const secret = process.env.JWT_SECRET || 'your_jwt_secret'; // Match src/middleware/auth.js
  return jwt.sign(user, secret, { expiresIn: '1h' });
}