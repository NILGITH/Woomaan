import { supabase } from "@/integrations/supabase/client";
import type { Produit } from "./produitService";
import type { Client } from "./clientService";
import type { Magasin } from "./adminService";
import type { Utilisateur } from "@/types";

export interface TypeMesure {
  id: string;
  nom: string;
  description?: string;
  unite: string;
  categorie: string;
  obligatoire: boolean;
  ordre_affichage: number;
  created_at: string;
}

export interface MesureClient {
  id: string;
  article_commande_id: string;
  type_mesure_id: string;
  valeur: number;
  notes?: string;
  prise_par?: string;
  created_at: string;
  type_mesure?: TypeMesure;
}

export interface ArticleCommande {
  id: string;
  commande_id: string;
  produit_id: string;
  quantite: number;
  prix_unitaire: number;
  prix_total: number;
  notes?: string;
  created_at: string;
  produit?: Produit;
  mesures?: MesureClient[];
}

export interface Commande {
  id: string;
  numero_commande: string;
  client_id: string;
  magasin_id?: string;
  vendeur_id?: string;
  statut: string;
  date_commande: string;
  date_livraison_prevue?: string;
  date_livraison_reelle?: string;
  sous_total: number;
  remise_pourcentage: number;
  remise_montant: number;
  total: number;
  acompte: number;
  reste_a_payer: number;
  notes?: string;
  created_at: string;
  updated_at: string;
  client?: Client;
  magasin?: Magasin;
  vendeur?: Utilisateur;
  articles?: ArticleCommande[];
}

export interface Paiement {
  id: string;
  commande_id: string;
  montant: number;
  mode_paiement: string;
  reference_transaction?: string;
  date_paiement: string;
  notes?: string;
  created_by?: string;
  created_at: string;
}

export const commandeService = {
  async getTypesMesures(categorie?: string): Promise<TypeMesure[]> {
    try {
      let query = supabase
        .from("types_mesures")
        .select("*")
        .order("ordre_affichage");

      if (categorie) {
        query = query.eq("categorie", categorie);
      }

      const { data, error } = await query;
      if (error) throw error;
      return (data as TypeMesure[]) || [];
    } catch (error) {
      console.error("Error fetching types mesures:", error);
      return [];
    }
  },

  async generateNumeroCommande(): Promise<string> {
    const today = new Date();
    const year = today.getFullYear().toString().slice(-2);
    const month = (today.getMonth() + 1).toString().padStart(2, "0");
    const day = today.getDate().toString().padStart(2, "0");
    
    const { data, error } = await supabase
      .from("commandes")
      .select("numero_commande")
      .like("numero_commande", `CMD${year}${month}${day}%`)
      .order("numero_commande", { ascending: false })
      .limit(1);

    if (error) throw error;

    let nextNumber = 1;
    if (data && data.length > 0) {
      const lastNumber = data[0].numero_commande.slice(-3);
      nextNumber = parseInt(lastNumber) + 1;
    }

    return `CMD${year}${month}${day}${nextNumber.toString().padStart(3, "0")}`;
  },

  async createCommande(commande: Omit<Commande, "id" | "numero_commande" | "created_at" | "updated_at">): Promise<Commande> {
    const numero_commande = await this.generateNumeroCommande();
    
    const { data, error } = await supabase
      .from("commandes")
      .insert([{ ...commande, numero_commande }])
      .select()
      .single();

    if (error) throw error;
    return data as Commande;
  },

  async getCommandes(): Promise<Commande[]> {
    try {
      const { data, error } = await supabase
        .from("commandes")
        .select(`
          *,
          client:clients(*),
          magasin:magasins(*),
          vendeur:utilisateurs(*)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      // Transform data to match Client interface
      const transformedData = data?.map(commande => ({
        ...commande,
        client: commande.client ? {
          ...commande.client,
          date_creation: commande.client.created_at,
          derniere_modification: commande.client.updated_at
        } : undefined
      }));
      
      return (transformedData as Commande[]) || [];
    } catch (error) {
      console.error("Error fetching commandes:", error);
      return [];
    }
  },

  async getCommande(id: string): Promise<Commande | null> {
    try {
      const { data, error } = await supabase
        .from("commandes")
        .select(`
          *,
          client:clients(*),
          magasin:magasins(*),
          vendeur:utilisateurs(*)
        `)
        .eq("id", id)
        .single();

      if (error) throw error;
      
      // Transform data to match Client interface
      const transformedData = {
        ...data,
        client: data.client ? {
          ...data.client,
          date_creation: data.client.created_at,
          derniere_modification: data.client.updated_at
        } : undefined
      };
      
      return transformedData as Commande;
    } catch (error) {
      console.error("Error fetching commande:", error);
      return null;
    }
  },

  async updateCommande(id: string, updates: Partial<Commande>): Promise<Commande> {
    const { data, error } = await supabase
      .from("commandes")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as Commande;
  },

  async addArticleToCommande(article: Omit<ArticleCommande, "id" | "created_at">): Promise<ArticleCommande> {
    try {
      const { data, error } = await supabase
        .from("articles_commandes")
        .insert([article])
        .select()
        .single();

      if (error) throw error;
      return data as ArticleCommande;
    } catch (error) {
      console.error("Error adding article to commande:", error);
      throw error;
    }
  },

  async addMesureToArticle(mesure: Omit<MesureClient, "id" | "created_at">): Promise<MesureClient> {
    try {
      const { data, error } = await supabase
        .from("mesures_clients")
        .insert([mesure])
        .select()
        .single();

      if (error) throw error;
      return data as MesureClient;
    } catch (error) {
      console.error("Error adding mesure to article:", error);
      throw error;
    }
  },

  async addPaiement(paiement: Omit<Paiement, "id" | "created_at">): Promise<Paiement> {
    const { data, error } = await supabase
      .from("paiements")
      .insert([paiement])
      .select()
      .single();

    if (error) throw error;
    return data as Paiement;
  },

  async getPaiements(commandeId: string): Promise<Paiement[]> {
    try {
      const { data, error } = await supabase
        .from("paiements")
        .select("*")
        .eq("commande_id", commandeId)
        .order("date_paiement", { ascending: false });

      if (error) throw error;
      return (data as Paiement[]) || [];
    } catch (error) {
      console.error("Error fetching paiements:", error);
      return [];
    }
  },

  async createTypeMesure(typeMesure: Omit<TypeMesure, "id" | "created_at">): Promise<TypeMesure> {
    const { data, error } = await supabase.from("types_mesures").insert([typeMesure]).select().single();
    if (error) throw error;
    return data as TypeMesure;
  },

  async updateTypeMesure(id: string, updates: Partial<TypeMesure>): Promise<TypeMesure> {
    const { data, error } = await supabase.from("types_mesures").update(updates).eq("id", id).select().single();
    if (error) throw error;
    return data as TypeMesure;
  }
};
