export interface ChatSession {
  id: string;
  title: string;
  namespace: string;
  user_id?: string;
  visitor_id?: string;
  is_public: boolean;
  share_token?: string;
  messages: ChatMessage[];
  owner?: Owner;
}

export interface Owner {
  email: string;
  fullname: string;
  personal_bio?: string;
  linkedin_url?: string;
  github_url?: string;
  profile_image?: string;
  documents: Document[];
}

export interface ChatMessage {
  id: string;
  content: string;
  role: "user" | "assistant";
  created_at: string;
}

export interface Document {
  id: string;
  namespace: string;
  file_name: string;
  created_at: string;
}
