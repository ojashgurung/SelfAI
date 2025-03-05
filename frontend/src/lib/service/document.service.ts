const API_BASE_URL = "http://localhost:8000/api/v1/rag";

export const DocumentService = {
  async uploadDocument(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    const accessToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("access_token="))
      ?.split("=")[1];

    const response = await fetch(`${API_BASE_URL}/upload-document`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Unauthorized. Please login again.");
      }
      throw new Error("Document upload failed");
    }

    return response.json();
  },

  async getDocuments(file: File) {},
};
