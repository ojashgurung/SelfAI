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

export const ChatService = {
  async getMasterSession(): Promise<ChatSession | null> {
    try {
      const response = await fetch(`${CHAT_BASE_URL}/sessions/master`, {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Unauthorized. Please login again.");
        }
        if (response.status === 404) {
          return null;
        }
        throw new Error(
          `Failed to fetch master session: ${response.statusText}`
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Master session fetch error:", error);
      throw error;
    }
  },

  async getChatHistory(): Promise<ChatSession[]> {
    try {
      const response = await fetch(`${CHAT_BASE_URL}/sessions/connections`, {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Chat history error:", {
          status: response.status,
          statusText: response.statusText,
          error: errorText,
        });

        if (response.status === 401) {
          throw new Error("Unauthorized. Please login again.");
        }
        if (response.status === 404) {
          return [];
        }
        throw new Error(
          `Failed to fetch chat history: ${errorText || response.statusText}`
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Chat history fetch error:", error);
      throw error;
    }
  },
  async getJoinChatSession(token: string) {
    try {
      const response = await fetch(`${CHAT_BASE_URL}/public/${token}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Chat history error:", {
          status: response.status,
          statusText: response.statusText,
          error: errorText,
        });
        if (response.status === 401) {
          throw new Error("Please login to join this chat");
        }
        if (response.status === 404) {
          throw new Error("Invalid share token or chat not found");
        }
        throw new Error("Failed to join chat");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Join chat error:", error);
      throw error;
    }
  },

  async getRecentInteractions() {
    try {
      const response = await fetch(`${CHAT_BASE_URL}/recent-interactions`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Recent interactions error:", {
          status: response.status,
          statusText: response.statusText,
          error: errorText,
        });
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Join chat error:", error);
      throw error;
    }
  },
};
