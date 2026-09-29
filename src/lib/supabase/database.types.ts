
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  
  "public": {
          Tables: {
            "admin_users": {
                  Row: {
                    "created_at": string,"email": string,"user_id": string
                  }
                  Insert: {
                    "created_at"?: string,"email": string,"user_id": string
                  }
                  Update: {
                    "created_at"?: string,"email"?: string,"user_id"?: string
                  }
                  Relationships: [
                    
                  ]
                },"audit_log": {
                  Row: {
                    "action": string,"actor": string | null,"created_at": string,"id": number,"new_row": Json | null,"old_row": Json | null,"row_id": string | null,"table_name": string
                  }
                  Insert: {
                    "action": string,"actor"?: string | null,"created_at"?: string,"id"?: never,"new_row"?: Json | null,"old_row"?: Json | null,"row_id"?: string | null,"table_name": string
                  }
                  Update: {
                    "action"?: string,"actor"?: string | null,"created_at"?: string,"id"?: never,"new_row"?: Json | null,"old_row"?: Json | null,"row_id"?: string | null,"table_name"?: string
                  }
                  Relationships: [
                    
                  ]
                },"categories": {
                  Row: {
                    "created_at": string,"description_ar": string,"description_en": string,"icon": string,"id": string,"name_ar": string,"name_en": string,"published": boolean,"slug": string,"sort_order": number,"updated_at": string
                  }
                  Insert: {
                    "created_at"?: string,"description_ar"?: string,"description_en"?: string,"icon"?: string,"id"?: string,"name_ar": string,"name_en": string,"published"?: boolean,"slug": string,"sort_order"?: number,"updated_at"?: string
                  }
                  Update: {
                    "created_at"?: string,"description_ar"?: string,"description_en"?: string,"icon"?: string,"id"?: string,"name_ar"?: string,"name_en"?: string,"published"?: boolean,"slug"?: string,"sort_order"?: number,"updated_at"?: string
                  }
                  Relationships: [
                    
                  ]
                },"currencies": {
                  Row: {
                    "code": string,"decimals": number,"enabled": boolean,"is_default": boolean,"name_ar": string,"name_en": string,"rate_per_kwd": number,"rounding": number,"sort_order": number,"symbol": string,"updated_at": string
                  }
                  Insert: {
                    "code": string,"decimals"?: number,"enabled"?: boolean,"is_default"?: boolean,"name_ar": string,"name_en": string,"rate_per_kwd": number,"rounding"?: number,"sort_order"?: number,"symbol": string,"updated_at"?: string
                  }
                  Update: {
                    "code"?: string,"decimals"?: number,"enabled"?: boolean,"is_default"?: boolean,"name_ar"?: string,"name_en"?: string,"rate_per_kwd"?: number,"rounding"?: number,"sort_order"?: number,"symbol"?: string,"updated_at"?: string
                  }
                  Relationships: [
                    
                  ]
                },"faqs": {
                  Row: {
                    "answer_ar": string,"answer_en": string,"created_at": string,"id": string,"published": boolean,"question_ar": string,"question_en": string,"sort_order": number,"updated_at": string
                  }
                  Insert: {
                    "answer_ar": string,"answer_en": string,"created_at"?: string,"id"?: string,"published"?: boolean,"question_ar": string,"question_en": string,"sort_order"?: number,"updated_at"?: string
                  }
                  Update: {
                    "answer_ar"?: string,"answer_en"?: string,"created_at"?: string,"id"?: string,"published"?: boolean,"question_ar"?: string,"question_en"?: string,"sort_order"?: number,"updated_at"?: string
                  }
                  Relationships: [
                    
                  ]
                },"inquiries": {
                  Row: {
                    "admin_notes": string,"calculator": Json | null,"category_id": string | null,"company": string | null,"created_at": string,"currency_code": string | null,"email": string | null,"estimate_from_kwd": number | null,"estimate_to_kwd": number | null,"id": string,"ip_hash": string | null,"locale": string,"message": string,"name": string,"notified_email_at": string | null,"notified_whatsapp_at": string | null,"phone": string | null,"source": string,"status": Database["public"]['Enums']["inquiry_status"],"tier": Database["public"]['Enums']["tier"] | null,"updated_at": string,"user_agent": string | null
                  }
                  Insert: {
                    "admin_notes"?: string,"calculator"?: Json | null,"category_id"?: string | null,"company"?: string | null,"created_at"?: string,"currency_code"?: string | null,"email"?: string | null,"estimate_from_kwd"?: number | null,"estimate_to_kwd"?: number | null,"id"?: string,"ip_hash"?: string | null,"locale": string,"message": string,"name": string,"notified_email_at"?: string | null,"notified_whatsapp_at"?: string | null,"phone"?: string | null,"source": string,"status"?: Database["public"]['Enums']["inquiry_status"],"tier"?: Database["public"]['Enums']["tier"] | null,"updated_at"?: string,"user_agent"?: string | null
                  }
                  Update: {
                    "admin_notes"?: string,"calculator"?: Json | null,"category_id"?: string | null,"company"?: string | null,"created_at"?: string,"currency_code"?: string | null,"email"?: string | null,"estimate_from_kwd"?: number | null,"estimate_to_kwd"?: number | null,"id"?: string,"ip_hash"?: string | null,"locale"?: string,"message"?: string,"name"?: string,"notified_email_at"?: string | null,"notified_whatsapp_at"?: string | null,"phone"?: string | null,"source"?: string,"status"?: Database["public"]['Enums']["inquiry_status"],"tier"?: Database["public"]['Enums']["tier"] | null,"updated_at"?: string,"user_agent"?: string | null
                  }
                  Relationships: [
                    {
      foreignKeyName: "inquiries_category_id_fkey"
      columns: ["category_id"]
isOneToOne: false
      referencedRelation: "categories"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "inquiries_currency_code_fkey"
      columns: ["currency_code"]
isOneToOne: false
      referencedRelation: "currencies"
      referencedColumns: ["code"]
    }
                  ]
                },"maintenance_plans": {
                  Row: {
                    "created_at": string,"highlighted": boolean,"id": string,"includes": NonNullable<Json>,"name_ar": string,"name_en": string,"price_kwd_month": number,"published": boolean,"slug": string,"sort_order": number,"updated_at": string
                  }
                  Insert: {
                    "created_at"?: string,"highlighted"?: boolean,"id"?: string,"includes"?: NonNullable<Json>,"name_ar": string,"name_en": string,"price_kwd_month": number,"published"?: boolean,"slug": string,"sort_order"?: number,"updated_at"?: string
                  }
                  Update: {
                    "created_at"?: string,"highlighted"?: boolean,"id"?: string,"includes"?: NonNullable<Json>,"name_ar"?: string,"name_en"?: string,"price_kwd_month"?: number,"published"?: boolean,"slug"?: string,"sort_order"?: number,"updated_at"?: string
                  }
                  Relationships: [
                    
                  ]
                },"packages": {
                  Row: {
                    "category_id": string | null,"created_at": string,"delivery_days_max": number,"delivery_days_min": number,"highlighted": boolean,"id": string,"includes": NonNullable<Json>,"name_ar": string,"name_en": string,"price_from_kwd": number,"price_to_kwd": number,"published": boolean,"sort_order": number,"tagline_ar": string,"tagline_en": string,"tier": Database["public"]['Enums']["tier"],"updated_at": string
                  }
                  Insert: {
                    "category_id"?: string | null,"created_at"?: string,"delivery_days_max": number,"delivery_days_min": number,"highlighted"?: boolean,"id"?: string,"includes"?: NonNullable<Json>,"name_ar": string,"name_en": string,"price_from_kwd": number,"price_to_kwd": number,"published"?: boolean,"sort_order"?: number,"tagline_ar"?: string,"tagline_en"?: string,"tier": Database["public"]['Enums']["tier"],"updated_at"?: string
                  }
                  Update: {
                    "category_id"?: string | null,"created_at"?: string,"delivery_days_max"?: number,"delivery_days_min"?: number,"highlighted"?: boolean,"id"?: string,"includes"?: NonNullable<Json>,"name_ar"?: string,"name_en"?: string,"price_from_kwd"?: number,"price_to_kwd"?: number,"published"?: boolean,"sort_order"?: number,"tagline_ar"?: string,"tagline_en"?: string,"tier"?: Database["public"]['Enums']["tier"],"updated_at"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "packages_category_id_fkey"
      columns: ["category_id"]
isOneToOne: false
      referencedRelation: "categories"
      referencedColumns: ["id"]
    }
                  ]
                },"price_factors": {
                  Row: {
                    "created_at": string,"delta_from_kwd": number,"delta_to_kwd": number,"description_ar": string,"description_en": string,"example_ar": string,"example_en": string,"id": string,"in_calculator": boolean,"max_units": number | null,"name_ar": string,"name_en": string,"pricing_mode": string,"published": boolean,"slug": string,"sort_order": number,"unit_label_ar": string | null,"unit_label_en": string | null,"updated_at": string
                  }
                  Insert: {
                    "created_at"?: string,"delta_from_kwd"?: number,"delta_to_kwd"?: number,"description_ar"?: string,"description_en"?: string,"example_ar"?: string,"example_en"?: string,"id"?: string,"in_calculator"?: boolean,"max_units"?: number | null,"name_ar": string,"name_en": string,"pricing_mode"?: string,"published"?: boolean,"slug": string,"sort_order"?: number,"unit_label_ar"?: string | null,"unit_label_en"?: string | null,"updated_at"?: string
                  }
                  Update: {
                    "created_at"?: string,"delta_from_kwd"?: number,"delta_to_kwd"?: number,"description_ar"?: string,"description_en"?: string,"example_ar"?: string,"example_en"?: string,"id"?: string,"in_calculator"?: boolean,"max_units"?: number | null,"name_ar"?: string,"name_en"?: string,"pricing_mode"?: string,"published"?: boolean,"slug"?: string,"sort_order"?: number,"unit_label_ar"?: string | null,"unit_label_en"?: string | null,"updated_at"?: string
                  }
                  Relationships: [
                    
                  ]
                },"project_images": {
                  Row: {
                    "alt_ar": string,"alt_en": string,"created_at": string,"id": string,"path": string,"project_id": string,"sort_order": number
                  }
                  Insert: {
                    "alt_ar"?: string,"alt_en"?: string,"created_at"?: string,"id"?: string,"path": string,"project_id": string,"sort_order"?: number
                  }
                  Update: {
                    "alt_ar"?: string,"alt_en"?: string,"created_at"?: string,"id"?: string,"path"?: string,"project_id"?: string,"sort_order"?: number
                  }
                  Relationships: [
                    {
      foreignKeyName: "project_images_project_id_fkey"
      columns: ["project_id"]
isOneToOne: false
      referencedRelation: "projects"
      referencedColumns: ["id"]
    }
                  ]
                },"projects": {
                  Row: {
                    "accent_color": string | null,"body_ar": string,"body_en": string,"category_id": string,"client_name": string | null,"cover_path": string | null,"created_at": string,"demo_route": string | null,"duration_days": number | null,"featured": boolean,"features": NonNullable<Json>,"id": string,"is_concept": boolean,"live_url": string | null,"price_from_kwd": number,"price_to_kwd": number,"published": boolean,"slug": string,"sort_order": number,"summary_ar": string,"summary_en": string,"tech_stack": (string)[],"tier": Database["public"]['Enums']["tier"],"title_ar": string,"title_en": string,"updated_at": string
                  }
                  Insert: {
                    "accent_color"?: string | null,"body_ar"?: string,"body_en"?: string,"category_id": string,"client_name"?: string | null,"cover_path"?: string | null,"created_at"?: string,"demo_route"?: string | null,"duration_days"?: number | null,"featured"?: boolean,"features"?: NonNullable<Json>,"id"?: string,"is_concept"?: boolean,"live_url"?: string | null,"price_from_kwd": number,"price_to_kwd": number,"published"?: boolean,"slug": string,"sort_order"?: number,"summary_ar"?: string,"summary_en"?: string,"tech_stack"?: (string)[],"tier": Database["public"]['Enums']["tier"],"title_ar": string,"title_en": string,"updated_at"?: string
                  }
                  Update: {
                    "accent_color"?: string | null,"body_ar"?: string,"body_en"?: string,"category_id"?: string,"client_name"?: string | null,"cover_path"?: string | null,"created_at"?: string,"demo_route"?: string | null,"duration_days"?: number | null,"featured"?: boolean,"features"?: NonNullable<Json>,"id"?: string,"is_concept"?: boolean,"live_url"?: string | null,"price_from_kwd"?: number,"price_to_kwd"?: number,"published"?: boolean,"slug"?: string,"sort_order"?: number,"summary_ar"?: string,"summary_en"?: string,"tech_stack"?: (string)[],"tier"?: Database["public"]['Enums']["tier"],"title_ar"?: string,"title_en"?: string,"updated_at"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "projects_category_id_fkey"
      columns: ["category_id"]
isOneToOne: false
      referencedRelation: "categories"
      referencedColumns: ["id"]
    }
                  ]
                },"site_settings": {
                  Row: {
                    "is_public": boolean,"key": string,"updated_at": string,"value": NonNullable<Json>
                  }
                  Insert: {
                    "is_public"?: boolean,"key": string,"updated_at"?: string,"value": NonNullable<Json>
                  }
                  Update: {
                    "is_public"?: boolean,"key"?: string,"updated_at"?: string,"value"?: NonNullable<Json>
                  }
                  Relationships: [
                    
                  ]
                },"testimonials": {
                  Row: {
                    "author_name": string,"author_role_ar": string,"author_role_en": string,"created_at": string,"id": string,"project_id": string | null,"published": boolean,"quote_ar": string,"quote_en": string,"sort_order": number,"updated_at": string
                  }
                  Insert: {
                    "author_name": string,"author_role_ar"?: string,"author_role_en"?: string,"created_at"?: string,"id"?: string,"project_id"?: string | null,"published"?: boolean,"quote_ar": string,"quote_en": string,"sort_order"?: number,"updated_at"?: string
                  }
                  Update: {
                    "author_name"?: string,"author_role_ar"?: string,"author_role_en"?: string,"created_at"?: string,"id"?: string,"project_id"?: string | null,"published"?: boolean,"quote_ar"?: string,"quote_en"?: string,"sort_order"?: number,"updated_at"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "testimonials_project_id_fkey"
      columns: ["project_id"]
isOneToOne: false
      referencedRelation: "projects"
      referencedColumns: ["id"]
    }
                  ]
                }
          }
          Views: {
            [_ in never]: never
          }
          Functions: {
            "dearmor":
{ Args: { "": string }; Returns: string
                           },
"gen_random_uuid":
{ Args: Record<PropertyKey, never>; Returns: string
                           },
"gen_salt":
{ Args: { "": string }; Returns: string
                           },
"is_admin":
{ Args: Record<PropertyKey, never>; Returns: boolean
                           },
"pgp_armor_headers":
{ Args: { "": string }; Returns: Record<string, unknown>[]
                           }
          }
          Enums: {
            "inquiry_status": "new"|"contacted"|"won"|"lost"|"spam","tier": "starter"|"professional"|"elite"
          }
          CompositeTypes: {
            [_ in never]: never
          }
        }
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

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
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
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
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
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
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
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
    : never = never
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
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
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never

export const Constants = {
  "public": {
          Enums: {
            "inquiry_status": ["new", "contacted", "won", "lost", "spam"],"tier": ["starter", "professional", "elite"]
          }
        }
} as const

