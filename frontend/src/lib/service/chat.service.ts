const API_BASE_URL = "http://localhost:8000/api/v1/chat";

interface ChatSession {
  id: string;
  share_token: string;
  created_at: string;
}

interface ChatSessionData {
  namespace: string;
  title: string;
  is_public: boolean;
}

export const ChatService = {
  async createSession(data: ChatSessionData): Promise<ChatSession> {
    const accessToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("access_token="))
      ?.split("=")[1];
    const response = await fetch(`${API_BASE_URL}/sessions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Unauthorized. Please login again.");
      }
      throw new Error("Failed to create chat session at the moment");
    }

    return response.json();
  },
};
