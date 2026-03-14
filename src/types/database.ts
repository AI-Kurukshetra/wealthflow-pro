export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

type Table<Row, Insert = Row, Update = Partial<Insert>> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
};

export type Database = {
  public: {
    Tables: {
      organizations: Table<{
        id: string;
        name: string;
        slug: string;
        timezone: string;
        base_currency: string;
        country_code: string;
        created_at: string;
        updated_at: string;
      }>;
      profiles: Table<{
        id: string;
        full_name: string | null;
        email: string | null;
        avatar_url: string | null;
        phone: string | null;
        job_title: string | null;
        created_at: string;
        updated_at: string;
      }>;
      organization_memberships: Table<{
        id: string;
        organization_id: string;
        user_id: string;
        role: string;
        status: string;
        joined_at: string | null;
        created_at: string;
        updated_at: string;
      }>;
      clients: Table<{
        id: string;
        organization_id: string;
        primary_advisor_id: string | null;
        household_name: string;
        first_name: string | null;
        last_name: string | null;
        email: string | null;
        phone: string | null;
        client_status: string;
        risk_profile: string | null;
        notes: string | null;
        created_at: string;
        updated_at: string;
      }>;
      portfolios: Table<{
        id: string;
        organization_id: string;
        client_id: string;
        advisor_id: string | null;
        name: string;
        account_type: string;
        custodian: string | null;
        market_value: number;
        portfolio_status: string;
        created_at: string;
        updated_at: string;
      }>;
      transactions: Table<{
        id: string;
        organization_id: string;
        portfolio_id: string;
        client_id: string | null;
        transaction_type: string;
        trade_date: string;
        security_symbol: string | null;
        net_amount: number;
        created_at: string;
      }>;
      tasks: Table<{
        id: string;
        organization_id: string;
        client_id: string | null;
        title: string;
        task_type: string;
        priority: string;
        status: string;
        due_at: string | null;
        created_at: string;
        updated_at: string;
      }>;
      meetings: Table<{
        id: string;
        organization_id: string;
        client_id: string | null;
        title: string;
        meeting_type: string;
        starts_at: string;
        ends_at: string;
        channel: string;
        location: string | null;
        created_at: string;
        updated_at: string;
      }>;
      goals: Table<{
        id: string;
        organization_id: string;
        client_id: string;
        name: string;
        target_amount: number;
        progress_amount: number;
        target_date: string | null;
        status: string;
        created_at: string;
        updated_at: string;
      }>;
      documents: Table<{
        id: string;
        organization_id: string;
        client_id: string | null;
        name: string;
        file_name: string;
        storage_path: string;
        document_category: string;
        uploaded_at: string;
        created_at: string;
        updated_at: string;
      }>;
      notifications: Table<{
        id: string;
        organization_id: string;
        user_id: string;
        title: string;
        body: string | null;
        notification_type: string;
        is_read: boolean;
        created_at: string;
      }>;
      compliance_records: Table<{
        id: string;
        organization_id: string;
        client_id: string | null;
        related_document_id: string | null;
        record_type: string;
        status: string;
        due_at: string | null;
        created_at: string;
        updated_at: string;
      }>;
    };
    Views: {
      advisor_dashboard_metrics_v: {
        Row: {
          organization_id: string | null;
          total_clients: number | null;
          active_clients: number | null;
          total_aum: number | null;
          open_tasks: number | null;
          upcoming_meetings: number | null;
        };
      };
    };
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
};
