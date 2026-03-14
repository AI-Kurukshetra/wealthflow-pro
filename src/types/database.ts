export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

type Table<Row, Insert = Partial<Row>, Update = Partial<Insert>> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: [];
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
        created_by: string | null;
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
        created_by: string | null;
        created_at: string;
        updated_at: string;
      }>;
      risk_profiles: Table<{
        id: string;
        organization_id: string;
        name: string;
        description: string | null;
        score_min: number;
        score_max: number;
        created_by: string | null;
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
        date_of_birth: string | null;
        city: string | null;
        client_status: string;
        risk_profile: string | null;
        source: string | null;
        notes: string | null;
        created_by: string | null;
        created_at: string;
        updated_at: string;
      }>;
      client_activities: Table<{
        id: string;
        organization_id: string;
        client_id: string;
        actor_id: string | null;
        activity_type: string;
        title: string;
        description: string | null;
        occurred_at: string;
        metadata: Json;
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
        account_mask: string | null;
        base_currency: string;
        market_value: number;
        cost_basis: number;
        portfolio_status: string;
        inception_date: string | null;
        created_by: string | null;
        created_at: string;
        updated_at: string;
      }>;
      accounts: Table<{
        id: string;
        organization_id: string;
        portfolio_id: string;
        client_id: string;
        account_number_mask: string;
        account_type: string;
        custodian: string | null;
        status: string;
        created_at: string;
        updated_at: string;
      }>;
      securities: Table<{
        id: string;
        organization_id: string;
        symbol: string;
        name: string;
        asset_class: string;
        exchange: string | null;
        isin: string | null;
        currency: string;
        created_at: string;
        updated_at: string;
      }>;
      portfolio_snapshots: Table<{
        id: string;
        organization_id: string;
        portfolio_id: string;
        snapshot_date: string;
        market_value: number;
        cash_balance: number;
        cost_basis: number;
        gain_loss: number;
        gain_loss_percent: number;
        created_at: string;
        updated_at: string;
      }>;
      transactions: Table<{
        id: string;
        organization_id: string;
        portfolio_id: string;
        account_id: string | null;
        client_id: string | null;
        security_id: string | null;
        transaction_type: string;
        trade_date: string;
        settlement_date: string | null;
        security_symbol: string | null;
        description: string | null;
        quantity: number | null;
        price: number | null;
        gross_amount: number;
        fees: number;
        net_amount: number;
        currency: string;
        external_reference: string | null;
        created_by: string | null;
        created_at: string;
        updated_at: string;
      }>;
      tasks: Table<{
        id: string;
        organization_id: string;
        client_id: string | null;
        portfolio_id: string | null;
        title: string;
        description: string | null;
        task_type: string;
        priority: string;
        status: string;
        assigned_to: string | null;
        created_by: string | null;
        due_at: string | null;
        completed_at: string | null;
        created_at: string;
        updated_at: string;
      }>;
      meetings: Table<{
        id: string;
        organization_id: string;
        client_id: string | null;
        advisor_id: string | null;
        title: string;
        meeting_type: string;
        channel: string;
        location: string | null;
        notes: string | null;
        starts_at: string;
        ends_at: string;
        status: string;
        created_by: string | null;
        created_at: string;
        updated_at: string;
      }>;
      goals: Table<{
        id: string;
        organization_id: string;
        client_id: string;
        name: string;
        category: string;
        target_amount: number;
        progress_amount: number;
        target_date: string | null;
        status: string;
        notes: string | null;
        created_by: string | null;
        created_at: string;
        updated_at: string;
      }>;
      documents: Table<{
        id: string;
        organization_id: string;
        client_id: string | null;
        portfolio_id: string | null;
        uploaded_by: string | null;
        name: string;
        bucket_name: string;
        storage_path: string;
        file_name: string;
        mime_type: string | null;
        size_bytes: number;
        document_category: string;
        is_private: boolean;
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
        metadata: Json;
        created_at: string;
        updated_at: string;
      }>;
      compliance_records: Table<{
        id: string;
        organization_id: string;
        client_id: string | null;
        related_document_id: string | null;
        record_type: string;
        status: string;
        due_at: string | null;
        completed_at: string | null;
        notes: string | null;
        created_by: string | null;
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
      client_aum_summary_v: {
        Row: {
          client_id: string | null;
          organization_id: string | null;
          household_name: string | null;
          client_status: string | null;
          total_aum: number | null;
        };
      };
      monthly_net_flow_v: {
        Row: {
          organization_id: string | null;
          month_start: string | null;
          net_flow: number | null;
        };
      };
    };
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
};
