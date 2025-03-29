const RAG_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/rag`;

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

    const response = await fetch(`${RAG_BASE_URL}/upload-document`, {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Unauthorized. Please login again.");
      }
      throw new Error("Document upload and training failed");
    }

    return response.json();
  },

  async getDocuments() {
    const response = await fetch(`${RAG_BASE_URL}/documents`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
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
    const response = await fetch(`${RAG_BASE_URL}/documents/${documentId}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
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
