const API_BASE_URL = "http://localhost:8000/api/v1/rag";

export interface Document {
  id: string;
  filename: string;
  filesize: string;
  created_at: string;
  namespace: string;
  vector_ids: string[];
}

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

  async getDocuments() {
    const accessToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("access_token="))
      ?.split("=")[1];
    const response = await fetch(`${API_BASE_URL}/documents`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Unauthorized. Please login again.");
      }
      throw new Error("Failed to fetch documents");
    }

    const data = await response.json();
    return data.documents as Document[];
  },

  async deleteDocument(documentId: string) {
    const accessToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("access_token="))
      ?.split("=")[1];

    const response = await fetch(`${API_BASE_URL}/documents/${documentId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Unauthorized. Please login again.");
      }
      if (response.status === 404) {
        throw new Error("Document not found.");
      }
      throw new Error("Failed to delete document");
    }

    return response.json();
  },
};
