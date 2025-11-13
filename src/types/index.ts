export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  profile_info: Record<string, any>;
  created_at: string;
}

export interface Message {
  id: string;
  customer_id: string;
  content: string;
  urgency_level: 'low' | 'medium' | 'high';
  status: 'new' | 'in_progress' | 'resolved';
  created_at: string;
  responded_at?: string;
  updated_at: string;
  customer?: Customer;
}

export interface Agent {
  id: string;
  name: string;
  email: string;
  status: 'online' | 'offline' | 'busy';
  created_at: string;
}

x