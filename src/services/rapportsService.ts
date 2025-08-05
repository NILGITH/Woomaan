
export interface RapportVente {
  periode: string;
  chiffre_affaires: number;
  nombre_ventes: number;
  panier_moyen: number;
  articles_vendus: number;
  mode_paiement_repartition: { [key: string]: number };
  ventes_par_categorie: { [key: string]: number };
  evolution_mensuelle: { mois: string; ca: number; ventes: number }[];
}

export interface RapportProduction {
  periode: string;
  ordres_total: number;
  ordres_termines: number;
  ordres_en_cours: number;
  ordres_planifies: number;
  taux_completion: number;
  duree_moyenne: number;
  production_par_type: { [key: string]: number };
  evolution_production: { mois: string; termines: number; planifies: number }[];
}

export interface RapportStock {
  periode: string;
  valeur_stock_total: number;
  articles_en_rupture: number;
  articles_faible_stock: number;
  rotation_stock: number;
  stock_par_categorie: { [key: string]: { quantite: number; valeur: number } };
  evolution_stock: { mois: string; entrees: number; sorties: number }[];
}

export interface RapportClient {
  periode: string;
  nouveaux_clients: number;
  clients_actifs: number;
  clients_total: number;
  taux_retention: number;
  ca_par_client: number;
  repartition_sexe: { homme: number; femme: number };
  clients_par_ville: { [key: string]: number };
}

export interface FiltreRapport {
  date_debut: string;
  date_fin: string;
  type_rapport: "ventes" | "production" | "stock" | "clients" | "global";
  magasin?: string;
  categorie?: string;
  client_id?: string;
  employe_id?: string;
}

export type ChartMetric = 
  | "ventes_ca" 
  | "ventes_nombre"
  | "production_evolution"
  | "stock_valeur"
  | "stock_quantite"
  | "clients_nouveaux";

