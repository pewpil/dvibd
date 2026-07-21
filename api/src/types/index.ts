// types/index.ts
// Shared, app-wide TypeScript types live here.

export interface AuthUser {
  id: string;
  email: string;
  username: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}
