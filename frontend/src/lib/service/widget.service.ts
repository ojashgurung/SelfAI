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

const WIDGET_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/widget`;

export const widgetService = {
  async getWidget() {
    const response = await fetch(`${WIDGET_BASE_URL}/`, {
      method: "GET",
      credentials: "include",
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

  async createWidget(data: {
    theme: string;
    color: string;
    heading: string;
    title: string;
    subtitle: string;
    prompts: WidgetPromptProps[];
  }) {
    const response = await fetch(`${WIDGET_BASE_URL}/`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.detail || "Failed to create widget.");
    }
    return result as WidgetResponse;
  },

  async updateWidget(
    widgetId: string,
    data: {
      theme: string;
      color: string;
      heading: string;
      title: string;
      subtitle: string;
      prompts: WidgetPromptProps[];
    }
  ) {
    const response = await fetch(`${WIDGET_BASE_URL}/${widgetId}`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.detail || "Failed to update widget.");
    }
    return result as WidgetResponse;
  },

  async deleteWidget(widgetId: string) {
    const response = await fetch(`${WIDGET_BASE_URL}/${widgetId}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const result = await response.json();
      throw new Error(result.detail || "Failed to delete widget.");
    }
  },
};