export const rapportsService = {
  async getRapportVentes(filtres: FiltreRapport): Promise<RapportVente> {
    // Simulation de données - à remplacer par de vraies requêtes
    return {
      periode: `${filtres.date_debut} - ${filtres.date_fin}`,
      chiffre_affaires: 2450000,
      nombre_ventes: 98,
      panier_moyen: 25000,
      articles_vendus: 156,
      mode_paiement_repartition: {
        "especes": 45,
        "mobile_money": 30,
        "carte": 20,
        "cheque": 5
      },
      ventes_par_categorie: {
        "vetement_homme": 1200000,
        "vetement_femme": 980000,
        "accessoire": 270000
      },
      evolution_mensuelle: [
        { mois: "Jan", ca: 800000, ventes: 32 },
        { mois: "Fév", ca: 750000, ventes: 30 },
        { mois: "Mar", ca: 900000, ventes: 36 },
        { mois: "Avr", ca: 1100000, ventes: 44 },
        { mois: "Mai", ca: 1300000, ventes: 52 },
        { mois: "Juin", ca: 1450000, ventes: 58 }
      ]
    };
  },

  async getRapportProduction(filtres: FiltreRapport): Promise<RapportProduction> {
    return {
      periode: `${filtres.date_debut} - ${filtres.date_fin}`,
      ordres_total: 45,
      ordres_termines: 32,
      ordres_en_cours: 8,
      ordres_planifies: 5,
      taux_completion: 71.1,
      duree_moyenne: 4.5,
      production_par_type: {
        "boubou_homme": 18,
        "robe_femme": 12,
        "ensemble_traditionnel": 8,
        "accessoire": 7
      },
      evolution_production: [
        { mois: "Jan", termines: 8, planifies: 12 },
        { mois: "Fév", termines: 6, planifies: 10 },
        { mois: "Mar", termines: 10, planifies: 14 },
        { mois: "Avr", termines: 12, planifies: 16 },
        { mois: "Mai", termines: 15, planifies: 18 },
        { mois: "Juin", termines: 18, planifies: 20 }
      ]
    };
  },

  async getRapportStock(filtres: FiltreRapport): Promise<RapportStock> {
    return {
      periode: `${filtres.date_debut} - ${filtres.date_fin}`,
      valeur_stock_total: 8500000,
      articles_en_rupture: 5,
      articles_faible_stock: 12,
      rotation_stock: 3.2,
      stock_par_categorie: {
        "matiere_premiere": { quantite: 450, valeur: 3200000 },
        "vetement_homme": { quantite: 85, valeur: 2100000 },
        "vetement_femme": { quantite: 92, valeur: 2760000 },
        "accessoire": { quantite: 156, valeur: 440000 }
      },
      evolution_stock: [
        { mois: "Jan", entrees: 120, sorties: 95 },
        { mois: "Fév", entrees: 110, sorties: 88 },
        { mois: "Mar", entrees: 135, sorties: 102 },
        { mois: "Avr", entrees: 145, sorties: 118 },
        { mois: "Mai", entrees: 160, sorties: 135 },
        { mois: "Juin", entrees: 175, sorties: 148 }
      ]
    };
  },

  async getRapportClients(filtres: FiltreRapport): Promise<RapportClient> {
    return {
      periode: `${filtres.date_debut} - ${filtres.date_fin}`,
      nouveaux_clients: 24,
      clients_actifs: 156,
      clients_total: 342,
      taux_retention: 78.5,
      ca_par_client: 15700,
      repartition_sexe: { homme: 145, femme: 197 },
      clients_par_ville: {
        "Abidjan": 198,
        "Bouaké": 45,
        "Yamoussoukro": 32,
        "San-Pédro": 28,
        "Korhogo": 21,
        "Daloa": 18
      }
    };
  },

  async exporterRapport(type: string, format: "excel" | "pdf" | "csv", filtres: FiltreRapport): Promise<string> {
    // Simulation d'export - à implémenter avec une vraie librairie d'export
    console.log("Exporting report with filters:", filtres);
    const timestamp = new Date().toISOString().slice(0, 10);
    return `rapport_${type}_${timestamp}.${format}`;
  },

  async getDonneesGraphique(metric: ChartMetric, filtres: FiltreRapport) {
    const ventesData = await this.getRapportVentes(filtres);
    const stockData = await this.getRapportStock(filtres);
    const productionData = await this.getRapportProduction(filtres);
    // const clientsData = await this.getRapportClients(filtres);

    switch (metric) {
      case "ventes_ca":
        return {
          labels: ventesData.evolution_mensuelle.map(d => d.mois),
          datasets: [{
            label: "Chiffre d'affaires",
            data: ventesData.evolution_mensuelle.map(d => d.ca),
            borderColor: "rgb(34, 197, 94)",
            backgroundColor: "rgba(34, 197, 94, 0.1)",
            fill: true,
          }]
        };
      case "ventes_nombre":
        return {
          labels: ventesData.evolution_mensuelle.map(d => d.mois),
          datasets: [{
            label: "Nombre de ventes",
            data: ventesData.evolution_mensuelle.map(d => d.ventes),
            borderColor: "rgb(59, 130, 246)",
            backgroundColor: "rgba(59, 130, 246, 0.1)",
            fill: true,
          }]
        };
      case "production_evolution":
        return {
          labels: productionData.evolution_production.map(d => d.mois),
          datasets: [
            {
              label: "Ordres terminés",
              data: productionData.evolution_production.map(d => d.termines),
              backgroundColor: "rgba(59, 130, 246, 0.8)",
            },
            {
              label: "Ordres planifiés",
              data: productionData.evolution_production.map(d => d.planifies),
              backgroundColor: "rgba(200, 200, 200, 0.8)",
            }
          ]
        };
      case "stock_valeur":
        return {
          labels: Object.keys(stockData.stock_par_categorie).map(c => c.replace(/_/g, " ")),
          datasets: [{
            label: "Valeur du stock par catégorie",
            data: Object.values(stockData.stock_par_categorie).map((d: { quantite: number; valeur: number }) => d.valeur),
            backgroundColor: [
              "rgba(239, 68, 68, 0.8)",
              "rgba(245, 158, 11, 0.8)",
              "rgba(34, 197, 94, 0.8)",
              "rgba(59, 130, 246, 0.8)",
              "rgba(147, 51, 234, 0.8)"
            ]
          }]
        };
      case "stock_quantite":
        return {
          labels: Object.keys(stockData.stock_par_categorie).map(c => c.replace(/_/g, " ")),
          datasets: [{
            label: "Quantité en stock par catégorie",
            data: Object.values(stockData.stock_par_categorie).map((d: { quantite: number; valeur: number }) => d.quantite),
            backgroundColor: [
              "rgba(239, 68, 68, 0.8)",
              "rgba(245, 158, 11, 0.8)",
              "rgba(34, 197, 94, 0.8)",
              "rgba(59, 130, 246, 0.8)",
              "rgba(147, 51, 234, 0.8)"
            ]
          }]
        };
      case "clients_nouveaux":
        return {
          labels: ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin"], // Mock labels
          datasets: [{
            label: "Nouveaux clients",
            data: [5, 8, 12, 15, 18, 24], // Mock data
            borderColor: "rgb(168, 85, 247)",
            backgroundColor: "rgba(168, 85, 247, 0.1)",
            fill: true,
          }]
        };
      default:
        return null;
    }
  }
};

export default rapportsService;
