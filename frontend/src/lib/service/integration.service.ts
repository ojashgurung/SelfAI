const GRAPH_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/graph`;

export const integrationService = {
  async getIntegrationStatus() {
    const response = await fetch(`${GRAPH_BASE_URL}/integrations/status`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const result = await response.json();
    return result;
  },

  async getIdentityStatus() {
    const response = await fetch(`${GRAPH_BASE_URL}/identity/status`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const result = await response.json();
    return result;
  },

  getGithubAuthUrl() {
    return `${GRAPH_BASE_URL}/integrations/github/login`;
  },
};
