
import { supabase } from "@/integrations/supabase/client";

export interface CategorieProduit {
  id: string;
  nom: string;
  description?: string;
  image_url?: string;
  actif: boolean;
  created_at: string;
  updated_at: string;
}

export interface Produit {
  id: string;
  nom: string;
  description?: string;
  prix_base: number;
  categorie_id?: string;
  image_url?: string;
  temps_confection?: number;
  difficulte: string;
  actif: boolean;
  created_at: string;
  updated_at: string;
  categorie?: CategorieProduit;
}

export const produitService = {
  async getCategories(): Promise<CategorieProduit[]> {
    try {
      const { data, error } = await supabase
        .from("categories_produits")
        .select("*")
        .eq("actif", true)
        .order("nom");

      if (error) throw error;
      return (data as CategorieProduit[]) || [];
    } catch (error) {
      console.error("Error fetching categories:", error);
      return [];
    }
  },

  async createCategorie(categorie: Omit<CategorieProduit, "id" | "created_at" | "updated_at">): Promise<CategorieProduit> {
    const { data, error } = await supabase
      .from("categories_produits")
      .insert([categorie])
      .select()
      .single();

    if (error) throw error;
    return data as CategorieProduit;
  },

  async updateCategorie(id: string, updates: Partial<CategorieProduit>): Promise<CategorieProduit> {
    const { data, error } = await supabase
      .from("categories_produits")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as CategorieProduit;
  },

  async getProduits(): Promise<Produit[]> {
    try {
      const { data, error } = await supabase
        .from("produits")
        .select("*")
        .eq("actif", true)
        .order("nom");

      if (error) throw error;
      return (data as Produit[]) || [];
    } catch (error) {
      console.error("Error fetching produits:", error);
      return [];
    }
  },

  async createProduit(produit: Omit<Produit, "id" | "created_at" | "updated_at" | "categorie">): Promise<Produit> {
    const { data, error } = await supabase
      .from("produits")
      .insert([produit])
      .select()
      .single();

    if (error) throw error;
    return data as Produit;
  },

  async updateProduit(id: string, updates: Partial<Produit>): Promise<Produit> {
    const { data, error } = await supabase
      .from("produits")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as Produit;
  },

  async deleteProduit(id: string): Promise<void> {
    const { error } = await supabase
      .from("produits")
      .update({ actif: false })
      .eq("id", id);

    if (error) throw error;
  }
};
