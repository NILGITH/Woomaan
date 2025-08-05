
export interface TacheProduction {
  id: string;
  nom: string;
  description?: string;
  ordre: number;
  duree_estimee: number; // en minutes
  competences_requises?: string[];
  outils_requis?: string[];
  statut: "en_attente" | "en_cours" | "terminee" | "suspendue";
  created_at: string;
  updated_at: string;
}

export interface ProcessusProduction {
  id: string;
  nom: string;
  description?: string;
  type_vetement: string;
  taches: TacheProduction[];
  duree_totale_estimee: number;
  created_at: string;
  updated_at: string;
}

export interface OrdreProduction {
  id: string;
  numero_ordre: string;
  client_id: string;
  client_nom?: string;
  processus_id: string;
  processus_nom?: string;
  quantite: number;
  date_debut?: string;
  date_fin_prevue?: string;
  date_fin_reelle?: string;
  statut: "planifie" | "en_cours" | "termine" | "annule";
  priorite: "basse" | "normale" | "haute" | "urgente";
  notes?: string;
  taches_progression: TacheProgression[];
  created_at: string;
  updated_at: string;
}

export interface TacheProgression {
  id: string;
  ordre_production_id: string;
  tache_id: string;
  tache_nom: string;
  employe_id?: string;
  employe_nom?: string;
  date_debut?: string;
  date_fin?: string;
  duree_reelle?: number;
  statut: "en_attente" | "en_cours" | "terminee" | "suspendue";
  notes?: string;
  qualite_controle?: "conforme" | "non_conforme" | "a_reprendre";
  created_at: string;
  updated_at: string;
}

export interface HistoriqueProduction {
  id: string;
  ordre_production_id: string;
  tache_id?: string;
  action: "creation" | "demarrage" | "pause" | "reprise" | "completion" | "modification" | "annulation";
  description: string;
  employe_id?: string;
  employe_nom?: string;
  date_action: string;
  details?: Record<string, unknown>;
}

