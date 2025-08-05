
export interface Taille {
  id: string;
  nom: string;
  code: string;
  description?: string;
  categorie: "homme" | "femme" | "enfant" | "unisexe";
  ordre: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Couleur {
  id: string;
  nom: string;
  code_hex: string;
  code_rgb?: string;
  description?: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DeclinaisonArticle {
  id: string;
  article_id: string;
  taille_id?: string;
  couleur_id?: string;
  sku: string;
  prix_vente?: number;
  prix_achat?: number;
  quantite_stock: number;
  quantite_min: number;
  code_barre?: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ArticleAvecDeclinaisons {
  id: string;
  nom: string;
  description?: string;
  categorie: string;
  prix_base: number;
  declinaisons: DeclinaisonArticle[];
  created_at: string;
  updated_at: string;
}

export const parametresService = {
  async getTailles(): Promise<Taille[]> {
    return [
      {
        id: "t1",
        nom: "Extra Small",
        code: "XS",
        categorie: "unisexe",
        ordre: 1,
        active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "t2",
        nom: "Small",
        code: "S",
        categorie: "unisexe",
        ordre: 2,
        active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "t3",
        nom: "Medium",
        code: "M",
        categorie: "unisexe",
        ordre: 3,
        active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "t4",
        nom: "Large",
        code: "L",
        categorie: "unisexe",
        ordre: 4,
        active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "t5",
        nom: "Extra Large",
        code: "XL",
        categorie: "unisexe",
        ordre: 5,
        active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "t6",
        nom: "Double Extra Large",
        code: "XXL",
        categorie: "unisexe",
        ordre: 6,
        active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];
  },

  async getCouleurs(): Promise<Couleur[]> {
    return [
      {
        id: "c1",
        nom: "Rouge",
        code_hex: "#FF0000",
        code_rgb: "255,0,0",
        active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "c2",
        nom: "Bleu",
        code_hex: "#0000FF",
        code_rgb: "0,0,255",
        active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "c3",
        nom: "Vert",
        code_hex: "#00FF00",
        code_rgb: "0,255,0",
        active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "c4",
        nom: "Jaune",
        code_hex: "#FFFF00",
        code_rgb: "255,255,0",
        active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "c5",
        nom: "Noir",
        code_hex: "#000000",
        code_rgb: "0,0,0",
        active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "c6",
        nom: "Blanc",
        code_hex: "#FFFFFF",
        code_rgb: "255,255,255",
        active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "c7",
        nom: "Orange",
        code_hex: "#FFA500",
        code_rgb: "255,165,0",
        active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "c8",
        nom: "Violet",
        code_hex: "#800080",
        code_rgb: "128,0,128",
        active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];
  },

  async createTaille(data: Omit<Taille, "id" | "created_at" | "updated_at">): Promise<Taille> {
    const nouvelleTaille: Taille = {
      id: Date.now().toString(),
      ...data,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    return nouvelleTaille;
  },

  async updateTaille(id: string, data: Partial<Taille>): Promise<Taille> {
    const taille = await this.getTailleById(id);
    if (!taille) {
      throw new Error("Taille non trouvée");
    }

    const tailleModifiee: Taille = {
      ...taille,
      ...data,
      updated_at: new Date().toISOString(),
    };
    return tailleModifiee;
  },

  async deleteTaille(id: string): Promise<void> {
    console.log(`Suppression de la taille ${id}`);
  },

  async getTailleById(id: string): Promise<Taille | null> {
    const tailles = await this.getTailles();
    return tailles.find(t => t.id === id) || null;
  },

  async createCouleur(data: Omit<Couleur, "id" | "created_at" | "updated_at">): Promise<Couleur> {
    const nouvelleCouleur: Couleur = {
      id: Date.now().toString(),
      ...data,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    return nouvelleCouleur;
  },

  async updateCouleur(id: string, data: Partial<Couleur>): Promise<Couleur> {
    const couleur = await this.getCouleurById(id);
    if (!couleur) {
      throw new Error("Couleur non trouvée");
    }

    const couleurModifiee: Couleur = {
      ...couleur,
      ...data,
      updated_at: new Date().toISOString(),
    };
    return couleurModifiee;
  },

  async deleteCouleur(id: string): Promise<void> {
    console.log(`Suppression de la couleur ${id}`);
  },

  async getCouleurById(id: string): Promise<Couleur | null> {
    const couleurs = await this.getCouleurs();
    return couleurs.find(c => c.id === id) || null;
  },

  async getDeclinaisonsArticle(articleId: string): Promise<DeclinaisonArticle[]> {
    return [
      {
        id: "d1",
        article_id: articleId,
        taille_id: "t3",
        couleur_id: "c1",
        sku: "BOB-M-RED-001",
        prix_vente: 25000,
        prix_achat: 18000,
        quantite_stock: 5,
        quantite_min: 2,
        code_barre: "1234567890123",
        active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "d2",
        article_id: articleId,
        taille_id: "t4",
        couleur_id: "c2",
        sku: "BOB-L-BLUE-001",
        prix_vente: 25000,
        prix_achat: 18000,
        quantite_stock: 3,
        quantite_min: 2,
        code_barre: "1234567890124",
        active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];
  },

  async createDeclinaison(data: Omit<DeclinaisonArticle, "id" | "created_at" | "updated_at">): Promise<DeclinaisonArticle> {
    const nouvelleDeclinaison: DeclinaisonArticle = {
      id: Date.now().toString(),
      ...data,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    return nouvelleDeclinaison;
  },

  async updateDeclinaison(id: string, data: Partial<DeclinaisonArticle>): Promise<DeclinaisonArticle> {
    const declinaison = await this.getDeclinaisonById(id);
    if (!declinaison) {
      throw new Error("Déclinaison non trouvée");
    }

    const declinaisonModifiee: DeclinaisonArticle = {
      ...declinaison,
      ...data,
      updated_at: new Date().toISOString(),
    };
    return declinaisonModifiee;
  },

  async deleteDeclinaison(id: string): Promise<void> {
    console.log(`Suppression de la déclinaison ${id}`);
  },

  async getDeclinaisonById(id: string): Promise<DeclinaisonArticle | null> {
    const declinaisons = await this.getDeclinaisonsArticle("1");
    return declinaisons.find(d => d.id === id) || null;
  },

  async generateSKU(articleNom: string, tailleCode?: string, couleurNom?: string): Promise<string> {
    const articleCode = articleNom.substring(0, 3).toUpperCase();
    const taille = tailleCode || "UNI";
    const couleur = couleurNom ? couleurNom.substring(0, 3).toUpperCase() : "UNI";
    const timestamp = Date.now().toString().slice(-3);
    
    return `${articleCode}-${taille}-${couleur}-${timestamp}`;
  },
};

export default parametresService;
