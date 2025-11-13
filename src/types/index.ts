export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  profile_info: Record<string, any>;
  created_at: string;
}

