export interface Mensuration {
  id?: string;
  client_id: string;
  type_vetement: string;
  tour_poitrine?: number;
  tour_taille?: number;
  tour_hanches?: number;
  longueur_bras?: number;
  longueur_jambe?: number;
  largeur_epaules?: number;
  tour_cou?: number;
  tour_cuisse?: number;
  longueur_dos?: number;
  longueur_devant?: number;
  tour_biceps?: number;
  tour_poignet?: number;
  entrejambe?: number;
  notes?: string;
  date_prise: string;
  prise_par: string;
}

export interface Client {
  id: string;
  nom: string;
  prenom: string;
  email?: string;
  telephone?: string;
  adresse?: string;
  date_naissance?: string;
  sexe?: "homme" | "femme";
  profession?: string;
  preferences_style?: string;
  notes?: string;
  mensurations?: Mensuration[];
  date_creation: string;
  derniere_modification: string;
}

export interface ClientFormData {
  nom: string;
  prenom: string;
  email?: string;
  telephone?: string;
  adresse?: string;
  date_naissance?: string;
  sexe?: "homme" | "femme";
  profession?: string;
  preferences_style?: string;
  notes?: string;
}

export interface MensurationFormData {
  type_vetement: string;
  tour_poitrine?: number;
  tour_taille?: number;
  tour_hanches?: number;
  longueur_bras?: number;
  longueur_jambe?: number;
  largeur_epaules?: number;
  tour_cou?: number;
  tour_cuisse?: number;
  longueur_dos?: number;
  longueur_devant?: number;
  tour_biceps?: number;
  tour_poignet?: number;
  entrejambe?: number;
  notes?: string;
}

export const clientService = {
  async getClients(): Promise<Client[]> {
    // Mock data pour l'instant - sera remplacé par Supabase
    return [
      {
        id: "1",
        nom: "Kouassi",
        prenom: "Jean",
        email: "jean.kouassi@email.com",
        telephone: "+225 07 12 34 56 78",
        adresse: "Cocody, Abidjan",
        date_naissance: "1985-03-15",
        sexe: "homme",
        profession: "Ingénieur",
        preferences_style: "Traditionnel moderne",
        notes: "Préfère les couleurs sobres",
        mensurations: [
          {
            id: "m1",
            client_id: "1",
            type_vetement: "Boubou",
            tour_poitrine: 102,
            tour_taille: 88,
            tour_hanches: 95,
            longueur_bras: 65,
            largeur_epaules: 45,
            tour_cou: 40,
            longueur_dos: 75,
            longueur_devant: 70,
            notes: "Client préfère coupe ample",
            date_prise: new Date().toISOString(),
            prise_par: "Tailleur CISS"
          }
        ],
        date_creation: new Date().toISOString(),
        derniere_modification: new Date().toISOString()
      },
      {
        id: "2",
        nom: "Traoré",
        prenom: "Aminata",
        email: "aminata.traore@email.com",
        telephone: "+225 05 98 76 54 32",
        adresse: "Yopougon, Abidjan",
        date_naissance: "1990-07-22",
        sexe: "femme",
        profession: "Commerçante",
        preferences_style: "Traditionnel élégant",
        notes: "Commandes fréquentes pour événements",
        mensurations: [
          {
            id: "m2",
            client_id: "2",
            type_vetement: "Robe traditionnelle",
            tour_poitrine: 92,
            tour_taille: 75,
            tour_hanches: 98,
            longueur_bras: 58,
            largeur_epaules: 38,
            tour_cou: 35,
            longueur_dos: 68,
            longueur_devant: 65,
            longueur_jambe: 95,
            notes: "Préfère les robes longues",
            date_prise: new Date().toISOString(),
            prise_par: "Tailleur CISS"
          }
        ],
        date_creation: new Date().toISOString(),
        derniere_modification: new Date().toISOString()
      }
    ];
  },

  async getClientById(id: string): Promise<Client | null> {
    const clients = await this.getClients();
    return clients.find(client => client.id === id) || null;
  },

  async createClient(clientData: ClientFormData): Promise<Client> {
    const newClient: Client = {
      id: Date.now().toString(),
      ...clientData,
      mensurations: [],
      date_creation: new Date().toISOString(),
      derniere_modification: new Date().toISOString()
    };

    // Ici, on sauvegarderait en base de données avec Supabase
    // await supabase.from('clients').insert(newClient);

    return newClient;
  },

  async updateClient(clientId: string, clientData: Partial<ClientFormData>): Promise<Client> {
    const client = await this.getClientById(clientId);
    if (!client) {
      throw new Error("Client non trouvé");
    }

    const updatedClient: Client = {
      ...client,
      ...clientData,
      derniere_modification: new Date().toISOString()
    };

    // Ici, on mettrait à jour en base de données avec Supabase
    // await supabase.from('clients').update(updatedClient).eq('id', clientId);

    return updatedClient;
  },

  async deleteClient(clientId: string): Promise<void> {
    // Ici, on supprimerait de la base de données avec Supabase
    // await supabase.from('clients').delete().eq('id', clientId);
    console.log(`Deleting client with id: ${clientId}`);
  },

  async addMensuration(clientId: string, mensurationData: MensurationFormData, prisePar: string): Promise<Mensuration> {
    const newMensuration: Mensuration = {
      id: Date.now().toString(),
      client_id: clientId,
      ...mensurationData,
      date_prise: new Date().toISOString(),
      prise_par: prisePar
    };

    // Ici, on sauvegarderait en base de données avec Supabase
    // await supabase.from('mensurations').insert(newMensuration);

    return newMensuration;
  },

  async updateMensuration(mensurationId: string, mensurationData: Partial<MensurationFormData>): Promise<Mensuration> {
    // Ici, on mettrait à jour en base de données avec Supabase
    // const { data } = await supabase.from('mensurations').update(mensurationData).eq('id', mensurationId).select().single();
    
    // Mock pour l'instant
    const updatedMensuration: Mensuration = {
      id: mensurationId,
      client_id: "1",
      type_vetement: "Boubou",
      ...mensurationData,
      date_prise: new Date().toISOString(),
      prise_par: "Tailleur CISS"
    };

    return updatedMensuration;
  },

  async deleteMensuration(mensurationId: string): Promise<void> {
    // Ici, on supprimerait de la base de données avec Supabase
    // await supabase.from('mensurations').delete().eq('id', mensurationId);
    console.log(`Deleting mensuration with id: ${mensurationId}`);
  },

  async getMensurationsByClient(clientId: string): Promise<Mensuration[]> {
    const client = await this.getClientById(clientId);
    return client?.mensurations || [];
  },

  async searchClients(searchTerm: string): Promise<Client[]> {
    const clients = await this.getClients();
    return clients.filter(client =>
      client.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.telephone?.includes(searchTerm)
    );
  },

  async getClientStats() {
    const clients = await this.getClients();
    const totalClients = clients.length;
    const clientsAvecMensurations = clients.filter(c => c.mensurations && c.mensurations.length > 0).length;
    const clientsHommes = clients.filter(c => c.sexe === "homme").length;
    const clientsFemmes = clients.filter(c => c.sexe === "femme").length;

    return {
      totalClients,
      clientsAvecMensurations,
      clientsHommes,
      clientsFemmes,
      tauxMensuration: totalClients > 0 ? (clientsAvecMensurations / totalClients) * 100 : 0
    };
  }
};

export default clientService;
