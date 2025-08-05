import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type Collection = Database["public"]["Tables"]["collections"]["Row"];
export type CollectionInsert = Database["public"]["Tables"]["collections"]["Insert"];
export type CollectionUpdate = Database["public"]["Tables"]["collections"]["Update"];

export const collectionsService = {
  async getCollections(): Promise<Collection[]> {
    if (!supabase) {
      return this.getMockCollections();
    }

    const { data, error } = await supabase
      .from("collections")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching collections:", error);
      return this.getMockCollections();
    }

    return data || this.getMockCollections();
  },

  async getCollectionById(id: string): Promise<Collection | null> {
    if (!supabase) {
      const mockCollections = this.getMockCollections();
      return mockCollections.find(c => c.id === id) || null;
    }

    const { data, error } = await supabase
      .from("collections")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching collection:", error);
      return null;
    }

    return data;
  },

  async createCollection(collection: CollectionInsert): Promise<Collection | null> {
    if (!supabase) {
      console.warn("Supabase not connected - cannot create collection");
      return null;
    }

    const { data, error } = await supabase
      .from("collections")
      .insert(collection)
      .select()
      .single();

    if (error) {
      console.error("Error creating collection:", error);
      throw error;
    }

    return data;
  },

  async updateCollection(id: string, updates: CollectionUpdate): Promise<Collection | null> {
    if (!supabase) {
      console.warn("Supabase not connected - cannot update collection");
      return null;
    }

    const { data, error } = await supabase
      .from("collections")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating collection:", error);
      throw error;
    }

    return data;
  },

  async deleteCollection(id: string): Promise<boolean> {
    if (!supabase) {
      console.warn("Supabase not connected - cannot delete collection");
      return false;
    }

    const { error } = await supabase
      .from("collections")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting collection:", error);
      throw error;
    }

    return true;
  },

  getMockCollections(): Collection[] {
    const now = new Date().toISOString();
    
    return [
      {
        id: "col1",
        nom: "Collection Harmattan Élégance",
        description: "Collection spéciale pour la saison sèche avec des tissus légers et des couleurs chaudes",
        saison: "harmattan" as const,
        periode: "decembre" as const,
        type_evenement: "nouvel_an" as const,
        couleurs_dominantes: ["#FFD700", "#FF6B35", "#8B4513"],
        tissus_recommandes: ["Wax léger", "Coton", "Lin africain"],
        prix_min: 25000,
        prix_max: 85000,
        image_url: "https://images.pexels.com/photos/1043473/pexels-photo-1043473.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
        active: true,
        date_debut: "2024-12-01",
        date_fin: "2025-02-28",
        histoire: "Inspirée par les vents chauds et secs de l'Harmattan, cette collection célèbre la beauté de la saison sèche ivoirienne. Les motifs rappellent les dunes du Sahel et les couchers de soleil dorés.",
        inspiration: "Les paysages du nord de la Côte d'Ivoire pendant l'Harmattan",
        articles_ids: ["art1", "art2", "art6"],
        created_at: now,
        updated_at: now,
      },
      {
        id: "col2",
        nom: "Collection Pluies Tropicales",
        description: "Vêtements adaptés à la saison des pluies avec des couleurs vives et des tissus résistants",
        saison: "saison_pluies" as const,
        periode: "juin" as const,
        type_evenement: "fete_nationale" as const,
        couleurs_dominantes: ["#228B22", "#4169E1", "#FF4500"],
        tissus_recommandes: ["Wax imperméable", "Coton épais", "Tissu traditionnel traité"],
        prix_min: 30000,
        prix_max: 75000,
        image_url: "https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
        active: true,
        date_debut: "2024-05-01",
        date_fin: "2024-09-30",
        histoire: "Cette collection rend hommage à la générosité de la saison des pluies. Les motifs évoquent la végétation luxuriante et les rivières en crue qui donnent vie à notre belle Côte d'Ivoire.",
        inspiration: "La forêt tropicale ivoirienne pendant la saison des pluies",
        articles_ids: ["art3", "art4", "art5"],
        created_at: now,
        updated_at: now,
      },
      {
        id: "col3",
        nom: "Collection Saison Sèche Moderne",
        description: "Designs contemporains pour la saison sèche avec des coupes modernes",
        saison: "saison_seche" as const,
        periode: "janvier" as const,
        type_evenement: "mariage" as const,
        couleurs_dominantes: ["#E6E6FA", "#FFB6C1", "#F0E68C"],
        tissus_recommandes: ["Soie africaine", "Coton bio", "Lin premium"],
        prix_min: 40000,
        prix_max: 120000,
        image_url: "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
        active: true,
        date_debut: "2024-01-01",
        date_fin: "2024-04-30",
        histoire: "Une fusion entre tradition et modernité, cette collection s'inspire des tendances contemporaines tout en respectant l'héritage culturel ivoirien.",
        inspiration: "L'art moderne ivoirien et les tendances internationales",
        articles_ids: ["art7", "art8", "art9"],
        created_at: now,
        updated_at: now,
      },
      {
        id: "col4",
        nom: "Collection Toute Année Classique",
        description: "Pièces intemporelles adaptées à toutes les saisons",
        saison: "toute_annee" as const,
        periode: "toute_annee" as const,
        type_evenement: "quotidien" as const,
        couleurs_dominantes: ["#000000", "#FFFFFF", "#8B4513"],
        tissus_recommandes: ["Wax classique", "Coton standard", "Mélange traditionnel"],
        prix_min: 20000,
        prix_max: 60000,
        image_url: "https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
        active: true,
        date_debut: "2024-01-01",
        date_fin: "2024-12-31",
        histoire: "Des pièces essentielles qui traversent les saisons et les tendances. Cette collection représente l'élégance intemporelle de la mode africaine.",
        inspiration: "Les classiques de la mode africaine traditionnelle",
        articles_ids: ["art10", "art11", "art12"],
        created_at: now,
        updated_at: now,
      }
    ];
  }
};

export default collectionsService;
