import { User as NextAuthUser } from 'next-auth';

declare module 'next-auth' {
  interface User extends NextAuthUser {
    role: 'customer' | 'owner';
  }

  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: 'customer' | 'owner';
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: 'customer' | 'owner';
  }
}