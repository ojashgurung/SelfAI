const GRAPH_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/graph`;

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

    const response = await fetch(`${GRAPH_BASE_URL}/integrations/documents/upload`, {
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

  async getDocuments(sourceId?: string) {
    const url = new URL(`${GRAPH_BASE_URL}/documents/`);
    if (sourceId) {
      url.searchParams.set("source_id", sourceId);
    }
    const response = await fetch(url.toString(), {
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
    // The graph endpoint returns a flat array of document objects with 'title' field
    const docs = Array.isArray(data) ? data : data.documents || [];
    return docs.map((doc: any) => ({
      id: doc.id,
      filename: doc.title || doc.filename || "Untitled",
      filesize: doc.filesize || "",
      created_at: doc.created_at,
      namespace: doc.namespace || "",
      vector_ids: doc.vector_ids || [],
    })) as Document[];
  },

  async deleteDocument(documentId: string) {
    const response = await fetch(`${GRAPH_BASE_URL}/documents/${documentId}`, {
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
