// ============================================
// ProposalAI - Type Definitions
// ============================================

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  business_name: string;
  industry: string;
  website?: string;
  phone?: string;
  logo_url?: string;
  brand_color: string;
  subscription_plan: 'free' | 'starter' | 'pro' | 'agency';
  proposals_this_month: number;
  created_at: string;
  updated_at: string;
}

export interface Client {
  id: string;
  user_id: string;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  notes?: string;
  total_revenue: number;
  proposals_count: number;
  created_at: string;
}

export interface ProposalPackage {
  name: string;
  price: number;
  features: string[];
  recommended: boolean;
}

export interface ProposalContent {
  summary: string;
  scope: { title: string; description: string }[];
  deliverables: string[];
  timeline: { phase: string; duration: string; description: string }[];
  packages: ProposalPackage[];
  terms: string;
  notes: string;
}

export interface Proposal {
  id: string;
  user_id: string;
  client_id: string;
  client?: Client;
  title: string;
  slug: string;
  content: ProposalContent;
  status: 'draft' | 'sent' | 'viewed' | 'accepted' | 'rejected' | 'expired';
  selected_package?: string;
  total_amount?: number;
  currency: string;
  language: string;
  valid_until?: string;
  signature_data?: {
    name: string;
    date: string;
    ip: string;
  };
  sent_at?: string;
  viewed_at?: string;
  accepted_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Invoice {
  id: string;
  user_id: string;
  client_id: string;
  proposal_id?: string;
  client?: Client;
  invoice_number: string;
  items: {
    description: string;
    quantity: number;
    unit_price: number;
    total: number;
  }[];
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  total_amount: number;
  currency: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  due_date: string;
  paid_at?: string;
  payment_url?: string;
  notes?: string;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: 'proposal_viewed' | 'proposal_accepted' | 'proposal_rejected' | 'invoice_paid' | 'invoice_overdue';
  title: string;
  message: string;
  read: boolean;
  link?: string;
  created_at: string;
}

export interface DashboardStats {
  total_proposals: number;
  accepted_proposals: number;
  pending_proposals: number;
  total_revenue: number;
  monthly_revenue: number;
  acceptance_rate: number;
  active_clients: number;
}
