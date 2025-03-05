interface SignupData {
  fullname: string;
  email: string;
  password: string;
}

interface SigninData {
  email: string;
  password: string;
}

const API_BASE_URL = "http://localhost:8000/api/v1/auth";

export const authService = {
  async signup(data: SignupData) {
    const response = await fetch(`${API_BASE_URL}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Signup failed");
    }

    return response.json();
  },

  async signin(data: SigninData) {
    const response = await fetch(`${API_BASE_URL}/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Signin failed");
    }

    return response.json();
  },
};
