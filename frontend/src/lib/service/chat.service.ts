const CHAT_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/chat`;

interface ChatSession {
  id: string;
  user_id?: string;
  visitor_id?: string;
  share_token?: string;
  created_at: string;
  updated_at: string;
  messages: Array<{
    id: string;
    session_id: string;
    content: string;
    role: string;
    created_at: string;
  }>;
  namespace: string;
  title: string;
  is_public: boolean;
}

interface ChatSessionData {
  namespace: string;
  title: string;
  is_public: boolean;
}

export const ChatService = {
  async getMasterSession(): Promise<ChatSession> {
    const response = await fetch(`${CHAT_BASE_URL}/sessions/master`, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Unauthorized. Please login again.");
      }
      throw new Error("Failed to fetch master session");
    }

    return response.json();
  },

  async getChatHistory(): Promise<ChatSession[]> {
    const response = await fetch(`${CHAT_BASE_URL}/sessions/history`, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Unauthorized. Please login again.");
      }
      throw new Error("Failed to fetch chat history");
    }

    return response.json();
  },
};
