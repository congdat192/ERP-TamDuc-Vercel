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
            foreignKeyName: "fk_administrative_documents_employee"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      course_recommendations: {
        Row: {
          competency_gap: string | null
          dismissed_at: string | null
          employee_id: string
          generated_at: string
          id: string
          priority: string
          program_id: string
          reason: string | null
          status: string
        }
        Insert: {
          competency_gap?: string | null
          dismissed_at?: string | null
          employee_id: string
          generated_at?: string
          id?: string
          priority?: string
          program_id: string
          reason?: string | null
          status?: string
        }
        Update: {
          competency_gap?: string | null
          dismissed_at?: string | null
          employee_id?: string
          generated_at?: string
          id?: string
          priority?: string
          program_id?: string
          reason?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_recommendations_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_recommendations_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "training_programs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_recommendations_employee"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_recommendations_program"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "training_programs"
            referencedColumns: ["id"]
          },
        ]
      }
      document_change_requests: {
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
          request_type: string
          requested_at: string | null
          review_note: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          updated_at: string | null
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
          request_type?: string
          requested_at?: string | null
          review_note?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          updated_at?: string | null
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
          request_type?: string
          requested_at?: string | null
          review_note?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "document_change_requests_employee_id_fkey"
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
      email_logs: {
        Row: {
          created_at: string | null
          email_type: string
          error_message: string | null
          from_email: string
          id: string
          metadata: Json | null
          response_time_ms: number | null
          sent_at: string | null
          sent_by: string | null
          status: string
          subject: string
          to_email: string
        }
        Insert: {
          created_at?: string | null
          email_type: string
          error_message?: string | null
          from_email: string
          id?: string
          metadata?: Json | null
          response_time_ms?: number | null
          sent_at?: string | null
          sent_by?: string | null
          status?: string
          subject: string
          to_email: string
        }
        Update: {
          created_at?: string | null
          email_type?: string
          error_message?: string | null
          from_email?: string
          id?: string
          metadata?: Json | null
          response_time_ms?: number | null
          sent_at?: string | null
          sent_by?: string | null
          status?: string
          subject?: string
          to_email?: string
        }
        Relationships: []
      }
      email_otp_codes: {
        Row: {
          created_at: string | null
          email: string
          expires_at: string
          id: string
          ip_address: string | null
          otp_code: string
          verified: boolean | null
          verified_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          expires_at: string
          id?: string
          ip_address?: string | null
          otp_code: string
          verified?: boolean | null
          verified_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          expires_at?: string
          id?: string
          ip_address?: string | null
          otp_code?: string
          verified?: boolean | null
          verified_at?: string | null
        }
        Relationships: []
      }
      employee_audit_log: {
        Row: {
          action: string
          change_request_id: string | null
          change_source: string | null
          changed_at: string | null
          changed_by: string | null
          changed_fields: string[] | null
          employee_id: string | null
          id: string
          new_values: Json | null
          old_values: Json | null
          table_name: string | null
        }
        Insert: {
          action: string
          change_request_id?: string | null
          change_source?: string | null
          changed_at?: string | null
          changed_by?: string | null
          changed_fields?: string[] | null
          employee_id?: string | null
          id?: string
          new_values?: Json | null
          old_values?: Json | null
          table_name?: string | null
        }
        Update: {
          action?: string
          change_request_id?: string | null
          change_source?: string | null
          changed_at?: string | null
          changed_by?: string | null
          changed_fields?: string[] | null
          employee_id?: string | null
          id?: string
          new_values?: Json | null
          old_values?: Json | null
          table_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employee_audit_log_change_request_id_fkey"
            columns: ["change_request_id"]
            isOneToOne: false
            referencedRelation: "employee_change_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_audit_log_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      employee_change_requests: {
        Row: {
          changes: Json
          created_at: string | null
          employee_id: string
          id: string
          request_type: string
          requested_at: string | null
          review_note: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          changes: Json
          created_at?: string | null
          employee_id: string
          id?: string
          request_type?: string
          requested_at?: string | null
          review_note?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          changes?: Json
          created_at?: string | null
          employee_id?: string
          id?: string
          request_type?: string
          requested_at?: string | null
          review_note?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employee_change_requests_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      employee_competencies: {
        Row: {
          assessed_by: string | null
          competency_code: string
          competency_name: string
          created_at: string
          current_level: number
          employee_id: string
          id: string
          last_assessed_date: string | null
          notes: string | null
          target_level: number | null
          updated_at: string
        }
        Insert: {
          assessed_by?: string | null
          competency_code: string
          competency_name: string
          created_at?: string
          current_level: number
          employee_id: string
          id?: string
          last_assessed_date?: string | null
          notes?: string | null
          target_level?: number | null
          updated_at?: string
        }
        Update: {
          assessed_by?: string | null
          competency_code?: string
          competency_name?: string
          created_at?: string
          current_level?: number
          employee_id?: string
          id?: string
          last_assessed_date?: string | null
          notes?: string | null
          target_level?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "employee_competencies_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_competencies_assessor"
            columns: ["assessed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_competencies_employee"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      employee_documents: {
        Row: {
          created_at: string | null
          deleted_employee_code: string | null
          deleted_employee_name: string | null
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
          deleted_employee_code?: string | null
          deleted_employee_name?: string | null
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
          deleted_employee_code?: string | null
          deleted_employee_name?: string | null
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
      employee_payrolls: {
        Row: {
          actual_days: number | null
          actual_salary: number | null
          allowance_meal: number | null
          allowance_parking: number | null
          allowance_responsibility: number | null
          bonus_invoice_bh_cs: number | null
          bonus_invoice_ktv: number | null
          bonus_performance: number | null
          company_name: string
          created_at: string | null
          created_by: string | null
          ct_actual_days: number | null
          ct_holiday_days: number | null
          ct_ot_days: number | null
          ct_ot_hours: number | null
          ct_ot_sessions: number | null
          ct_regime_days: number | null
          daily_meal_allowance: number | null
          deduction_other: number | null
          deduction_social_insurance: number | null
          department: string | null
          employee_code: string
          employee_id: string
          employee_name: string
          happy_birthday: number | null
          id: string
          invoice_bonus: number | null
          issued_at: string | null
          leave_settlement: number | null
          month: string
          net_payment: number | null
          notes: string | null
          ot_amount: number | null
          ot_days: number | null
          paid_advance: number | null
          paid_day_15: number | null
          paid_day_3: number | null
          paid_leave_days: number | null
          parttime_days: number | null
          payment_surplus: number | null
          position: string | null
          responsibility_allowance: number | null
          salary_advance: number | null
          salary_fulltime_ct: number | null
          salary_fulltime_official: number | null
          salary_fulltime_probation: number | null
          salary_parttime_official: number | null
          salary_parttime_probation: number | null
          standard_days: number | null
          status: string
          support_other_1: number | null
          support_other_2: number | null
          total_bonus: number | null
          total_company_paid: number | null
          total_deductions: number | null
          total_income: number | null
          total_salary: number | null
          tv_actual_days: number | null
          tv_holiday_days: number | null
          tv_ot_hours: number | null
          tv_ot_sessions: number | null
          tv_regime_days: number | null
          updated_at: string | null
        }
        Insert: {
          actual_days?: number | null
          actual_salary?: number | null
          allowance_meal?: number | null
          allowance_parking?: number | null
          allowance_responsibility?: number | null
          bonus_invoice_bh_cs?: number | null
          bonus_invoice_ktv?: number | null
          bonus_performance?: number | null
          company_name?: string
          created_at?: string | null
          created_by?: string | null
          ct_actual_days?: number | null
          ct_holiday_days?: number | null
          ct_ot_days?: number | null
          ct_ot_hours?: number | null
          ct_ot_sessions?: number | null
          ct_regime_days?: number | null
          daily_meal_allowance?: number | null
          deduction_other?: number | null
          deduction_social_insurance?: number | null
          department?: string | null
          employee_code: string
          employee_id: string
          employee_name: string
          happy_birthday?: number | null
          id?: string
          invoice_bonus?: number | null
          issued_at?: string | null
          leave_settlement?: number | null
          month: string
          net_payment?: number | null
          notes?: string | null
          ot_amount?: number | null
          ot_days?: number | null
          paid_advance?: number | null
          paid_day_15?: number | null
          paid_day_3?: number | null
          paid_leave_days?: number | null
          parttime_days?: number | null
          payment_surplus?: number | null
          position?: string | null
          responsibility_allowance?: number | null
          salary_advance?: number | null
          salary_fulltime_ct?: number | null
          salary_fulltime_official?: number | null
          salary_fulltime_probation?: number | null
          salary_parttime_official?: number | null
          salary_parttime_probation?: number | null
          standard_days?: number | null
          status?: string
          support_other_1?: number | null
          support_other_2?: number | null
          total_bonus?: number | null
          total_company_paid?: number | null
          total_deductions?: number | null
          total_income?: number | null
          total_salary?: number | null
          tv_actual_days?: number | null
          tv_holiday_days?: number | null
          tv_ot_hours?: number | null
          tv_ot_sessions?: number | null
          tv_regime_days?: number | null
          updated_at?: string | null
        }
        Update: {
          actual_days?: number | null
          actual_salary?: number | null
          allowance_meal?: number | null
          allowance_parking?: number | null
          allowance_responsibility?: number | null
          bonus_invoice_bh_cs?: number | null
          bonus_invoice_ktv?: number | null
          bonus_performance?: number | null
          company_name?: string
          created_at?: string | null
          created_by?: string | null
          ct_actual_days?: number | null
          ct_holiday_days?: number | null
          ct_ot_days?: number | null
          ct_ot_hours?: number | null
          ct_ot_sessions?: number | null
          ct_regime_days?: number | null
          daily_meal_allowance?: number | null
          deduction_other?: number | null
          deduction_social_insurance?: number | null
          department?: string | null
          employee_code?: string
          employee_id?: string
          employee_name?: string
          happy_birthday?: number | null
          id?: string
          invoice_bonus?: number | null
          issued_at?: string | null
          leave_settlement?: number | null
          month?: string
          net_payment?: number | null
          notes?: string | null
          ot_amount?: number | null
          ot_days?: number | null
          paid_advance?: number | null
          paid_day_15?: number | null
          paid_day_3?: number | null
          paid_leave_days?: number | null
          parttime_days?: number | null
          payment_surplus?: number | null
          position?: string | null
          responsibility_allowance?: number | null
          salary_advance?: number | null
          salary_fulltime_ct?: number | null
          salary_fulltime_official?: number | null
          salary_fulltime_probation?: number | null
          salary_parttime_official?: number | null
          salary_parttime_probation?: number | null
          standard_days?: number | null
          status?: string
          support_other_1?: number | null
          support_other_2?: number | null
          total_bonus?: number | null
          total_company_paid?: number | null
          total_deductions?: number | null
          total_income?: number | null
          total_salary?: number | null
          tv_actual_days?: number | null
          tv_holiday_days?: number | null
          tv_ot_hours?: number | null
          tv_ot_sessions?: number | null
          tv_regime_days?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employee_payrolls_employee_id_fkey"
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
          birth_date: string | null
          created_at: string | null
          created_by: string | null
          current_address: string | null
          deleted_at: string | null
          deleted_by: string | null
          department: string
          email: string
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          emergency_contact_relationship: string | null
          employee_code: string
          employment_type: Database["public"]["Enums"]["employment_type"] | null
          full_name: string
          gender: string | null
          id: string
          is_employee_only: boolean | null
          join_date: string
          kpi_score: number | null
          last_review_date: string | null
          notes: string | null
          phone: string | null
          position: string
          salary_fulltime_official: number | null
          salary_fulltime_probation: number | null
          salary_p1: number | null
          salary_parttime_official: number | null
          salary_parttime_probation: number | null
          seniority_months: number | null
          status: Database["public"]["Enums"]["employee_status"] | null
          team: string | null
          total_fixed_salary: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          allowance_fuel?: number | null
          allowance_meal?: number | null
          allowance_other?: number | null
          allowance_phone?: number | null
          avatar_path?: string | null
          birth_date?: string | null
          created_at?: string | null
          created_by?: string | null
          current_address?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
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
          gender?: string | null
          id?: string
          is_employee_only?: boolean | null
          join_date: string
          kpi_score?: number | null
          last_review_date?: string | null
          notes?: string | null
          phone?: string | null
          position: string
          salary_fulltime_official?: number | null
          salary_fulltime_probation?: number | null
          salary_p1?: number | null
          salary_parttime_official?: number | null
          salary_parttime_probation?: number | null
          seniority_months?: number | null
          status?: Database["public"]["Enums"]["employee_status"] | null
          team?: string | null
          total_fixed_salary?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          allowance_fuel?: number | null
          allowance_meal?: number | null
          allowance_other?: number | null
          allowance_phone?: number | null
          avatar_path?: string | null
          birth_date?: string | null
          created_at?: string | null
          created_by?: string | null
          current_address?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
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
          gender?: string | null
          id?: string
          is_employee_only?: boolean | null
          join_date?: string
          kpi_score?: number | null
          last_review_date?: string | null
          notes?: string | null
          phone?: string | null
          position?: string
          salary_fulltime_official?: number | null
          salary_fulltime_probation?: number | null
          salary_p1?: number | null
          salary_parttime_official?: number | null
          salary_parttime_probation?: number | null
          seniority_months?: number | null
          status?: Database["public"]["Enums"]["employee_status"] | null
          team?: string | null
          total_fixed_salary?: number | null
          updated_at?: string | null
          user_id?: string | null
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
      hr_benefit_assignments: {
        Row: {
          assigned_by: string | null
          assigned_date: string
          benefit_id: string
          created_at: string | null
          employee_id: string
          end_date: string | null
          id: string
          notes: string | null
          start_date: string
          status: string | null
        }
        Insert: {
          assigned_by?: string | null
          assigned_date?: string
          benefit_id: string
          created_at?: string | null
          employee_id: string
          end_date?: string | null
          id?: string
          notes?: string | null
          start_date: string
          status?: string | null
        }
        Update: {
          assigned_by?: string | null
          assigned_date?: string
          benefit_id?: string
          created_at?: string | null
          employee_id?: string
          end_date?: string | null
          id?: string
          notes?: string | null
          start_date?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hr_benefit_assignments_benefit_id_fkey"
            columns: ["benefit_id"]
            isOneToOne: false
            referencedRelation: "hr_benefits"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hr_benefit_assignments_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      hr_benefits: {
        Row: {
          benefit_code: string
          benefit_name: string
          benefit_type: string
          created_at: string | null
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          description: string | null
          effective_from: string | null
          effective_to: string | null
          eligibility_criteria: string | null
          frequency: string | null
          id: string
          status: string | null
          updated_at: string | null
          value: number | null
        }
        Insert: {
          benefit_code: string
          benefit_name: string
          benefit_type: string
          created_at?: string | null
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          description?: string | null
          effective_from?: string | null
          effective_to?: string | null
          eligibility_criteria?: string | null
          frequency?: string | null
          id?: string
          status?: string | null
          updated_at?: string | null
          value?: number | null
        }
        Update: {
          benefit_code?: string
          benefit_name?: string
          benefit_type?: string
          created_at?: string | null
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          description?: string | null
          effective_from?: string | null
          effective_to?: string | null
          eligibility_criteria?: string | null
          frequency?: string | null
          id?: string
          status?: string | null
          updated_at?: string | null
          value?: number | null
        }
        Relationships: []
      }
      hr_discipline_records: {
        Row: {
          created_at: string | null
          description: string
          employee_id: string
          id: string
          issued_at: string | null
          issued_by: string
          notes: string | null
          penalty: string | null
          penalty_amount: number | null
          record_code: string
          resolution_note: string | null
          resolved_at: string | null
          severity: string
          status: string | null
          updated_at: string | null
          violation_date: string
          violation_type: string
        }
        Insert: {
          created_at?: string | null
          description: string
          employee_id: string
          id?: string
          issued_at?: string | null
          issued_by: string
          notes?: string | null
          penalty?: string | null
          penalty_amount?: number | null
          record_code: string
          resolution_note?: string | null
          resolved_at?: string | null
          severity: string
          status?: string | null
          updated_at?: string | null
          violation_date: string
          violation_type: string
        }
        Update: {
          created_at?: string | null
          description?: string
          employee_id?: string
          id?: string
          issued_at?: string | null
          issued_by?: string
          notes?: string | null
          penalty?: string | null
          penalty_amount?: number | null
          record_code?: string
          resolution_note?: string | null
          resolved_at?: string | null
          severity?: string
          status?: string | null
          updated_at?: string | null
          violation_date?: string
          violation_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "hr_discipline_records_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      hr_rewards: {
        Row: {
          amount: number | null
          approved_at: string | null
          approved_by: string | null
          awarded_date: string
          created_at: string | null
          created_by: string
          employee_id: string
          id: string
          reason: string
          rejection_note: string | null
          reward_code: string
          reward_title: string
          reward_type: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          amount?: number | null
          approved_at?: string | null
          approved_by?: string | null
          awarded_date: string
          created_at?: string | null
          created_by: string
          employee_id: string
          id?: string
          reason: string
          rejection_note?: string | null
          reward_code: string
          reward_title: string
          reward_type: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number | null
          approved_at?: string | null
          approved_by?: string | null
          awarded_date?: string
          created_at?: string | null
          created_by?: string
          employee_id?: string
          id?: string
          reason?: string
          rejection_note?: string | null
          reward_code?: string
          reward_title?: string
          reward_type?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hr_rewards_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      kiotviet_categories: {
        Row: {
          category_name: string
          created_date: string | null
          has_child: boolean | null
          id: number
          level: number | null
          modified_date: string | null
          parent_id: number | null
          retailer_id: number | null
          synced_at: string | null
        }
        Insert: {
          category_name: string
          created_date?: string | null
          has_child?: boolean | null
          id: number
          level?: number | null
          modified_date?: string | null
          parent_id?: number | null
          retailer_id?: number | null
          synced_at?: string | null
        }
        Update: {
          category_name?: string
          created_date?: string | null
          has_child?: boolean | null
          id?: number
          level?: number | null
          modified_date?: string | null
          parent_id?: number | null
          retailer_id?: number | null
          synced_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "kiotviet_categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "kiotviet_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      kiotviet_credentials: {
        Row: {
          client_id: string
          created_at: string | null
          encrypted_client_secret: string | null
          encrypted_token: string
          id: string
          is_active: boolean | null
          retailer_name: string
          token_expires_at: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          client_id: string
          created_at?: string | null
          encrypted_client_secret?: string | null
          encrypted_token: string
          id?: string
          is_active?: boolean | null
          retailer_name: string
          token_expires_at?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          client_id?: string
          created_at?: string | null
          encrypted_client_secret?: string | null
          encrypted_token?: string
          id?: string
          is_active?: boolean | null
          retailer_name?: string
          token_expires_at?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      kiotviet_inventory: {
        Row: {
          available: number | null
          branch_id: number
          branch_name: string | null
          id: string
          on_hand: number | null
          product_id: number | null
          reserved: number | null
          synced_at: string | null
        }
        Insert: {
          available?: number | null
          branch_id: number
          branch_name?: string | null
          id?: string
          on_hand?: number | null
          product_id?: number | null
          reserved?: number | null
          synced_at?: string | null
        }
        Update: {
          available?: number | null
          branch_id?: number
          branch_name?: string | null
          id?: string
          on_hand?: number | null
          product_id?: number | null
          reserved?: number | null
          synced_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "kiotviet_inventory_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "kiotviet_products"
            referencedColumns: ["id"]
          },
        ]
      }
      kiotviet_products: {
        Row: {
          allow_sale: boolean | null
          attributes: Json | null
          barcode: string | null
          base_price: number | null
          category_id: number | null
          code: string
          created_at: string | null
          description: string | null
          full_name: string | null
          has_variants: boolean | null
          id: number
          images: Json | null
          is_active: boolean | null
          name: string
          product_type: number | null
          synced_at: string | null
          units: Json | null
        }
        Insert: {
          allow_sale?: boolean | null
          attributes?: Json | null
          barcode?: string | null
          base_price?: number | null
          category_id?: number | null
          code: string
          created_at?: string | null
          description?: string | null
          full_name?: string | null
          has_variants?: boolean | null
          id: number
          images?: Json | null
          is_active?: boolean | null
          name: string
          product_type?: number | null
          synced_at?: string | null
          units?: Json | null
        }
        Update: {
          allow_sale?: boolean | null
          attributes?: Json | null
          barcode?: string | null
          base_price?: number | null
          category_id?: number | null
          code?: string
          created_at?: string | null
          description?: string | null
          full_name?: string | null
          has_variants?: boolean | null
          id?: number
          images?: Json | null
          is_active?: boolean | null
          name?: string
          product_type?: number | null
          synced_at?: string | null
          units?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "kiotviet_products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "kiotviet_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      kiotviet_products_full: {
        Row: {
          allow_sale: boolean | null
          attributes: Json | null
          barcode: string | null
          base_price: number | null
          category_id: number | null
          category_name: string | null
          category_path: string | null
          code: string
          created_at: string | null
          description: string | null
          full_name: string | null
          has_variants: boolean | null
          id: number
          images: Json | null
          inventory_by_branch: Json | null
          is_active: boolean | null
          is_batch_expire_control: boolean | null
          is_lot_serial_control: boolean | null
          is_reward_point: boolean | null
          low_stock_alert: boolean | null
          max_stock: number | null
          min_stock: number | null
          name: string
          order_template: string | null
          overstock_alert: boolean | null
          price_books: Json | null
          product_batch_expires: Json | null
          product_formulas: Json | null
          product_serials: Json | null
          product_shelves: Json | null
          product_type: number | null
          synced_at: string | null
          total_available: number | null
          total_on_hand: number | null
          total_reserved: number | null
          trademark_id: number | null
          trademark_name: string | null
          units: Json | null
          updated_at: string | null
          weight: number | null
        }
        Insert: {
          allow_sale?: boolean | null
          attributes?: Json | null
          barcode?: string | null
          base_price?: number | null
          category_id?: number | null
          category_name?: string | null
          category_path?: string | null
          code: string
          created_at?: string | null
          description?: string | null
          full_name?: string | null
          has_variants?: boolean | null
          id: number
          images?: Json | null
          inventory_by_branch?: Json | null
          is_active?: boolean | null
          is_batch_expire_control?: boolean | null
          is_lot_serial_control?: boolean | null
          is_reward_point?: boolean | null
          low_stock_alert?: boolean | null
          max_stock?: number | null
          min_stock?: number | null
          name: string
          order_template?: string | null
          overstock_alert?: boolean | null
          price_books?: Json | null
          product_batch_expires?: Json | null
          product_formulas?: Json | null
          product_serials?: Json | null
          product_shelves?: Json | null
          product_type?: number | null
          synced_at?: string | null
          total_available?: number | null
          total_on_hand?: number | null
          total_reserved?: number | null
          trademark_id?: number | null
          trademark_name?: string | null
          units?: Json | null
          updated_at?: string | null
          weight?: number | null
        }
        Update: {
          allow_sale?: boolean | null
          attributes?: Json | null
          barcode?: string | null
          base_price?: number | null
          category_id?: number | null
          category_name?: string | null
          category_path?: string | null
          code?: string
          created_at?: string | null
          description?: string | null
          full_name?: string | null
          has_variants?: boolean | null
          id?: number
          images?: Json | null
          inventory_by_branch?: Json | null
          is_active?: boolean | null
          is_batch_expire_control?: boolean | null
          is_lot_serial_control?: boolean | null
          is_reward_point?: boolean | null
          low_stock_alert?: boolean | null
          max_stock?: number | null
          min_stock?: number | null
          name?: string
          order_template?: string | null
          overstock_alert?: boolean | null
          price_books?: Json | null
          product_batch_expires?: Json | null
          product_formulas?: Json | null
          product_serials?: Json | null
          product_shelves?: Json | null
          product_type?: number | null
          synced_at?: string | null
          total_available?: number | null
          total_on_hand?: number | null
          total_reserved?: number | null
          trademark_id?: number | null
          trademark_name?: string | null
          units?: Json | null
          updated_at?: string | null
          weight?: number | null
        }
        Relationships: []
      }
      kiotviet_sync_logs: {
        Row: {
          completed_at: string | null
          error_message: string | null
          id: string
          records_synced: number | null
          started_at: string | null
          status: string
          sync_type: string
        }
        Insert: {
          completed_at?: string | null
          error_message?: string | null
          id?: string
          records_synced?: number | null
          started_at?: string | null
          status: string
          sync_type: string
        }
        Update: {
          completed_at?: string | null
          error_message?: string | null
          id?: string
          records_synced?: number | null
          started_at?: string | null
          status?: string
          sync_type?: string
        }
        Relationships: []
      }
      kiotviet_sync_schedules: {
        Row: {
          created_at: string
          credential_id: string
          custom_interval_hours: number | null
          enabled: boolean
          frequency: string
          id: string
          last_run_at: string | null
          next_run_at: string | null
          sync_type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          credential_id: string
          custom_interval_hours?: number | null
          enabled?: boolean
          frequency?: string
          id?: string
          last_run_at?: string | null
          next_run_at?: string | null
          sync_type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          credential_id?: string
          custom_interval_hours?: number | null
          enabled?: boolean
          frequency?: string
          id?: string
          last_run_at?: string | null
          next_run_at?: string | null
          sync_type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "kiotviet_sync_schedules_credential_id_fkey"
            columns: ["credential_id"]
            isOneToOne: false
            referencedRelation: "kiotviet_credentials"
            referencedColumns: ["id"]
          },
        ]
      }
      lens_banners: {
        Row: {
          created_at: string | null
          display_order: number | null
          id: string
          image_url: string
          is_active: boolean | null
          link_url: string | null
          subtitle: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          display_order?: number | null
          id?: string
          image_url: string
          is_active?: boolean | null
          link_url?: string | null
          subtitle?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          display_order?: number | null
          id?: string
          image_url?: string
          is_active?: boolean | null
          link_url?: string | null
          subtitle?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      lens_product_attributes: {
        Row: {
          created_at: string | null
          display_order: number | null
          icon: string | null
          id: string
          is_active: boolean | null
          name: string
          options: Json | null
          slug: string
          type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          display_order?: number | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          options?: Json | null
          slug: string
          type?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          display_order?: number | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          options?: Json | null
          slug?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      lens_product_attributes_backup: {
        Row: {
          created_at: string | null
          display_order: number | null
          icon: string | null
          id: string | null
          is_active: boolean | null
          name: string | null
          options: Json | null
          slug: string | null
          type: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          display_order?: number | null
          icon?: string | null
          id?: string | null
          is_active?: boolean | null
          name?: string | null
          options?: Json | null
          slug?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          display_order?: number | null
          icon?: string | null
          id?: string | null
          is_active?: boolean | null
          name?: string | null
          options?: Json | null
          slug?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      lens_product_attributes_backup_v2: {
        Row: {
          created_at: string | null
          display_order: number | null
          icon: string | null
          id: string | null
          is_active: boolean | null
          name: string | null
          options: Json | null
          slug: string | null
          type: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          display_order?: number | null
          icon?: string | null
          id?: string | null
          is_active?: boolean | null
          name?: string | null
          options?: Json | null
          slug?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          display_order?: number | null
          icon?: string | null
          id?: string | null
          is_active?: boolean | null
          name?: string | null
          options?: Json | null
          slug?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      lens_product_use_case_scores: {
        Row: {
          created_at: string | null
          id: string
          product_id: string
          reasoning: string | null
          score: number
          updated_at: string | null
          use_case_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          product_id: string
          reasoning?: string | null
          score: number
          updated_at?: string | null
          use_case_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          product_id?: string
          reasoning?: string | null
          score?: number
          updated_at?: string | null
          use_case_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lens_product_use_case_scores_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "lens_products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lens_product_use_case_scores_use_case_id_fkey"
            columns: ["use_case_id"]
            isOneToOne: false
            referencedRelation: "lens_use_cases"
            referencedColumns: ["id"]
          },
        ]
      }
      lens_products: {
        Row: {
          attributes: Json | null
          created_at: string | null
          created_by: string | null
          description: string | null
          discount_percent: number | null
          id: string
          image_urls: Json | null
          is_active: boolean | null
          is_promotion: boolean | null
          name: string
          price: number
          promotion_text: string | null
          related_product_ids: Json | null
          sale_price: number | null
          sku: string | null
          updated_at: string | null
          view_count: number | null
        }
        Insert: {
          attributes?: Json | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          discount_percent?: number | null
          id?: string
          image_urls?: Json | null
          is_active?: boolean | null
          is_promotion?: boolean | null
          name: string
          price?: number
          promotion_text?: string | null
          related_product_ids?: Json | null
          sale_price?: number | null
          sku?: string | null
          updated_at?: string | null
          view_count?: number | null
        }
        Update: {
          attributes?: Json | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          discount_percent?: number | null
          id?: string
          image_urls?: Json | null
          is_active?: boolean | null
          is_promotion?: boolean | null
          name?: string
          price?: number
          promotion_text?: string | null
          related_product_ids?: Json | null
          sale_price?: number | null
          sku?: string | null
          updated_at?: string | null
          view_count?: number | null
        }
        Relationships: []
      }
      lens_recommendation_groups: {
        Row: {
          color: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          display_order: number | null
          icon: string | null
          id: string
          is_active: boolean | null
          name: string
          slug: string
          updated_at: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          display_order?: number | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          slug: string
          updated_at?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          display_order?: number | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          slug?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      lens_recommendation_products: {
        Row: {
          created_at: string | null
          display_order: number | null
          group_id: string
          id: string
          notes: string | null
          product_id: string
        }
        Insert: {
          created_at?: string | null
          display_order?: number | null
          group_id: string
          id?: string
          notes?: string | null
          product_id: string
        }
        Update: {
          created_at?: string | null
          display_order?: number | null
          group_id?: string
          id?: string
          notes?: string | null
          product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lens_recommendation_products_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "lens_recommendation_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lens_recommendation_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "lens_products"
            referencedColumns: ["id"]
          },
        ]
      }
      lens_supply_tiers: {
        Row: {
          created_at: string | null
          cyl_max: number
          cyl_min: number
          display_order: number | null
          id: string
          is_active: boolean | null
          lead_time_days: number
          price_adjustment: number | null
          product_id: string
          sph_max: number
          sph_min: number
          stock_quantity: number | null
          tier_name: string | null
          tier_type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          cyl_max: number
          cyl_min: number
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          lead_time_days?: number
          price_adjustment?: number | null
          product_id: string
          sph_max: number
          sph_min: number
          stock_quantity?: number | null
          tier_name?: string | null
          tier_type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          cyl_max?: number
          cyl_min?: number
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          lead_time_days?: number
          price_adjustment?: number | null
          product_id?: string
          sph_max?: number
          sph_min?: number
          stock_quantity?: number | null
          tier_name?: string | null
          tier_type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lens_supply_tiers_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "lens_products"
            referencedColumns: ["id"]
          },
        ]
      }
      lens_use_cases: {
        Row: {
          code: string
          created_at: string | null
          description: string | null
          display_order: number | null
          icon: string | null
          id: string
          is_active: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
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
          deleted_employee_code: string | null
          deleted_employee_name: string | null
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
          deleted_employee_code?: string | null
          deleted_employee_name?: string | null
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
          deleted_employee_code?: string | null
          deleted_employee_name?: string | null
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
      otp_rate_limit: {
        Row: {
          attempt_count: number | null
          blocked_until: string | null
          created_at: string | null
          email: string
          first_attempt_at: string | null
          id: string
          last_attempt_at: string | null
        }
        Insert: {
          attempt_count?: number | null
          blocked_until?: string | null
          created_at?: string | null
          email: string
          first_attempt_at?: string | null
          id?: string
          last_attempt_at?: string | null
        }
        Update: {
          attempt_count?: number | null
          blocked_until?: string | null
          created_at?: string | null
          email?: string
          first_attempt_at?: string | null
          id?: string
          last_attempt_at?: string | null
        }
        Relationships: []
      }
      payroll_invoice_commissions: {
        Row: {
          commission_amount: number | null
          commission_type: string
          created_at: string | null
          id: string
          invoice_level: string
          payroll_id: string
          quantity: number | null
          return_quantity: number | null
          return_value: string | null
        }
        Insert: {
          commission_amount?: number | null
          commission_type?: string
          created_at?: string | null
          id?: string
          invoice_level: string
          payroll_id: string
          quantity?: number | null
          return_quantity?: number | null
          return_value?: string | null
        }
        Update: {
          commission_amount?: number | null
          commission_type?: string
          created_at?: string | null
          id?: string
          invoice_level?: string
          payroll_id?: string
          quantity?: number | null
          return_quantity?: number | null
          return_value?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payroll_invoice_commissions_payroll_id_fkey"
            columns: ["payroll_id"]
            isOneToOne: false
            referencedRelation: "employee_payrolls"
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
          level: number | null
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: number
          is_system?: boolean | null
          level?: number | null
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: number
          is_system?: boolean | null
          level?: number | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      supplier_catalogs: {
        Row: {
          created_at: string | null
          created_by: string | null
          display_name: string
          display_order: number | null
          file_name: string
          file_size: number | null
          icon: string | null
          id: string
          is_active: boolean | null
          pdf_url: string
          supplier_name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          display_name: string
          display_order?: number | null
          file_name: string
          file_size?: number | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          pdf_url: string
          supplier_name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          display_name?: string
          display_order?: number | null
          file_name?: string
          file_size?: number | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          pdf_url?: string
          supplier_name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      training_competency_levels: {
        Row: {
          color: string
          created_at: string
          description: string | null
          id: string
          level: number
          name: string
        }
        Insert: {
          color?: string
          created_at?: string
          description?: string | null
          id?: string
          level: number
          name: string
        }
        Update: {
          color?: string
          created_at?: string
          description?: string | null
          id?: string
          level?: number
          name?: string
        }
        Relationships: []
      }
      training_documents: {
        Row: {
          created_at: string
          description: string | null
          display_order: number | null
          document_type: string
          embed_url: string | null
          file_size: number | null
          file_url: string | null
          id: string
          is_required: boolean | null
          program_id: string | null
          session_id: string | null
          title: string
          updated_at: string
          uploaded_by: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          document_type: string
          embed_url?: string | null
          file_size?: number | null
          file_url?: string | null
          id?: string
          is_required?: boolean | null
          program_id?: string | null
          session_id?: string | null
          title: string
          updated_at?: string
          uploaded_by?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          document_type?: string
          embed_url?: string | null
          file_size?: number | null
          file_url?: string | null
          id?: string
          is_required?: boolean | null
          program_id?: string | null
          session_id?: string | null
          title?: string
          updated_at?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "training_documents_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "training_programs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "training_documents_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "training_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      training_enrollments: {
        Row: {
          attendance_rate: number | null
          certificate_issued: boolean | null
          certificate_url: string | null
          completion_date: string | null
          created_at: string
          employee_id: string
          enrolled_by: string | null
          enrolled_date: string
          enrollment_type: string | null
          final_score: number | null
          id: string
          notes: string | null
          post_test_score: number | null
          pre_test_score: number | null
          program_id: string
          session_id: string
          status: string
          trainer_remarks: string | null
          updated_at: string
        }
        Insert: {
          attendance_rate?: number | null
          certificate_issued?: boolean | null
          certificate_url?: string | null
          completion_date?: string | null
          created_at?: string
          employee_id: string
          enrolled_by?: string | null
          enrolled_date?: string
          enrollment_type?: string | null
          final_score?: number | null
          id?: string
          notes?: string | null
          post_test_score?: number | null
          pre_test_score?: number | null
          program_id: string
          session_id: string
          status?: string
          trainer_remarks?: string | null
          updated_at?: string
        }
        Update: {
          attendance_rate?: number | null
          certificate_issued?: boolean | null
          certificate_url?: string | null
          completion_date?: string | null
          created_at?: string
          employee_id?: string
          enrolled_by?: string | null
          enrolled_date?: string
          enrollment_type?: string | null
          final_score?: number | null
          id?: string
          notes?: string | null
          post_test_score?: number | null
          pre_test_score?: number | null
          program_id?: string
          session_id?: string
          status?: string
          trainer_remarks?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_enrollments_employee"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_enrollments_program"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "training_programs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_enrollments_session"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "training_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "training_enrollments_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "training_enrollments_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "training_programs"
            referencedColumns: ["id"]
          },
        ]
      }
      training_feedback: {
        Row: {
          comments: string | null
          content_rating: number | null
          created_at: string
          employee_id: string
          facility_rating: number | null
          id: string
          overall_rating: number | null
          program_id: string | null
          session_id: string | null
          suggestions: string | null
          trainer_rating: number | null
          would_recommend: boolean | null
        }
        Insert: {
          comments?: string | null
          content_rating?: number | null
          created_at?: string
          employee_id: string
          facility_rating?: number | null
          id?: string
          overall_rating?: number | null
          program_id?: string | null
          session_id?: string | null
          suggestions?: string | null
          trainer_rating?: number | null
          would_recommend?: boolean | null
        }
        Update: {
          comments?: string | null
          content_rating?: number | null
          created_at?: string
          employee_id?: string
          facility_rating?: number | null
          id?: string
          overall_rating?: number | null
          program_id?: string | null
          session_id?: string | null
          suggestions?: string | null
          trainer_rating?: number | null
          would_recommend?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "training_feedback_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "training_feedback_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "training_programs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "training_feedback_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "training_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      training_program_competencies: {
        Row: {
          competency_code: string
          competency_name: string
          created_at: string
          id: string
          program_id: string
          target_level: number
        }
        Insert: {
          competency_code: string
          competency_name: string
          created_at?: string
          id?: string
          program_id: string
          target_level: number
        }
        Update: {
          competency_code?: string
          competency_name?: string
          created_at?: string
          id?: string
          program_id?: string
          target_level?: number
        }
        Relationships: [
          {
            foreignKeyName: "training_competencies_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "training_programs"
            referencedColumns: ["id"]
          },
        ]
      }
      training_programs: {
        Row: {
          category: string
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          description: string | null
          duration_hours: number
          end_date: string | null
          id: string
          is_mandatory: boolean | null
          learning_objectives: string | null
          location: string | null
          max_participants: number | null
          online_meeting_link: string | null
          passing_score: number | null
          prerequisites: string | null
          program_code: string
          start_date: string | null
          status: string
          title: string
          trainer_email: string | null
          trainer_name: string | null
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          description?: string | null
          duration_hours?: number
          end_date?: string | null
          id?: string
          is_mandatory?: boolean | null
          learning_objectives?: string | null
          location?: string | null
          max_participants?: number | null
          online_meeting_link?: string | null
          passing_score?: number | null
          prerequisites?: string | null
          program_code: string
          start_date?: string | null
          status?: string
          title: string
          trainer_email?: string | null
          trainer_name?: string | null
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          description?: string | null
          duration_hours?: number
          end_date?: string | null
          id?: string
          is_mandatory?: boolean | null
          learning_objectives?: string | null
          location?: string | null
          max_participants?: number | null
          online_meeting_link?: string | null
          passing_score?: number | null
          prerequisites?: string | null
          program_code?: string
          start_date?: string | null
          status?: string
          title?: string
          trainer_email?: string | null
          trainer_name?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      training_quiz_attempts: {
        Row: {
          answers: Json
          attempt_number: number
          created_at: string
          employee_id: string
          enrollment_id: string | null
          id: string
          passed: boolean | null
          quiz_id: string
          score: number | null
          started_at: string
          status: string
          submitted_at: string | null
          time_taken_minutes: number | null
        }
        Insert: {
          answers?: Json
          attempt_number?: number
          created_at?: string
          employee_id: string
          enrollment_id?: string | null
          id?: string
          passed?: boolean | null
          quiz_id: string
          score?: number | null
          started_at?: string
          status?: string
          submitted_at?: string | null
          time_taken_minutes?: number | null
        }
        Update: {
          answers?: Json
          attempt_number?: number
          created_at?: string
          employee_id?: string
          enrollment_id?: string | null
          id?: string
          passed?: boolean | null
          quiz_id?: string
          score?: number | null
          started_at?: string
          status?: string
          submitted_at?: string | null
          time_taken_minutes?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "training_quiz_attempts_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "training_quiz_attempts_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "training_enrollments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "training_quiz_attempts_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "training_quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      training_quizzes: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          max_attempts: number | null
          passing_score: number
          program_id: string | null
          questions: Json
          quiz_type: string
          randomize_questions: boolean | null
          score_policy: string | null
          session_id: string | null
          show_correct_answers: boolean | null
          time_limit_minutes: number
          title: string
          total_questions: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          max_attempts?: number | null
          passing_score?: number
          program_id?: string | null
          questions?: Json
          quiz_type: string
          randomize_questions?: boolean | null
          score_policy?: string | null
          session_id?: string | null
          show_correct_answers?: boolean | null
          time_limit_minutes?: number
          title: string
          total_questions?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          max_attempts?: number | null
          passing_score?: number
          program_id?: string | null
          questions?: Json
          quiz_type?: string
          randomize_questions?: boolean | null
          score_policy?: string | null
          session_id?: string | null
          show_correct_answers?: boolean | null
          time_limit_minutes?: number
          title?: string
          total_questions?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "training_quizzes_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "training_programs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "training_quizzes_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "training_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      training_sessions: {
        Row: {
          agenda: string | null
          created_at: string
          current_participants: number | null
          end_date: string
          end_time: string
          id: string
          location: string | null
          location_type: string | null
          max_participants: number | null
          meeting_url: string | null
          notes: string | null
          online_meeting_link: string | null
          program_id: string
          session_date: string
          session_name: string
          session_number: number
          start_date: string
          start_time: string
          status: string
          trainer_id: string | null
          trainer_name: string | null
          updated_at: string
        }
        Insert: {
          agenda?: string | null
          created_at?: string
          current_participants?: number | null
          end_date?: string
          end_time: string
          id?: string
          location?: string | null
          location_type?: string | null
          max_participants?: number | null
          meeting_url?: string | null
          notes?: string | null
          online_meeting_link?: string | null
          program_id: string
          session_date: string
          session_name: string
          session_number: number
          start_date?: string
          start_time: string
          status?: string
          trainer_id?: string | null
          trainer_name?: string | null
          updated_at?: string
        }
        Update: {
          agenda?: string | null
          created_at?: string
          current_participants?: number | null
          end_date?: string
          end_time?: string
          id?: string
          location?: string | null
          location_type?: string | null
          max_participants?: number | null
          meeting_url?: string | null
          notes?: string | null
          online_meeting_link?: string | null
          program_id?: string
          session_date?: string
          session_name?: string
          session_number?: number
          start_date?: string
          start_time?: string
          status?: string
          trainer_id?: string | null
          trainer_name?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_sessions_program"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "training_programs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_sessions_trainer"
            columns: ["trainer_id"]
            isOneToOne: false
            referencedRelation: "training_trainers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "training_sessions_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "training_programs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "training_sessions_trainer_id_fkey"
            columns: ["trainer_id"]
            isOneToOne: false
            referencedRelation: "training_trainers"
            referencedColumns: ["id"]
          },
        ]
      }
      training_trainers: {
        Row: {
          avatar_path: string | null
          bio: string | null
          created_at: string
          email: string
          expertise: string | null
          full_name: string
          id: string
          phone: string | null
          status: string
          updated_at: string
        }
        Insert: {
          avatar_path?: string | null
          bio?: string | null
          created_at?: string
          email: string
          expertise?: string | null
          full_name: string
          id?: string
          phone?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          avatar_path?: string | null
          bio?: string | null
          created_at?: string
          email?: string
          expertise?: string | null
          full_name?: string
          id?: string
          phone?: string | null
          status?: string
          updated_at?: string
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
      voucher_campaigns: {
        Row: {
          campaign_id: number
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          updated_at: string | null
          voucher_image_url: string | null
        }
        Insert: {
          campaign_id: number
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string | null
          voucher_image_url?: string | null
        }
        Update: {
          campaign_id?: number
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
          voucher_image_url?: string | null
        }
        Relationships: []
      }
      voucher_customer_types: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          type_code: string
          type_name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          type_code: string
          type_name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          type_code?: string
          type_name?: string
        }
        Relationships: []
      }
      voucher_issuance_history: {
        Row: {
          api_response: Json | null
          campaign_id: string
          created_at: string | null
          customer_type: string | null
          error_message: string | null
          id: string
          issued_by: string | null
          phone: string
          source: string
          status: string | null
          voucher_code: string | null
        }
        Insert: {
          api_response?: Json | null
          campaign_id: string
          created_at?: string | null
          customer_type?: string | null
          error_message?: string | null
          id?: string
          issued_by?: string | null
          phone: string
          source: string
          status?: string | null
          voucher_code?: string | null
        }
        Update: {
          api_response?: Json | null
          campaign_id?: string
          created_at?: string | null
          customer_type?: string | null
          error_message?: string | null
          id?: string
          issued_by?: string | null
          phone?: string
          source?: string
          status?: string | null
          voucher_code?: string | null
        }
        Relationships: []
      }
      voucher_sources: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          source_code: string
          source_name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          source_code: string
          source_name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          source_code?: string
          source_name?: string
        }
        Relationships: []
      }
      voucher_templates: {
        Row: {
          created_at: string | null
          id: string
          is_default: boolean | null
          name: string
          template_html: string | null
          template_text: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          name: string
          template_html?: string | null
          template_text: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          name?: string
          template_html?: string | null
          template_text?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      cleanup_expired_otp: { Args: never; Returns: undefined }
      generate_doc_number: {
        Args: { _doc_type: string; _year: number }
        Returns: string
      }
      get_user_profile_simple: { Args: { _user_id: string }; Returns: Json }
      get_user_role_level: { Args: { _user_id: string }; Returns: number }
      has_role:
        | { Args: { _role_name: string; _user_id: string }; Returns: boolean }
        | {
            Args: {
              _role: Database["public"]["Enums"]["app_role"]
              _user_id: string
            }
            Returns: boolean
          }
      is_admin: { Args: { _user_id: string }; Returns: boolean }
      revoke_user_sessions: {
        Args: { target_user_id: string }
        Returns: undefined
      }
      validate_attribute_options: { Args: { opts: Json }; Returns: boolean }
      verify_employee_otp_batch: {
        Args: { p_email: string; p_otp_code: string }
        Returns: Json
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
