
export type User = {
  id: string;
  email: string;
  name: string;
  role: "admin" | "user";
};

export type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<any>;
  loginWithGoogle: (tokenResponse: any) => Promise<any>;
  register: (email: string, password: string, name: string) => Promise<any>;
  logout: () => Promise<void>;
  openAuthDialog: () => void;
};
