export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      administrative_documents: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          content: string
          created_at: string
          created_by: string
          doc_no: string | null
          doc_type: string
          effective_date: string | null
          employee_id: string | null
          file_name: string | null
          file_path: string | null
          file_size: number | null
          id: string
          issue_date: string
          mime_type: string | null
          status: string
          subject: string
          updated_at: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          content: string
          created_at?: string
          created_by: string
          doc_no?: string | null
          doc_type: string
          effective_date?: string | null
          employee_id?: string | null
          file_name?: string | null
          file_path?: string | null
          file_size?: number | null
          id?: string
          issue_date?: string
          mime_type?: string | null
          status?: string
          subject: string
          updated_at?: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          content?: string
          created_at?: string
          created_by?: string
          doc_no?: string | null
          doc_type?: string
          effective_date?: string | null
          employee_id?: string | null
          file_name?: string | null
          file_path?: string | null
          file_size?: number | null
          id?: string
          issue_date?: string
          mime_type?: string | null
          status?: string
          subject?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "administrative_documents_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_administrative_documents_employee"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      document_sequences: {
        Row: {
          created_at: string
          doc_type: string
          id: string
          last_number: number
          prefix: string
          updated_at: string
          year: number
        }
        Insert: {
          created_at?: string
          doc_type: string
          id?: string
          last_number?: number
          prefix: string
          updated_at?: string
          year: number
        }
        Update: {
          created_at?: string
          doc_type?: string
          id?: string
          last_number?: number
          prefix?: string
          updated_at?: string
          year?: number
        }
        Relationships: []
      }
      document_templates: {
        Row: {
          created_at: string
          created_by: string | null
          doc_type: string
          id: string
          is_active: boolean | null
          name: string
          template_content: string
          updated_at: string
          variables: Json | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          doc_type: string
          id?: string
          is_active?: boolean | null
          name: string
          template_content: string
          updated_at?: string
          variables?: Json | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          doc_type?: string
          id?: string
          is_active?: boolean | null
          name?: string
          template_content?: string
          updated_at?: string
          variables?: Json | null
        }
        Relationships: []
      }
      document_versions: {
        Row: {
          change_note: string | null
          changed_by: string
          content: string
          created_at: string
          document_id: string
          file_name: string | null
          file_path: string | null
          file_size: number | null
          id: string
          mime_type: string | null
          version_number: number
        }
        Insert: {
          change_note?: string | null
          changed_by: string
          content: string
          created_at?: string
          document_id: string
          file_name?: string | null
          file_path?: string | null
          file_size?: number | null
          id?: string
          mime_type?: string | null
          version_number: number
        }
        Update: {
          change_note?: string | null
          changed_by?: string
          content?: string
          created_at?: string
          document_id?: string
          file_name?: string | null
          file_path?: string | null
          file_size?: number | null
          id?: string
          mime_type?: string | null
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "document_versions_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "administrative_documents"
            referencedColumns: ["id"]
          },
        ]
      }
      employee_documents: {
        Row: {
          created_at: string | null
          document_type: string
          employee_id: string
          file_name: string
          file_path: string
          file_size: number | null
          id: string
          mime_type: string | null
          notes: string | null
          uploaded_at: string | null
          uploaded_by: string | null
        }
        Insert: {
          created_at?: string | null
          document_type: string
          employee_id: string
          file_name: string
          file_path: string
          file_size?: number | null
          id?: string
          mime_type?: string | null
          notes?: string | null
          uploaded_at?: string | null
          uploaded_by?: string | null
        }
        Update: {
          created_at?: string | null
          document_type?: string
          employee_id?: string
          file_name?: string
          file_path?: string
          file_size?: number | null
          id?: string
          mime_type?: string | null
          notes?: string | null
          uploaded_at?: string | null
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employee_documents_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      employees: {
        Row: {
          allowance_fuel: number | null
          allowance_meal: number | null
          allowance_other: number | null
          allowance_phone: number | null
          avatar_path: string | null
          created_at: string | null
          created_by: string | null
          current_address: string | null
          department: string
          email: string
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          emergency_contact_relationship: string | null
          employee_code: string
          employment_type: Database["public"]["Enums"]["employment_type"] | null
          full_name: string
          id: string
          join_date: string
          kpi_score: number | null
          last_review_date: string | null
          notes: string | null
          phone: string | null
          position: string
          salary_p1: number | null
          seniority_months: number | null
          status: Database["public"]["Enums"]["employee_status"] | null
          team: string | null
          total_fixed_salary: number | null
          updated_at: string | null
        }
        Insert: {
          allowance_fuel?: number | null
          allowance_meal?: number | null
          allowance_other?: number | null
          allowance_phone?: number | null
          avatar_path?: string | null
          created_at?: string | null
          created_by?: string | null
          current_address?: string | null
          department: string
          email: string
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          emergency_contact_relationship?: string | null
          employee_code: string
          employment_type?:
            | Database["public"]["Enums"]["employment_type"]
            | null
          full_name: string
          id?: string
          join_date: string
          kpi_score?: number | null
          last_review_date?: string | null
          notes?: string | null
          phone?: string | null
          position: string
          salary_p1?: number | null
          seniority_months?: number | null
          status?: Database["public"]["Enums"]["employee_status"] | null
          team?: string | null
          total_fixed_salary?: number | null
          updated_at?: string | null
        }
        Update: {
          allowance_fuel?: number | null
          allowance_meal?: number | null
          allowance_other?: number | null
          allowance_phone?: number | null
          avatar_path?: string | null
          created_at?: string | null
          created_by?: string | null
          current_address?: string | null
          department?: string
          email?: string
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          emergency_contact_relationship?: string | null
          employee_code?: string
          employment_type?:
            | Database["public"]["Enums"]["employment_type"]
            | null
          full_name?: string
          id?: string
          join_date?: string
          kpi_score?: number | null
          last_review_date?: string | null
          notes?: string | null
          phone?: string | null
          position?: string
          salary_p1?: number | null
          seniority_months?: number | null
          status?: Database["public"]["Enums"]["employee_status"] | null
          team?: string | null
          total_fixed_salary?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      features: {
        Row: {
          code: string
          created_at: string | null
          description: string | null
          feature_type: string | null
          id: number
          module_id: number
          name: string
        }
        Insert: {
          code: string
          created_at?: string | null
          description?: string | null
          feature_type?: string | null
          id?: number
          module_id: number
          name: string
        }
        Update: {
          code?: string
          created_at?: string | null
          description?: string | null
          feature_type?: string | null
          id?: number
          module_id?: number
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "features_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
        ]
      }
      modules: {
        Row: {
          code: string
          created_at: string | null
          description: string | null
          display_order: number | null
          icon: string | null
          id: number
          is_active: boolean | null
          name: string
        }
        Insert: {
          code: string
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          icon?: string | null
          id?: number
          is_active?: boolean | null
          name: string
        }
        Update: {
          code?: string
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          icon?: string | null
          id?: number
          is_active?: boolean | null
          name?: string
        }
        Relationships: []
      }
      monthly_attendance: {
        Row: {
          actual_days: number | null
          created_at: string | null
          created_by: string | null
          employee_id: string
          id: string
          month: string
          ot_hours: number | null
          paid_leave: number | null
          standard_days: number | null
          unpaid_leave: number | null
          updated_at: string | null
        }
        Insert: {
          actual_days?: number | null
          created_at?: string | null
          created_by?: string | null
          employee_id: string
          id?: string
          month: string
          ot_hours?: number | null
          paid_leave?: number | null
          standard_days?: number | null
          unpaid_leave?: number | null
          updated_at?: string | null
        }
        Update: {
          actual_days?: number | null
          created_at?: string | null
          created_by?: string | null
          employee_id?: string
          id?: string
          month?: string
          ot_hours?: number | null
          paid_leave?: number | null
          standard_days?: number | null
          unpaid_leave?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "monthly_attendance_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_path: string | null
          created_at: string | null
          email: string | null
          full_name: string
          id: string
          last_password_change: string | null
          password_change_required: boolean | null
          phone: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_path?: string | null
          created_at?: string | null
          email?: string | null
          full_name: string
          id: string
          last_password_change?: string | null
          password_change_required?: boolean | null
          phone?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_path?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string
          id?: string
          last_password_change?: string | null
          password_change_required?: boolean | null
          phone?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      role_permissions: {
        Row: {
          created_at: string | null
          feature_id: number
          id: number
          role_id: number
        }
        Insert: {
          created_at?: string | null
          feature_id: number
          id?: number
          role_id: number
        }
        Update: {
          created_at?: string | null
          feature_id?: number
          id?: number
          role_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_feature_id_fkey"
            columns: ["feature_id"]
            isOneToOne: false
            referencedRelation: "features"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "role_permissions_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          created_at: string | null
          description: string | null
          id: number
          is_system: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: number
          is_system?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: number
          is_system?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role_id: number
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role_id: number
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_doc_number: {
        Args: { _doc_type: string; _year: number }
        Returns: string
      }
      has_role: {
        Args:
          | { _role: Database["public"]["Enums"]["app_role"]; _user_id: string }
          | { _role_name: string; _user_id: string }
        Returns: boolean
      }
      is_admin: {
        Args: { _user_id: string }
        Returns: boolean
      }
      revoke_user_sessions: {
        Args: { target_user_id: string }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "user"
      contract_type: "Chính Thức" | "Thử Việc" | "Hợp Đồng"
      employee_status: "active" | "inactive" | "probation" | "terminated"
      employment_type:
        | "Full-time"
        | "Part-time"
        | "CTV"
        | "Thử việc"
        | "Thực tập"
      member_status: "ACTIVE" | "INACTIVE" | "PENDING" | "SUSPENDED"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
      contract_type: ["Chính Thức", "Thử Việc", "Hợp Đồng"],
      employee_status: ["active", "inactive", "probation", "terminated"],
      employment_type: [
        "Full-time",
        "Part-time",
        "CTV",
        "Thử việc",
        "Thực tập",
      ],
      member_status: ["ACTIVE", "INACTIVE", "PENDING", "SUSPENDED"],
    },
  },
} as const
