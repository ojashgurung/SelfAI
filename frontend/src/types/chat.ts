export interface ChatSession {
  id: string;
  title: string;
  namespace: string;
  is_public: boolean;
  share_token?: string;
  messages: ChatMessage[];
}

export interface ChatMessage {
  id: string;
  content: string;
  role: "user" | "assistant";
  created_at: string;
}
