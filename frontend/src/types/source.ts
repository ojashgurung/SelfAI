export interface Source {
  id: string;
  platform: string;
  display_name: string;
  status: string;
  last_synced_at: string;
  source_metadata: {
    repoCount?: number;
    primaryLanguages?: string[];
    [key: string]: any;
  };
}
