
import { Database } from "@/integrations/supabase/types";

export type Utilisateur = Omit<Database["public"]["Tables"]["utilisateurs"]["Row"], "mot_de_passe">;
export type Magasin = Database["public"]["Tables"]["magasins"]["Row"];
export type Client = Database["public"]["Tables"]["clients"]["Row"];
export type Commande = Database["public"]["Tables"]["commandes"]["Row"];
export type ArticleCommande = Database["public"]["Tables"]["articles_commandes"]["Row"];
export type Produit = Database["public"]["Tables"]["produits"]["Row"];
export type CategorieProduit = Database["public"]["Tables"]["categories_produits"]["Row"];
export type TypeMesure = Database["public"]["Tables"]["types_mesures"]["Row"];
export type MesureClient = Database["public"]["Tables"]["mesures_clients"]["Row"];
export type Paiement = Database["public"]["Tables"]["paiements"]["Row"];
export type TypeTenue = Database["public"]["Tables"]["types_tenues"]["Row"];
export type CategorieMatiere = Database["public"]["Tables"]["categories_matieres"]["Row"];
