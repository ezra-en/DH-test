import { Context, Next } from 'hono';
import { verifyToken, User } from './auth';

export interface AuthContext extends Context {
  user?: User;
}

export const authMiddleware = async (c: AuthContext, next: Next) => {
  const authHeader = c.req.header('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized - No token provided' }, 401);
  }

  const token = authHeader.substring(7); // Remove 'Bearer ' prefix
  const user = await verifyToken(token); // Now async

  if (!user) {
    return c.json({ error: 'Unauthorized - Invalid token' }, 401);
  }

  c.user = user;
  await next();
};
