import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  email: string;
  fullname: string;
  role: string;
  profile_image?: string;
}

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User) => void;
  logout: () => void;
  checkAuth: () => Promise<boolean>;
  refreshToken: () => Promise<boolean>;
}

export const useAuth = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,
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
        } catch (error) {
          console.error("Logout failed:", error);
        } finally {
          set({ user: null, isAuthenticated: false, isLoading: false });
        }
      },

      refreshToken: async () => {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`,
            {
              method: "POST",
              credentials: "include",
            }
          );

          if (!response.ok) {
            throw new Error("Failed to refresh token");
          }
          const data = await response.json();
          console.log(data);
          if (data.message === "Token refreshed") {
            return true;
          }
          return false;
        } catch (error) {
          console.error("Token refresh failed:", error);
          set({ user: null, isAuthenticated: false, isLoading: false });
          return false;
        }
      },

      checkAuth: async () => {
        set({ isLoading: true });

        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/verify-token`,
            {
              credentials: "include",
            }
          );

          if (!response.ok) {
            const refreshed = await get().refreshToken();
            if (refreshed) {
              const retryResponse = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/auth/verify-token`,
                {
                  credentials: "include",
                }
              );

              if (retryResponse.ok) {
                const data = await retryResponse.json();
                if (data.valid && data.user) {
                  set({
                    user: {
                      id: data.user.id,
                      email: data.user.email,
                      fullname: data.user.fullname,
                      role: data.user.role,
                      profile_image: data.user.profile_image,
                    },
                    isAuthenticated: true,
                    isLoading: false,
                  });
                  return true;
                }
              }
            }
            set({ user: null, isAuthenticated: false, isLoading: false });
            return false;
          }

          const data = await response.json();

          if (data.valid && data.user) {
            set({
              user: {
                id: data.user.id,
                email: data.user.email,
                fullname: data.user.fullname,
                role: data.user.role,
                profile_image: data.user.profile_image,
              },
              isAuthenticated: true,
              isLoading: false,
            });
            return true;
          }
          return false;
        } catch (error) {
          console.error("Auth check failed:", error);

          set({ user: null, isAuthenticated: false, isLoading: false });
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
