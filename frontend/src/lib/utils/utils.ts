import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// export const TokenService = {
//   setTokens(access: string, refresh: string) {
//     Cookies.set("access_token", access, { expires: 1, secure: true });
//     Cookies.set("refresh_token", refresh, { expires: 2, secure: true });
//   },

//   getAccessToken() {
//     return Cookies.get("access_token");
//   },

//   getRefreshToken() {
//     return Cookies.get("refresh_token");
//   },

//   removeTokens() {
//     Cookies.remove("access_token");
//     Cookies.remove("refresh_token");
//   },
// };
