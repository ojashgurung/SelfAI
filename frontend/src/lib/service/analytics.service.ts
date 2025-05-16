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
};
