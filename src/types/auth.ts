export interface AuthUser {
  id: string;
  username: string;
  name: string;
  role: 'admin' | 'manager';
}

export interface AuthContextType {
  user: AuthUser | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}
