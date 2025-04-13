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
      setUser: (user) =>
        set({ user, isAuthenticated: true, authReady: true, isLoading: false }),

      logout: async () => {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/logout`,
            {
              method: "POST",
              credentials: "include",
              headers: {
                Accept: "application/json",
              },
            }
          );
          if (!response.ok) {
            throw new Error("Logout failed");
          }
        } catch (error) {
          console.error("Logout failed:", error);
        } finally {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            authReady: true,
          });
        }
      },
      checkAuth: async () => {
        if (get().isLoading) {
          console.log("Already checking auth, skipping");
          return get().isAuthenticated;
        }
        try {
          set({ isLoading: true });
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/verify-token`,
            {
              credentials: "include",
              headers: {
                Accept: "application/json",
              },
            }
          );

          console.log("Auth check response:", response.status);
          const data = await response.json();

          if (!response.ok || !data.valid || !data.user) {
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
              authReady: true,
            });
            return false;
          }

          set({
            user: data.user,
            isAuthenticated: true,
            isLoading: false,
            authReady: true,
          });
          return true;
        } catch (error) {
          console.error("Auth check failed:", error);

          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            authReady: true,
          });
          return false;
        }
      },
    }),
    {
      name: "auth-store",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
