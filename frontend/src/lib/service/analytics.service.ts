const ANALYTICS_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/analytics`;

export const analyticsService = {
  async getHighlights() {
    const response = await fetch(`${ANALYTICS_BASE_URL}/highlight`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const result = await response.json();
    return result;
  },

  async getProfileCompletionStatus() {
    const response = await fetch(`${ANALYTICS_BASE_URL}/profile-completion`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const result = await response.json();
    return result;
  },

  async getPerformanceOverview() {
    const response = await fetch(`${ANALYTICS_BASE_URL}/metrics/summary`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const result = await response.json();
    return result;
  },
};
