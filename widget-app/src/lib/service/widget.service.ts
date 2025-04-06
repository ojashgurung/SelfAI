import { WidgetPromptProps } from "@/types/widget";

export interface WidgetResponse {
  id: string;
  user_id: string;
  session_id: string;
  share_token: string;
  theme: string;
  color: string;
  heading: string;
  title: string;
  subtitle: string;
  prompts: WidgetPromptProps[];
  created_at: string;
  expires_at: string | null;
  is_active: boolean;
}

export interface SessionResponse {
  id: string;
  share_token: string;
  messages: any[];
  namespace: string;
  title: string;
  is_public: boolean;
  visitor_id: string;
}

const WIDGET_BASE_URL = "http://localhost:8000/api/v1/widget";
const CHAT_BASE_URL = "http://localhost:8000/api/v1/chat";

export const widgetService = {
  async getPublicWidget(widget_id: string) {
    const response = await fetch(`${WIDGET_BASE_URL}/public/${widget_id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.detail || "Failed to get widget data.");
    }
    return result as WidgetResponse;
  },

  async initializeSession(share_token: string) {
    const response = await fetch(`${CHAT_BASE_URL}/public/${share_token}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.detail || "Failed to initialize chat session.");
    }
    return result as SessionResponse;
  },

  async sendMessage(sessionId: string, content: string, shareToken: string) {
    const response = await fetch(
      `${CHAT_BASE_URL}/sessions/${sessionId}/messages`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
          share_token: shareToken,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to send message");
    }

    return response.json();
  },
};
