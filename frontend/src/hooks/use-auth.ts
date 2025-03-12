import { create } from "zustand";
import { TokenService } from "@/lib/utils/utils";

interface User {
  id: string;
  email: string;
  fullname: string;
}

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
  logout: () => void;
  getAuthHeader: () => { Authorization: string } | undefined;
}

export const useAuth = create<AuthStore>((set, get) => ({
  user: null,
  isAuthenticated: !!TokenService.getAccessToken(),
  setUser: (user) => set({ user, isAuthenticated: true }),
  logout: () => {
    TokenService.removeTokens();
    set({ user: null, isAuthenticated: false });
  },
  getAuthHeader: () => {
    const token = TokenService.getAccessToken();
    return token ? { Authorization: `Bearer ${token}` } : undefined;
  },
}));
