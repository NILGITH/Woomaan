
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      categories_matieres: {
        Row: {
          id: string
          nom: string
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          nom: string
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          nom?: string
          description?: string | null
          created_at?: string
        }
        Relationships: []
      }
      categories_produits: {
        Row: {
          id: string
          nom: string
          description: string | null
          image_url: string | null
          actif: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nom: string
          description?: string | null
          image_url?: string | null
          actif?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nom?: string
          description?: string | null
          image_url?: string | null
          actif?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      clients: {
        Row: {
          id: string
          nom: string
          prenom: string
          email: string | null
          telephone: string | null
          adresse: string | null
          date_naissance: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nom: string
          prenom: string
          email?: string | null
          telephone?: string | null
          adresse?: string | null
          date_naissance?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nom?: string
          prenom?: string
          email?: string | null
          telephone?: string | null
          adresse?: string | null
          date_naissance?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      commandes: {
        Row: {
          id: string
          numero_commande: string
          client_id: string
          magasin_id: string | null
          vendeur_id: string | null
          statut: string
          date_commande: string
          date_livraison_prevue: string | null
          date_livraison_reelle: string | null
          sous_total: number
          remise_pourcentage: number
          remise_montant: number
          total: number
          acompte: number
          reste_a_payer: number
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          numero_commande: string
          client_id: string
          magasin_id?: string | null
          vendeur_id?: string | null
          statut?: string
          date_commande: string
          date_livraison_prevue?: string | null
          date_livraison_reelle?: string | null
          sous_total?: number
          remise_pourcentage?: number
          remise_montant?: number
          total?: number
          acompte?: number
          reste_a_payer?: number
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          numero_commande?: string
          client_id?: string
          magasin_id?: string | null
          vendeur_id?: string | null
          statut?: string
          date_commande?: string
          date_livraison_prevue?: string | null
          date_livraison_reelle?: string | null
          sous_total?: number
          remise_pourcentage?: number
          remise_montant?: number
          total?: number
          acompte?: number
          reste_a_payer?: number
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "commandes_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commandes_magasin_id_fkey"
            columns: ["magasin_id"]
            isOneToOne: false
            referencedRelation: "magasins"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commandes_vendeur_id_fkey"
            columns: ["vendeur_id"]
            isOneToOne: false
            referencedRelation: "utilisateurs"
            referencedColumns: ["id"]
          }
        ]
      }
      articles_commandes: {
        Row: {
          id: string
          commande_id: string
          produit_id: string
          quantite: number
          prix_unitaire: number
          prix_total: number
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          commande_id: string
          produit_id: string
          quantite: number
          prix_unitaire: number
          prix_total: number
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          commande_id?: string
          produit_id?: string
          quantite?: number
          prix_unitaire?: number
          prix_total?: number
          notes?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "articles_commandes_commande_id_fkey"
            columns: ["commande_id"]
            isOneToOne: false
            referencedRelation: "commandes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "articles_commandes_produit_id_fkey"
            columns: ["produit_id"]
            isOneToOne: false
            referencedRelation: "produits"
            referencedColumns: ["id"]
          }
        ]
      }
      mesures_clients: {
        Row: {
          id: string
          article_commande_id: string
          type_mesure_id: string
          valeur: number
          notes: string | null
          prise_par: string | null
          created_at: string
        }
        Insert: {
          id?: string
          article_commande_id: string
          type_mesure_id: string
          valeur: number
          notes?: string | null
          prise_par?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          article_commande_id?: string
          type_mesure_id?: string
          valeur?: number
          notes?: string | null
          prise_par?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "mesures_clients_article_commande_id_fkey"
            columns: ["article_commande_id"]
            isOneToOne: false
            referencedRelation: "articles_commandes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mesures_clients_type_mesure_id_fkey"
            columns: ["type_mesure_id"]
            isOneToOne: false
            referencedRelation: "types_mesures"
            referencedColumns: ["id"]
          }
        ]
      }
      types_mesures: {
        Row: {
          id: string
          nom: string
          description: string | null
          unite: string
          categorie: string
          obligatoire: boolean
          ordre_affichage: number
          created_at: string
        }
        Insert: {
          id?: string
          nom: string
          description?: string | null
          unite: string
          categorie: string
          obligatoire?: boolean
          ordre_affichage?: number
          created_at?: string
        }
        Update: {
          id?: string
          nom?: string
          description?: string | null
          unite?: string
          categorie?: string
          obligatoire?: boolean
          ordre_affichage?: number
          created_at?: string
        }
        Relationships: []
      }
      produits: {
        Row: {
          id: string
          nom: string
          description: string | null
          prix_base: number
          categorie_id: string | null
          image_url: string | null
          temps_confection: number | null
          difficulte: string
          actif: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nom: string
          description?: string | null
          prix_base: number
          categorie_id?: string | null
          image_url?: string | null
          temps_confection?: number | null
          difficulte?: string
          actif?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nom?: string
          description?: string | null
          prix_base?: number
          categorie_id?: string | null
          image_url?: string | null
          temps_confection?: number | null
          difficulte?: string
          actif?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "produits_categorie_id_fkey"
            columns: ["categorie_id"]
            isOneToOne: false
            referencedRelation: "categories_produits"
            referencedColumns: ["id"]
          }
        ]
      }
      paiements: {
        Row: {
          id: string
          commande_id: string
          montant: number
          mode_paiement: string
          reference_transaction: string | null
          date_paiement: string
          notes: string | null
          created_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          commande_id: string
          montant: number
          mode_paiement: string
          reference_transaction?: string | null
          date_paiement: string
          notes?: string | null
          created_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          commande_id?: string
          montant?: number
          mode_paiement?: string
          reference_transaction?: string | null
          date_paiement?: string
          notes?: string | null
          created_by?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "paiements_commande_id_fkey"
            columns: ["commande_id"]
            isOneToOne: false
            referencedRelation: "commandes"
            referencedColumns: ["id"]
          }
        ]
      }
      magasins: {
        Row: {
          id: string
          nom: string
          adresse: string | null
          telephone: string | null
          responsable: string | null
          type_magasin: string
          created_at: string
        }
        Insert: {
          id?: string
          nom: string
          adresse?: string | null
          telephone?: string | null
          responsable?: string | null
          type_magasin: string
          created_at?: string
        }
        Update: {
          id?: string
          nom?: string
          adresse?: string | null
          telephone?: string | null
          responsable?: string | null
          type_magasin?: string
          created_at?: string
        }
        Relationships: []
      }
      types_tenues: {
        Row: {
          id: string
          nom: string
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          nom: string
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          nom?: string
          description?: string | null
          created_at?: string
        }
        Relationships: []
      }
      utilisateurs: {
        Row: {
          id: string
          email: string
          mot_de_passe: string
          nom: string
          prenom: string
          role: string
          magasin_id: string | null
          actif: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          mot_de_passe: string
          nom: string
          prenom: string
          role?: string
          magasin_id?: string | null
          actif?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          mot_de_passe?: string
          nom?: string
          prenom?: string
          role?: string
          magasin_id?: string | null
          actif?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "utilisateurs_magasin_id_fkey"
            columns: ["magasin_id"]
            isOneToOne: false
            referencedRelation: "magasins"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "utilisateurs_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      collections: {
        Row: {
          active: boolean
          articles_ids: string[] | null
          couleurs_dominantes: string[] | null
          created_at: string
          date_debut: string | null
          date_fin: string | null
          description: string | null
          histoire: string | null
          id: string
          image_url: string | null
          inspiration: string | null
          nom: string
          periode: string | null
          prix_max: number | null
          prix_min: number | null
          saison: string | null
          tissus_recommandes: string[] | null
          type_evenement: string | null
          updated_at: string
        }
        Insert: {
          active?: boolean
          articles_ids?: string[] | null
          couleurs_dominantes?: string[] | null
          created_at?: string
          date_debut?: string | null
          date_fin?: string | null
          description?: string | null
          histoire?: string | null
          id?: string
          image_url?: string | null
          inspiration?: string | null
          nom: string
          periode?: string | null
          prix_max?: number | null
          prix_min?: number | null
          saison?: string | null
          tissus_recommandes?: string[] | null
          type_evenement?: string | null
          updated_at?: string
        }
        Update: {
          active?: boolean
          articles_ids?: string[] | null
          couleurs_dominantes?: string[] | null
          created_at?: string
          date_debut?: string | null
          date_fin?: string | null
          description?: string | null
          histoire?: string | null
          id?: string
          image_url?: string | null
          inspiration?: string | null
          nom?: string
          periode?: string | null
          prix_max?: number | null
          prix_min?: number | null
          saison?: string | null
          tissus_recommandes?: string[] | null
          type_evenement?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      histoires_collection: {
        Row: {
          auteur: string | null
          collection_id: string
          contenu: string
          date_creation: string
          id: string
          images: string[] | null
          tags: string[] | null
          titre: string
        }
        Insert: {
          auteur?: string | null
          collection_id: string
          contenu: string
          date_creation?: string
          id?: string
          images?: string[] | null
          tags?: string[] | null
          titre: string
        }
        Update: {
          auteur?: string | null
          collection_id?: string
          contenu?: string
          date_creation?: string
          id?: string
          images?: string[] | null
          tags?: string[] | null
          titre?: string
        }
        Relationships: [
          {
            foreignKeyName: "histoires_collection_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "collections"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: { [key: string]: never }
    Functions: { [key: string]: never }
    Enums: { [key: string]: never }
    CompositeTypes: { [key: string]: never }
  }
}
