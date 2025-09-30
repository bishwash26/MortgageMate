export interface Database {
  public: {
    Tables: {
      banks: {
        Row: {
          id: number;
          name: string;
        };
        Insert: {
          id?: number;
          name: string;
        };
        Update: {
          id?: number;
          name?: string;
        };
      };
      policies_text: {
        Row: {
          id: number;
          bank_id: number;
          policy_text: string;
          embedding: number[] | null;
          updated_at: string;
        };
        Insert: {
          id?: number;
          bank_id: number;
          policy_text: string;
          embedding?: number[] | null;
          updated_at?: string;
        };
        Update: {
          id?: number;
          bank_id?: number;
          policy_text?: string;
          embedding?: number[] | null;
          updated_at?: string;
        };
      };
    };
  };
}

export type Bank = Database['public']['Tables']['banks']['Row'];
export type PolicyText = Database['public']['Tables']['policies_text']['Row'];