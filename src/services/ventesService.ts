import { DeclinaisonArticle } from "./parametresService";

export interface ArticleVente {
  id: string;
  nom: string;
  description?: string;
  categorie: "vetement_homme" | "vetement_femme" | "accessoire" | "chaussure";
  prix_base: number;
  code_barre?: string;
  image_url?: string;
  active: boolean;
  collection_id?: string;
  declinaisons: DeclinaisonArticle[];
  created_at: string;
  updated_at: string;
}

export interface LigneVente {
  id: string;
  article_id: string;
  declinaison_id?: string;
  nom_article: string;
  taille?: string;
  couleur?: string;
  quantite: number;
  prix_unitaire: number;
  prix_total: number;
  remise?: number;
}

export interface Vente {
  id: string;
  numero_facture: string;
  client_id?: string;
  client_nom?: string;
  client_telephone?: string;
  vendeur_id: string;
  vendeur_nom: string;
  lignes: LigneVente[];
  sous_total: number;
  remise_globale?: number;
  tva?: number;
  total: number;
  mode_paiement: "especes" | "carte" | "mobile_money" | "cheque" | "credit";
  statut: "en_cours" | "validee" | "annulee" | "remboursee";
  date_vente: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface PanierItem {
  article: ArticleVente;
  declinaison?: DeclinaisonArticle;
  quantite: number;
  prix_unitaire: number;
}

export const ventesService = {
  async getArticlesVente(): Promise<ArticleVente[]> {
    // Mock data for now, but we keep the service signature ready for DB integration
    return [
      {
        id: "art1",
        nom: "Kaftan Traditionnel Homme",
        description: "Kaftan élégant en wax premium avec broderies artisanales",
        categorie: "vetement_homme",
        prix_base: 35000,
        code_barre: "KAF001",
        active: true,
        collection_id: "col1",
        declinaisons: [
          {
            id: "d1",
            article_id: "art1",
            taille_id: "t3",
            couleur_id: "c1",
            sku: "KAF-M-RED-001",
            prix_vente: 35000,
            prix_achat: 25000,
            quantite_stock: 8,
            quantite_min: 3,
            code_barre: "1234567890123",
            active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: "d2",
            article_id: "art1",
            taille_id: "t4",
            couleur_id: "c2",
            sku: "KAF-L-BLUE-001",
            prix_vente: 35000,
            prix_achat: 25000,
            quantite_stock: 5,
            quantite_min: 2,
            code_barre: "1234567890124",
            active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "art2",
        nom: "Boubou Grand Boubou",
        description: "Boubou traditionnel ivoirien en tissu local premium",
        categorie: "vetement_homme",
        prix_base: 45000,
        code_barre: "BOU001",
        active: true,
        collection_id: "col1",
        declinaisons: [
          {
            id: "d3",
            article_id: "art2",
            taille_id: "t3",
            couleur_id: "c3",
            sku: "BOU-M-GREEN-001",
            prix_vente: 45000,
            prix_achat: 32000,
            quantite_stock: 6,
            quantite_min: 2,
            code_barre: "1234567890125",
            active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: "d4",
            article_id: "art2",
            taille_id: "t4",
            couleur_id: "c4",
            sku: "BOU-L-YELLOW-001",
            prix_vente: 45000,
            prix_achat: 32000,
            quantite_stock: 4,
            quantite_min: 2,
            code_barre: "1234567890126",
            active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "art3",
        nom: "Robe en Pagne Traditionnel",
        description: "Robe élégante en pagne ivoirien authentique",
        categorie: "vetement_femme",
        prix_base: 28000,
        code_barre: "ROB001",
        active: true,
        collection_id: "col2",
        declinaisons: [
          {
            id: "d5",
            article_id: "art3",
            taille_id: "t2",
            couleur_id: "c5",
            sku: "ROB-S-BLACK-001",
            prix_vente: 28000,
            prix_achat: 20000,
            quantite_stock: 7,
            quantite_min: 3,
            code_barre: "1234567890127",
            active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: "d6",
            article_id: "art3",
            taille_id: "t3",
            couleur_id: "c6",
            sku: "ROB-M-WHITE-001",
            prix_vente: 28000,
            prix_achat: 20000,
            quantite_stock: 9,
            quantite_min: 3,
            code_barre: "1234567890128",
            active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "art4",
        nom: "Chemise Traditionnelle Wax",
        description: "Chemise moderne en tissu wax pour homme et femme",
        categorie: "vetement_homme",
        prix_base: 18000,
        code_barre: "CHE001",
        active: true,
        collection_id: "col2",
        declinaisons: [
          {
            id: "d7",
            article_id: "art4",
            taille_id: "t3",
            couleur_id: "c7",
            sku: "CHE-M-ORANGE-001",
            prix_vente: 18000,
            prix_achat: 13000,
            quantite_stock: 12,
            quantite_min: 4,
            code_barre: "1234567890129",
            active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: "d8",
            article_id: "art4",
            taille_id: "t4",
            couleur_id: "c8",
            sku: "CHE-L-VIOLET-001",
            prix_vente: 18000,
            prix_achat: 13000,
            quantite_stock: 8,
            quantite_min: 3,
            code_barre: "1234567890130",
            active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "art5",
        nom: "Pantalon Wax Moderne",
        description: "Pantalon confortable en tissu wax, coupe moderne",
        categorie: "vetement_homme",
        prix_base: 22000,
        code_barre: "PAN001",
        active: true,
        collection_id: "col2",
        declinaisons: [
          {
            id: "d9",
            article_id: "art5",
            taille_id: "t3",
            couleur_id: "c1",
            sku: "PAN-M-RED-001",
            prix_vente: 22000,
            prix_achat: 16000,
            quantite_stock: 10,
            quantite_min: 4,
            code_barre: "1234567890131",
            active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: "d10",
            article_id: "art5",
            taille_id: "t4",
            couleur_id: "c2",
            sku: "PAN-L-BLUE-001",
            prix_vente: 22000,
            prix_achat: 16000,
            quantite_stock: 6,
            quantite_min: 3,
            code_barre: "1234567890132",
            active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "art6",
        nom: "Ensemble Complet Cérémonie",
        description: "Ensemble coordonné pour occasions spéciales et cérémonies",
        categorie: "vetement_homme",
        prix_base: 55000,
        code_barre: "ENS001",
        active: true,
        collection_id: "col3",
        declinaisons: [
          {
            id: "d11",
            article_id: "art6",
            taille_id: "t3",
            couleur_id: "c3",
            sku: "ENS-M-GREEN-001",
            prix_vente: 55000,
            prix_achat: 40000,
            quantite_stock: 4,
            quantite_min: 2,
            code_barre: "1234567890133",
            active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: "d12",
            article_id: "art6",
            taille_id: "t4",
            couleur_id: "c4",
            sku: "ENS-L-YELLOW-001",
            prix_vente: 55000,
            prix_achat: 40000,
            quantite_stock: 3,
            quantite_min: 1,
            code_barre: "1234567890134",
            active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];
  },

  async getVentes(): Promise<Vente[]> {
    return [
      {
        id: "v1",
        numero_facture: "FAC-2025-001",
        client_nom: "Jean Kouassi",
        client_telephone: "+225 07 12 34 56 78",
        vendeur_id: "emp1",
        vendeur_nom: "Marie Vendeuse",
        lignes: [
          {
            id: "lv1",
            article_id: "art1",
            declinaison_id: "d1",
            nom_article: "Boubou Traditionnel",
            taille: "M",
            couleur: "Rouge",
            quantite: 1,
            prix_unitaire: 25000,
            prix_total: 25000,
          },
        ],
        sous_total: 25000,
        total: 25000,
        mode_paiement: "especes",
        statut: "validee",
        date_vente: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];
  },

  async createVente(venteData: Partial<Vente>): Promise<Vente> {
    const numeroFacture = `FAC-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`;
    
    const newVente: Vente = {
      id: Date.now().toString(),
      numero_facture: numeroFacture,
      vendeur_id: "emp1",
      vendeur_nom: "Vendeur CISS",
      lignes: venteData.lignes || [],
      sous_total: venteData.sous_total || 0,
      total: venteData.total || 0,
      mode_paiement: venteData.mode_paiement || "especes",
      statut: "validee",
      date_vente: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...venteData,
    };

    return newVente;
  },

  async searchArticles(searchTerm: string): Promise<ArticleVente[]> {
    const articles = await this.getArticlesVente();
    return articles.filter(article =>
      article.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.code_barre?.includes(searchTerm) ||
      article.declinaisons.some(d => d.code_barre?.includes(searchTerm) || d.sku.includes(searchTerm))
    );
  },

  async getArticleByCodeBarre(codeBarre: string): Promise<{ article: ArticleVente; declinaison?: DeclinaisonArticle } | null> {
    const articles = await this.getArticlesVente();
    
    for (const article of articles) {
      if (article.code_barre === codeBarre) {
        return { article };
      }
      
      const declinaison = article.declinaisons.find(d => d.code_barre === codeBarre);
      if (declinaison) {
        return { article, declinaison };
      }
    }
    
    return null;
  },

  async calculerTotal(lignes: LigneVente[], remiseGlobale?: number): Promise<{ sousTotal: number; total: number }> {
    const sousTotal = lignes.reduce((sum, ligne) => sum + ligne.prix_total, 0);
    const remise = remiseGlobale || 0;
    const total = sousTotal - (sousTotal * remise / 100);
    
    return { sousTotal, total };
  },

  async verifierStock(articleId: string, declinaisonId?: string, quantite: number = 1): Promise<boolean> {
    const articles = await this.getArticlesVente();
    const article = articles.find(a => a.id === articleId);
    
    if (!article) return false;
    
    if (declinaisonId) {
      const declinaison = article.declinaisons.find(d => d.id === declinaisonId);
      return declinaison ? declinaison.quantite_stock >= quantite : false;
    }
    
    // Si pas de déclinaison spécifique, vérifier le stock total
    const stockTotal = article.declinaisons.reduce((sum, d) => sum + d.quantite_stock, 0);
    return stockTotal >= quantite;
  },

  async getDeclinaisonsDisponibles(articleId: string): Promise<DeclinaisonArticle[]> {
    const articles = await this.getArticlesVente();
    const article = articles.find(a => a.id === articleId);
    
    if (!article) return [];
    
    return article.declinaisons.filter(d => d.active && d.quantite_stock > 0);
  },

  async getStatistiquesVentes() {
    const ventes = await this.getVentes();
    const ventesValidees = ventes.filter(v => v.statut === "validee");
    
    const chiffreAffaires = ventesValidees.reduce((sum, v) => sum + v.total, 0);
    const nombreVentes = ventesValidees.length;
    const panierMoyen = nombreVentes > 0 ? chiffreAffaires / nombreVentes : 0;
    
    return {
      chiffreAffaires,
      nombreVentes,
      panierMoyen,
      ventesAujourdhui: ventesValidees.filter(v => 
        new Date(v.date_vente).toDateString() === new Date().toDateString()
      ).length,
    };
  },

  async genererRecu(venteId: string): Promise<string> {
    const ventes = await this.getVentes();
    const vente = ventes.find(v => v.id === venteId);
    
    if (!vente) throw new Error("Vente non trouvée");
    
    return `
      CISS ST MOISE - REÇU DE CAISSE
      ================================
      
      Facture N°: ${vente.numero_facture}
      Date: ${new Date(vente.date_vente).toLocaleDateString("fr-FR")}
      Vendeur: ${vente.vendeur_nom}
      ${vente.client_nom ? `Client: ${vente.client_nom}` : ""}
      
      ARTICLES:
      ${vente.lignes.map(ligne => 
        `${ligne.nom_article} ${ligne.taille ? `(${ligne.taille})` : ""} ${ligne.couleur ? `- ${ligne.couleur}` : ""}
         Qté: ${ligne.quantite} x ${ligne.prix_unitaire.toLocaleString()} FCFA = ${ligne.prix_total.toLocaleString()} FCFA`
      ).join("\n")}
      
      --------------------------------
      Sous-total: ${vente.sous_total.toLocaleString()} FCFA
      ${vente.remise_globale ? `Remise: ${vente.remise_globale}%` : ""}
      TOTAL: ${vente.total.toLocaleString()} FCFA
      
      Mode de paiement: ${vente.mode_paiement}
      
      Merci de votre visite !
    `;
  },
};

export default ventesService;
