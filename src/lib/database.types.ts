export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          auth_user_id: string | null;
          email: string;
          display_name: string | null;
          bio: string | null;
          role_profile: "owner" | "breeder";
          plan: string;
          plan_status: string;
          push_enabled: boolean;
          reminder_push_enabled: boolean;
          update_push_enabled: boolean;
          marketing_push_enabled: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          auth_user_id?: string | null;
          email: string;
          display_name?: string | null;
          bio?: string | null;
          role_profile?: "owner" | "breeder";
          plan?: string;
          plan_status?: string;
          push_enabled?: boolean;
          reminder_push_enabled?: boolean;
          update_push_enabled?: boolean;
          marketing_push_enabled?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["users"]["Insert"]>;
      };
      pets: {
        Row: {
          id: string;
          owner_user_id: string;
          name: string;
          species: string;
          breed: string | null;
          sex: string | null;
          birth_date: string | null;
          birth_date_is_estimate: boolean;
          weight_kg: number | null;
          color_markings: string | null;
          chip_id: string | null;
          is_neutered: boolean | null;
          photo_url: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          owner_user_id: string;
          name: string;
          species: string;
          breed?: string | null;
          sex?: string | null;
          birth_date?: string | null;
          birth_date_is_estimate?: boolean;
          weight_kg?: number | null;
          color_markings?: string | null;
          chip_id?: string | null;
          is_neutered?: boolean | null;
          photo_url?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["pets"]["Insert"]>;
      };
      pet_access: {
        Row: {
          id: string;
          pet_id: string;
          user_id: string;
          role: "family" | "caretaker";
          is_admin: boolean;
          can_view_profile: boolean;
          can_edit_profile: boolean;
          can_view_health: boolean;
          can_edit_health: boolean;
          can_view_care_instructions: boolean;
          can_manage_reminders: boolean;
          can_view_reminders: boolean;
          can_view_private_notes: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          pet_id: string;
          user_id: string;
          role: "family" | "caretaker";
          is_admin?: boolean;
          can_view_profile?: boolean;
          can_edit_profile?: boolean;
          can_view_health?: boolean;
          can_edit_health?: boolean;
          can_view_care_instructions?: boolean;
          can_manage_reminders?: boolean;
          can_view_reminders?: boolean;
          can_view_private_notes?: boolean;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["pet_access"]["Insert"]>;
      };
      vaccinations: {
        Row: {
          id: string;
          pet_id: string;
          vaccine_name: string;
          administered_on: string;
          valid_until: string | null;
          clinic_name: string | null;
          veterinarian_name: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          pet_id: string;
          vaccine_name: string;
          administered_on: string;
          valid_until?: string | null;
          clinic_name?: string | null;
          veterinarian_name?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["vaccinations"]["Insert"]>;
      };
      medications: {
        Row: {
          id: string;
          pet_id: string;
          medication_name: string;
          dosage: string | null;
          instructions: string | null;
          start_date: string | null;
          end_date: string | null;
          status: "active" | "completed" | "paused";
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          pet_id: string;
          medication_name: string;
          dosage?: string | null;
          instructions?: string | null;
          start_date?: string | null;
          end_date?: string | null;
          status?: "active" | "completed" | "paused";
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["medications"]["Insert"]>;
      };
      vet_visits: {
        Row: {
          id: string;
          pet_id: string;
          visit_date: string;
          clinic_name: string | null;
          veterinarian_name: string | null;
          reason: string | null;
          summary: string | null;
          follow_up_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          pet_id: string;
          visit_date: string;
          clinic_name?: string | null;
          veterinarian_name?: string | null;
          reason?: string | null;
          summary?: string | null;
          follow_up_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["vet_visits"]["Insert"]>;
      };
      health_notes: {
        Row: {
          id: string;
          pet_id: string;
          type: string;
          title: string;
          content: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          pet_id: string;
          type: string;
          title: string;
          content: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["health_notes"]["Insert"]>;
      };
      care_instructions: {
        Row: {
          id: string;
          pet_id: string;
          type: string;
          title: string;
          content: string;
          sort_order: number;
          is_shared_with_caretakers: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          pet_id: string;
          type: string;
          title: string;
          content: string;
          sort_order?: number;
          is_shared_with_caretakers?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["care_instructions"]["Insert"]>;
      };
      reminders: {
        Row: {
          id: string;
          user_id: string;
          pet_id: string;
          source_type: string | null;
          source_id: string | null;
          title: string;
          description: string | null;
          due_at: string;
          status: "pending" | "completed" | "cancelled";
          notify_push: boolean;
          notify_email: boolean;
          completed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          pet_id: string;
          source_type?: string | null;
          source_id?: string | null;
          title: string;
          description?: string | null;
          due_at: string;
          status?: "pending" | "completed" | "cancelled";
          notify_push?: boolean;
          notify_email?: boolean;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["reminders"]["Insert"]>;
      };
      pet_updates: {
        Row: {
          id: string;
          pet_id: string;
          author_user_id: string;
          body: string;
          visibility: "shared" | "private";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          pet_id: string;
          author_user_id: string;
          body: string;
          visibility?: "shared" | "private";
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["pet_updates"]["Insert"]>;
      };
      attachments: {
        Row: {
          id: string;
          pet_id: string;
          related_type: string;
          related_id: string;
          file_url: string;
          file_name: string;
          mime_type: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          pet_id: string;
          related_type: string;
          related_id: string;
          file_url: string;
          file_name: string;
          mime_type: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["attachments"]["Insert"]>;
      };
      breeder_links: {
        Row: {
          id: string;
          pet_id: string;
          breeder_name: string;
          status: "pending" | "accepted" | "rejected";
          can_view_health: boolean;
          can_edit_heat_cycles: boolean;
          can_view_reminders: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          pet_id: string;
          breeder_name: string;
          status?: "pending" | "accepted" | "rejected";
          can_view_health?: boolean;
          can_edit_heat_cycles?: boolean;
          can_view_reminders?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["breeder_links"]["Insert"]>;
      };
      heat_cycles: {
        Row: {
          id: string;
          pet_id: string;
          started_on: string;
          ended_on: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          pet_id: string;
          started_on: string;
          ended_on?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["heat_cycles"]["Insert"]>;
      };
      device_push_tokens: {
        Row: {
          id: string;
          user_id: string;
          token: string;
          token_type: string;
          device_name: string | null;
          device_os: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          token: string;
          token_type: string;
          device_name?: string | null;
          device_os?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["device_push_tokens"]["Insert"]>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
