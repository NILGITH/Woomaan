
import { supabase } from "@/integrations/supabase/client";

export interface TypeTenue {
  id: string;
  nom: string;
  description?: string;
  created_at: string;
}

export interface Magasin {
  id: string;
  created_at: string;
  nom: string;
  adresse?: string | null;
  telephone?: string | null;
  responsable?: string | null;
  type_magasin: "atelier" | "vente" | "depot";
}

export interface CategorieMatiere {
  id: string;
  nom: string;
  description?: string;
  created_at: string;
}

export const adminService = {
  // Types de Tenues
  async getTypesTenues(): Promise<TypeTenue[]> {
    const { data, error } = await supabase.from("types_tenues").select("*").order("nom");
    if (error) throw error;
    return data || [];
  },
  async createTypeTenue(typeTenue: Omit<TypeTenue, "id" | "created_at">): Promise<TypeTenue> {
    const { data, error } = await supabase.from("types_tenues").insert([typeTenue]).select().single();
    if (error) throw error;
    return data;
  },
  async updateTypeTenue(id: string, updates: Partial<TypeTenue>): Promise<TypeTenue> {
    const { data, error } = await supabase.from("types_tenues").update(updates).eq("id", id).select().single();
    if (error) throw error;
    return data;
  },
  async deleteTypeTenue(id: string): Promise<void> {
    const { error } = await supabase.from("types_tenues").delete().eq("id", id);
    if (error) throw error;
  },

  // Magasins
  async getMagasins(): Promise<Magasin[]> {
    const { data, error } = await supabase.from("magasins").select("*").order("nom");
    if (error) throw error;
    return (data as Magasin[]) || [];
  },
  async createMagasin(magasin: Omit<Magasin, "id" | "created_at">): Promise<Magasin> {
    const { data, error } = await supabase.from("magasins").insert([magasin]).select().single();
    if (error) throw error;
    return data as Magasin;
  },
  async updateMagasin(id: string, updates: Partial<Magasin>): Promise<Magasin> {
    const { data, error } = await supabase.from("magasins").update(updates).eq("id", id).select().single();
    if (error) throw error;
    return data as Magasin;
  },
  async deleteMagasin(id: string): Promise<void> {
    const { error } = await supabase.from("magasins").delete().eq("id", id);
    if (error) throw error;
  },

  // Categories Matières
  async getCategoriesMatiere(): Promise<CategorieMatiere[]> {
    const { data, error } = await supabase.from("categories_matieres").select("*").order("nom");
    if (error) throw error;
    return data || [];
  },
};
