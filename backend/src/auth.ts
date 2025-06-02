import * as jose from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production'
);

export interface User {
  id: number;
  email: string;
}

export const generateToken = async (user: User): Promise<string> => {
  return await new jose.SignJWT({ 
    id: user.id, 
    email: user.email 
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(JWT_SECRET);
};

export const verifyToken = async (token: string): Promise<User | null> => {
  try {
    const { payload } = await jose.jwtVerify(token, JWT_SECRET);
    return { 
      id: payload.id as number, 
      email: payload.email as string 
    };
  } catch (error) {
    return null;
  }
};

export const hashPassword = async (password: string): Promise<string> => {
  return await Bun.password.hash(password);
};

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return await Bun.password.verify(password, hash);
};
