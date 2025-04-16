interface SignupData {
  fullname: string;
  email: string;
  password: string;
}

interface SigninData {
  email: string;
  password: string;
}

const AUTH_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/auth`;

export const authService = {
  async signup(data: SignupData) {
    const response = await fetch(`${AUTH_BASE_URL}/signup`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.detail || "Signup failed");
    }
    return result;
  },

  async signin(data: SigninData) {
    const response = await fetch(`${AUTH_BASE_URL}/signin`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Signin failed");
    }
    return result;
  },

  async handleOAuthLogin(provider: "google" | "github" | "linkedin") {
    window.location.href = `${AUTH_BASE_URL}/login/${provider}`;
  },
};