export const productionService = {
  async getTachesProduction(): Promise<TacheProduction[]> {
    return [
      {
        id: "t1",
        nom: "Prise de mesures",
        description: "Prendre les mesures du client selon le modèle",
        ordre: 1,
        duree_estimee: 30,
        competences_requises: ["mesure", "precision"],
        statut: "en_attente",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "t2",
        nom: "Découpe du tissu",
        description: "Découper le tissu selon le patron",
        ordre: 2,
        duree_estimee: 60,
        competences_requises: ["decoupe", "patron"],
        outils_requis: ["ciseaux", "patron"],
        statut: "en_attente",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "t3",
        nom: "Assemblage",
        description: "Assembler les pièces du vêtement",
        ordre: 3,
        duree_estimee: 120,
        competences_requises: ["couture", "assemblage"],
        outils_requis: ["machine_coudre", "fil"],
        statut: "en_attente",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "t4",
        nom: "Finitions",
        description: "Réaliser les finitions (ourlets, boutons, etc.)",
        ordre: 4,
        duree_estimee: 90,
        competences_requises: ["finition", "detail"],
        statut: "en_attente",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "t5",
        nom: "Contrôle qualité",
        description: "Vérifier la qualité du vêtement fini",
        ordre: 5,
        duree_estimee: 15,
        competences_requises: ["controle_qualite"],
        statut: "en_attente",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];
  },

  async getProcessusProduction(): Promise<ProcessusProduction[]> {
    const taches = await this.getTachesProduction();
    return [
      {
        id: "p1",
        nom: "Confection Kaftan Traditionnel",
        description: "Processus complet pour la confection d'un kaftan traditionnel avec broderies",
        type_vetement: "kaftan",
        taches: taches,
        duree_totale_estimee: 315,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "p2",
        nom: "Confection Boubou Grand Boubou",
        description: "Processus complet pour la confection d'un boubou traditionnel ivoirien",
        type_vetement: "boubou",
        taches: taches,
        duree_totale_estimee: 360,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "p3",
        nom: "Confection Robe en Pagne",
        description: "Processus complet pour la confection d'une robe en pagne traditionnel",
        type_vetement: "robe_pagne",
        taches: taches,
        duree_totale_estimee: 280,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "p4",
        nom: "Confection Chemise Wax",
        description: "Processus pour la confection d'une chemise en tissu wax",
        type_vetement: "chemise_wax",
        taches: taches.slice(0, 4), // Moins d'étapes pour une chemise
        duree_totale_estimee: 180,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "p5",
        nom: "Confection Pantalon Wax",
        description: "Processus pour la confection d'un pantalon en tissu wax",
        type_vetement: "pantalon_wax",
        taches: taches.slice(0, 4),
        duree_totale_estimee: 200,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "p6",
        nom: "Confection Ensemble Complet",
        description: "Processus complet pour un ensemble coordonné (haut + bas)",
        type_vetement: "ensemble_complet",
        taches: [
          ...taches,
          {
            id: "t6",
            nom: "Coordination des pièces",
            description: "Vérifier la coordination entre les différentes pièces de l'ensemble",
            ordre: 6,
            duree_estimee: 30,
            competences_requises: ["coordination", "style"],
            statut: "en_attente",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }
        ],
        duree_totale_estimee: 450,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];
  },

  async getOrdresProduction(): Promise<OrdreProduction[]> {
    return [
      {
        id: "op1",
        numero_ordre: "OP-2025-001",
        client_id: "1",
        client_nom: "Jean Kouassi",
        processus_id: "p1",
        processus_nom: "Confection Boubou Homme",
        quantite: 2,
        date_debut: new Date().toISOString(),
        date_fin_prevue: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        statut: "en_cours",
        priorite: "normale",
        notes: "Commande pour événement familial",
        taches_progression: [
          {
            id: "tp1",
            ordre_production_id: "op1",
            tache_id: "t1",
            tache_nom: "Prise de mesures",
            employe_nom: "Marie Tailleur",
            date_debut: new Date().toISOString(),
            date_fin: new Date().toISOString(),
            duree_reelle: 25,
            statut: "terminee",
            qualite_controle: "conforme",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: "tp2",
            ordre_production_id: "op1",
            tache_id: "t2",
            tache_nom: "Découpe du tissu",
            employe_nom: "Paul Coupeur",
            date_debut: new Date().toISOString(),
            statut: "en_cours",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];
  },

  async getHistoriqueProduction(ordreId?: string): Promise<HistoriqueProduction[]> {
    const baseHistorique = [
      {
        id: "h1",
        ordre_production_id: "op1",
        action: "creation" as const,
        description: "Ordre de production créé",
        employe_nom: "Admin CISS",
        date_action: new Date().toISOString(),
        details: { quantite: 2, priorite: "normale" },
      },
      {
        id: "h2",
        ordre_production_id: "op1",
        tache_id: "t1",
        action: "demarrage" as const,
        description: "Début de la prise de mesures",
        employe_nom: "Marie Tailleur",
        date_action: new Date().toISOString(),
      },
      {
        id: "h3",
        ordre_production_id: "op1",
        tache_id: "t1",
        action: "completion" as const,
        description: "Prise de mesures terminée",
        employe_nom: "Marie Tailleur",
        date_action: new Date().toISOString(),
        details: { duree_reelle: 25, qualite: "conforme" },
      },
    ];

    return ordreId 
      ? baseHistorique.filter(h => h.ordre_production_id === ordreId)
      : baseHistorique;
  },

  async createOrdreProduction(data: Partial<OrdreProduction>): Promise<OrdreProduction> {
    const newOrdre: OrdreProduction = {
      id: Date.now().toString(),
      numero_ordre: `OP-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`,
      client_id: data.client_id || "",
      processus_id: data.processus_id || "",
      quantite: data.quantite || 1,
      statut: "planifie",
      priorite: data.priorite || "normale",
      notes: data.notes,
      taches_progression: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    return newOrdre;
  },

  async createTacheProgression(data: Partial<TacheProgression>): Promise<TacheProgression> {
    const newTache: TacheProgression = {
      id: Date.now().toString(),
      ordre_production_id: data.ordre_production_id || "",
      tache_id: data.tache_id || "",
      tache_nom: data.tache_nom || "",
      statut: data.statut || "en_attente",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...data,
    };
    return newTache;
  },

  async updateTacheProgression(tacheId: string, updates: Partial<TacheProgression>): Promise<TacheProgression> {
    const updatedTache: TacheProgression = {
      id: tacheId,
      ordre_production_id: updates.ordre_production_id || "",
      tache_id: updates.tache_id || "",
      tache_nom: updates.tache_nom || "",
      statut: updates.statut || "en_attente",
      updated_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      ...updates,
    };

    return updatedTache;
  },

  async ajouterHistorique(data: Partial<HistoriqueProduction>): Promise<HistoriqueProduction> {
    const nouvelHistorique: HistoriqueProduction = {
      id: Date.now().toString(),
      ordre_production_id: data.ordre_production_id || "",
      action: data.action || "modification",
      description: data.description || "",
      date_action: new Date().toISOString(),
      ...data,
    };

    return nouvelHistorique;
  },

  async getStatistiquesProduction() {
    const ordres = await this.getOrdresProduction();
    const total = ordres.length;
    const enCours = ordres.filter(o => o.statut === "en_cours").length;
    const termines = ordres.filter(o => o.statut === "termine").length;
    const planifies = ordres.filter(o => o.statut === "planifie").length;

    return {
      total,
      enCours,
      termines,
      planifies,
      tauxCompletion: total > 0 ? (termines / total) * 100 : 0,
    };
  },
};

export default productionService;
