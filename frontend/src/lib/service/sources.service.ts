const GRAPH_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/graph`;

export const sourcesService = {
  async getALlSources() {
    const response = await fetch(`${GRAPH_BASE_URL}/sources`, {
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
