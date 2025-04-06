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

const WIDGET_BASE_URL = "http://localhost:8000/api/v1/widget";

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
};
