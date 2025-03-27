import { create } from "zustand";

interface User {
  id: string;
  email: string;
  fullname: string;
  role: string;
}

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User) => void;
  logout: () => void;
  checkAuth: () => Promise<boolean>;
}

export const useAuth = create<AuthStore>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  setUser: (user) => set({ user, isAuthenticated: true }),

  logout: async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/logout`,
        {
          method: "POST",
          credentials: "include",
        }
      );
      if (!response.ok) {
        throw new Error("Logout failed");
      }

      set({ user: null, isAuthenticated: false });
    } catch (error) {
      console.error("Logout failed:", error);

      set({ user: null, isAuthenticated: false });
    }
  },
  checkAuth: async () => {
    try {
      set({ isLoading: true });
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/verify-token`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        set({ user: null, isAuthenticated: false });
        return false;
      }

      const data = await response.json();
      if (data.user) {
        set({
          user: {
            id: data.user.user_id,
            email: data.user.email,
            fullname: data.user.fullname,
            role: data.user.role,
          },
          isAuthenticated: true,
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error("Auth check failed:", error);

      set({ user: null, isAuthenticated: false });
      return false;
    } finally {
      set({ isLoading: false });
    }
  },
}));
