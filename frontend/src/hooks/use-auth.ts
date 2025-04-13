import { create } from "zustand";
import { persist } from "zustand/middleware";

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
  authReady: boolean;
  setUser: (user: User) => void;
  logout: () => void;
  checkAuth: () => Promise<boolean>;
}

export const useAuth = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      authReady: false,
      setUser: (user) => set({ user, isAuthenticated: true }),

      logout: async () => {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/logout`,
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
            `${process.env.NEXT_PUBLIC_API_URL}/auth/verify-token`,
            {
              credentials: "include",
            }
          );

          if (!response.ok) {
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
              authReady: true,
            });
            return false;
          }

          const data = await response.json();
          if (!data.valid || !data.user) {
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
              authReady: true,
            });
            return false;
          }

          set({
            user: {
              id: data.user.id,
              email: data.user.email,
              fullname: data.user.fullname,
              role: data.user.role,
            },
            isAuthenticated: true,
            isLoading: false,
            authReady: true,
          });
          return true;
        } catch (error) {
          console.error("Auth check failed:", error);

          set({ user: null, isAuthenticated: false, authReady: true });
          return false;
        } finally {
          set({ isLoading: false, authReady: true });
        }
      },
    }),
    {
      name: "auth-store",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        authReady: state.authReady,
      }),
    }
  )
);
