
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
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: (tokenResponse: any) => Promise<any>;
  register: (email: string, password: string, name: string) => Promise<void>;
  registerAdmin: (email: string, password: string, name: string) => User;
  removeAdmin: (id: string) => void;
  getAdminUsers: () => User[];
  logout: () => void;
  openAuthDialog: () => void; // Add this method
};
