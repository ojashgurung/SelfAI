// const API_BASE_URL = "http://localhost:8000/api/v1/user";

// export interface UserInfo {
//   user_id: string;
//   fullname: string;
//   email: string;
//   role
// }

// export const UserService = {
//   async getCurrentUser(): Promise<UserInfo> {
//     const accessToken = document.cookie
//       .split("; ")
//       .find((row) => row.startsWith("access_token="))
//       ?.split("=")[1];

//     const response = await fetch(`${API_BASE_URL}/me`, {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//     });

//     if (!response.ok) {
//       throw new Error("Failed to fetch user info");
//     }

//     return response.json();
//   },
// };
