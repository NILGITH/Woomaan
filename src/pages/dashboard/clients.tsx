import { useState, useEffect, useCallback } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  Edit, 
  Trash2, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Download, 
  Upload, 
  Ruler,
  Eye,
  Search,
  Users
} from "lucide-react";
import { clientService, type Client, type Mensuration, type ClientFormData, type MensurationFormData } from "@/services/clientService";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/layout/DashboardLayout";

export default function ClientsPage() {
  const { user } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [mensurationDialogOpen, setMensurationDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [editingMensuration, setEditingMensuration] = useState<Mensuration | null>(null);
  const [stats, setStats] = useState<{
    totalClients: number;
    clientsAvecMensurations: number;
    clientsHommes: number;
    clientsFemmes: number;
    tauxMensuration: number;
  } | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState<ClientFormData>({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    adresse: "",
    date_naissance: "",
    sexe: undefined,
    profession: "",
    preferences_style: "",
    notes: "",
  });

  const [mensurationData, setMensurationData] = useState<MensurationFormData>({
    type_vetement: "",
    tour_poitrine: undefined,
    tour_taille: undefined,
    tour_hanches: undefined,
    longueur_bras: undefined,
    longueur_jambe: undefined,
    largeur_epaules: undefined,
    tour_cou: undefined,
    tour_cuisse: undefined,
    longueur_dos: undefined,
    longueur_devant: undefined,
    tour_biceps: undefined,
    tour_poignet: undefined,
    entrejambe: undefined,
    notes: "",
  });

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [clientsData, statsData] = await Promise.all([
        clientService.getClients(),
        clientService.getClientStats()
      ]);
      setClients(clientsData);
      setStats(statsData);
    } catch (error) {
      console.error("Failed to load clients:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les clients",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredClients = clients.filter(client =>
    client.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.telephone?.includes(searchTerm)
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingClient) {
        await clientService.updateClient(editingClient.id, formData);
        toast({
          title: "Succès",
          description: "Client modifié avec succès",
        });
      } else {
        await clientService.createClient(formData);
        toast({
          title: "Succès",
          description: "Client créé avec succès",
        });
      }

      setDialogOpen(false);
      resetForm();
      await loadData();
    } catch (error) {
      console.error("Failed to save client:", error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder le client",
        variant: "destructive",
      });
    }
  };

  const handleMensurationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClient) return;

    try {
      if (editingMensuration) {
        await clientService.updateMensuration(editingMensuration.id, mensurationData);
        toast({
          title: "Succès",
          description: "Mensuration modifiée avec succès",
        });
      } else {
        await clientService.addMensuration(
          selectedClient.id, 
          mensurationData, 
          `${user?.prenom} ${user?.nom}` || "Tailleur WOOMAAN"
        );
        toast({
          title: "Succès",
          description: "Mensuration ajoutée avec succès",
        });
      }

      setMensurationDialogOpen(false);
      resetMensurationForm();
      await loadData();
    } catch (error) {
      console.error("Failed to save mensuration:", error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder la mensuration",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setFormData({
      nom: client.nom,
      prenom: client.prenom,
      email: client.email || "",
      telephone: client.telephone || "",
      adresse: client.adresse || "",
      date_naissance: client.date_naissance || "",
      sexe: client.sexe,
      profession: client.profession || "",
      preferences_style: client.preferences_style || "",
      notes: client.notes || "",
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce client ?")) {
      try {
        await clientService.deleteClient(id);
        toast({
          title: "Succès",
          description: "Client supprimé avec succès",
        });
        await loadData();
      } catch (error) {
        console.error("Failed to delete client:", error);
        toast({
          title: "Erreur",
          description: "Impossible de supprimer le client",
          variant: "destructive",
        });
      }
    }
  };

  const handleViewDetails = (client: Client) => {
    setSelectedClient(client);
    setDetailsDialogOpen(true);
  };

  const handleAddMensuration = (client: Client) => {
    setSelectedClient(client);
    setEditingMensuration(null);
    resetMensurationForm();
    setMensurationDialogOpen(true);
  };

  const handleEditMensuration = (client: Client, mensuration: Mensuration) => {
    setSelectedClient(client);
    setEditingMensuration(mensuration);
    setMensurationData({
      type_vetement: mensuration.type_vetement,
      tour_poitrine: mensuration.tour_poitrine,
      tour_taille: mensuration.tour_taille,
      tour_hanches: mensuration.tour_hanches,
      longueur_bras: mensuration.longueur_bras,
      longueur_jambe: mensuration.longueur_jambe,
      largeur_epaules: mensuration.largeur_epaules,
      tour_cou: mensuration.tour_cou,
      tour_cuisse: mensuration.tour_cuisse,
      longueur_dos: mensuration.longueur_dos,
      longueur_devant: mensuration.longueur_devant,
      tour_biceps: mensuration.tour_biceps,
      tour_poignet: mensuration.tour_poignet,
      entrejambe: mensuration.entrejambe,
      notes: mensuration.notes || "",
    });
    setMensurationDialogOpen(true);
  };

  const handleExportExcel = () => {
    const csvContent = [
      ["Nom", "Prénom", "Email", "Téléphone", "Adresse", "Date de naissance", "Sexe", "Profession"],
      ...clients.map(client => [
        client.nom,
        client.prenom,
        client.email || "",
        client.telephone || "",
        client.adresse || "",
        client.date_naissance || "",
        client.sexe || "",
        client.profession || ""
      ])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "clients_woomaan.csv";
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export réussi",
      description: "La liste des clients a été exportée",
    });
  };

  const resetForm = () => {
    setFormData({
      nom: "",
      prenom: "",
      email: "",
      telephone: "",
      adresse: "",
      date_naissance: "",
      sexe: undefined,
      profession: "",
      preferences_style: "",
      notes: "",
    });
    setEditingClient(null);
  };

  const resetMensurationForm = () => {
    setMensurationData({
      type_vetement: "",
      tour_poitrine: undefined,
      tour_taille: undefined,
      tour_hanches: undefined,
      longueur_bras: undefined,
      longueur_jambe: undefined,
      largeur_epaules: undefined,
      tour_cou: undefined,
      tour_cuisse: undefined,
      longueur_dos: undefined,
      longueur_devant: undefined,
      tour_biceps: undefined,
      tour_poignet: undefined,
      entrejambe: undefined,
      notes: "",
    });
    setEditingMensuration(null);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement des clients...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion des Clients</h1>
            <p className="text-gray-600 mt-2">Base de données clients WOOMAAN - Côte d'Ivoire</p>
          </div>
        </div>

        {/* Statistiques */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Clients</p>
                    <p className="text-2xl font-bold text-green-600">{stats.totalClients}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Ruler className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Avec Mensurations</p>
                    <p className="text-2xl font-bold text-blue-600">{stats.clientsAvecMensurations}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-purple-200">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <User className="h-8 w-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Hommes</p>
                    <p className="text-2xl font-bold text-purple-600">{stats.clientsHommes}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-pink-200">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <User className="h-8 w-8 text-pink-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Femmes</p>
                    <p className="text-2xl font-bold text-pink-600">{stats.clientsFemmes}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Contenu principal */}
        <Tabs defaultValue="liste" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="liste">Liste des Clients</TabsTrigger>
            <TabsTrigger value="mensurations">Mensurations</TabsTrigger>
          </TabsList>

          <TabsContent value="liste" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center text-green-700">
                      <User className="mr-2 h-5 w-5" />
                      Gestion des Clients
                    </CardTitle>
                    <CardDescription>
                      Gérez votre base de données clients - {clients.length} clients enregistrés
                    </CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" onClick={handleExportExcel}>
                      <Download className="mr-2 h-4 w-4" />
                      Exporter Excel
                    </Button>
                    <Button variant="outline">
                      <Upload className="mr-2 h-4 w-4" />
                      Importer Excel
                    </Button>
                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                      <DialogTrigger asChild>
                        <Button onClick={resetForm} className="bg-green-600 hover:bg-green-700">
                          <Plus className="mr-2 h-4 w-4" />
                          Nouveau client
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>
                            {editingClient ? "Modifier le client" : "Nouveau client"}
                          </DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="nom">Nom *</Label>
                              <Input
                                id="nom"
                                value={formData.nom}
                                onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                                required
                              />
                            </div>
                            <div>
                              <Label htmlFor="prenom">Prénom *</Label>
                              <Input
                                id="prenom"
                                value={formData.prenom}
                                onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                                required
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="email">Email</Label>
                              <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              />
                            </div>
                            <div>
                              <Label htmlFor="telephone">Téléphone</Label>
                              <Input
                                id="telephone"
                                value={formData.telephone}
                                onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                                placeholder="+225 XX XX XX XX XX"
                              />
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="adresse">Adresse</Label>
                            <Input
                              id="adresse"
                              value={formData.adresse}
                              onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="date_naissance">Date de naissance</Label>
                              <Input
                                id="date_naissance"
                                type="date"
                                value={formData.date_naissance}
                                onChange={(e) => setFormData({ ...formData, date_naissance: e.target.value })}
                              />
                            </div>
                            <div>
                              <Label htmlFor="sexe">Sexe</Label>
                              <Select value={formData.sexe} onValueChange={(value: "homme" | "femme") => setFormData({ ...formData, sexe: value })}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Sélectionner" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="homme">Homme</SelectItem>
                                  <SelectItem value="femme">Femme</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="profession">Profession</Label>
                            <Input
                              id="profession"
                              value={formData.profession}
                              onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                            />
                          </div>
                          <div>
                            <Label htmlFor="preferences_style">Préférences de style</Label>
                            <Input
                              id="preferences_style"
                              value={formData.preferences_style}
                              onChange={(e) => setFormData({ ...formData, preferences_style: e.target.value })}
                              placeholder="Ex: Traditionnel moderne, Élégant..."
                            />
                          </div>
                          <div>
                            <Label htmlFor="notes">Notes</Label>
                            <Textarea
                              id="notes"
                              value={formData.notes}
                              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                              placeholder="Notes sur le client..."
                            />
                          </div>
                          <div className="flex justify-end space-x-2">
                            <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                              Annuler
                            </Button>
                            <Button type="submit" className="bg-green-600 hover:bg-green-700">
                              {editingClient ? "Modifier" : "Créer"}
                            </Button>
                          </div>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
                <div className="flex space-x-2 mt-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Rechercher un client..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Client</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Informations</TableHead>
                      <TableHead>Mensurations</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredClients.map((client) => (
                      <TableRow key={client.id}>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4 text-gray-400" />
                            <div>
                              <p className="font-medium">{client.prenom} {client.nom}</p>
                              {client.profession && (
                                <p className="text-sm text-gray-500">{client.profession}</p>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {client.email && (
                              <div className="flex items-center space-x-2 text-sm">
                                <Mail className="h-3 w-3 text-gray-400" />
                                <span>{client.email}</span>
                              </div>
                            )}
                            {client.telephone && (
                              <div className="flex items-center space-x-2 text-sm">
                                <Phone className="h-3 w-3 text-gray-400" />
                                <span>{client.telephone}</span>
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {client.adresse && (
                              <div className="flex items-center space-x-2 text-sm">
                                <MapPin className="h-3 w-3 text-gray-400" />
                                <span>{client.adresse}</span>
                              </div>
                            )}
                            {client.date_naissance && (
                              <Badge variant="outline" className="text-xs">
                                {new Date(client.date_naissance).toLocaleDateString("fr-FR")}
                              </Badge>
                            )}
                            {client.sexe && (
                              <Badge variant="outline" className="text-xs ml-2">
                                {client.sexe}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Badge 
                              variant={client.mensurations && client.mensurations.length > 0 ? "default" : "secondary"}
                              className="text-xs"
                            >
                              {client.mensurations?.length || 0} mesure(s)
                            </Badge>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleAddMensuration(client)}
                            >
                              <Ruler className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline" onClick={() => handleViewDetails(client)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleEdit(client)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleDelete(client.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mensurations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-green-700">
                  <Ruler className="mr-2 h-5 w-5" />
                  Gestion des Mensurations
                </CardTitle>
                <CardDescription>
                  Mensurations détaillées pour la confection de vêtements traditionnels
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {clients.filter(c => c.mensurations && c.mensurations.length > 0).map((client) => (
                    <div key={client.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <h3 className="font-semibold text-lg">{client.prenom} {client.nom}</h3>
                          <p className="text-sm text-gray-500">{client.telephone}</p>
                        </div>
                        <Button 
                          size="sm" 
                          onClick={() => handleAddMensuration(client)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Nouvelle mesure
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {client.mensurations?.map((mensuration) => (
                          <Card key={mensuration.id} className="border-green-100">
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="font-medium">{mensuration.type_vetement}</h4>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handleEditMensuration(client, mensuration)}
                                >
                                  <Edit className="h-3 w-3" />
                                </Button>
                              </div>
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                {mensuration.tour_poitrine && (
                                  <div>Poitrine: {mensuration.tour_poitrine}cm</div>
                                )}
                                {mensuration.tour_taille && (
                                  <div>Taille: {mensuration.tour_taille}cm</div>
                                )}
                                {mensuration.tour_hanches && (
                                  <div>Hanches: {mensuration.tour_hanches}cm</div>
                                )}
                                {mensuration.longueur_bras && (
                                  <div>Bras: {mensuration.longueur_bras}cm</div>
                                )}
                              </div>
                              <div className="mt-2 text-xs text-gray-500">
                                Pris le {new Date(mensuration.date_prise).toLocaleDateString("fr-FR")} par {mensuration.prise_par}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Dialog Détails Client */}
        <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Détails du Client</DialogTitle>
            </DialogHeader>
            
            {selectedClient && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Nom complet</Label>
                    <p className="font-medium">{selectedClient.prenom} {selectedClient.nom}</p>
                  </div>
                  <div>
                    <Label>Sexe</Label>
                    <p className="font-medium">{selectedClient.sexe || "Non spécifié"}</p>
                  </div>
                  <div>
                    <Label>Email</Label>
                    <p className="font-medium">{selectedClient.email || "Non renseigné"}</p>
                  </div>
                  <div>
                    <Label>Téléphone</Label>
                    <p className="font-medium">{selectedClient.telephone || "Non renseigné"}</p>
                  </div>
                  <div>
                    <Label>Adresse</Label>
                    <p className="font-medium">{selectedClient.adresse || "Non renseignée"}</p>
                  </div>
                  <div>
                    <Label>Date de naissance</Label>
                    <p className="font-medium">
                      {selectedClient.date_naissance 
                        ? new Date(selectedClient.date_naissance).toLocaleDateString("fr-FR")
                        : "Non renseignée"
                      }
                    </p>
                  </div>
                  <div>
                    <Label>Profession</Label>
                    <p className="font-medium">{selectedClient.profession || "Non renseignée"}</p>
                  </div>
                  <div>
                    <Label>Préférences de style</Label>
                    <p className="font-medium">{selectedClient.preferences_style || "Non renseignées"}</p>
                  </div>
                </div>
                
                {selectedClient.notes && (
                  <div>
                    <Label>Notes</Label>
                    <p className="font-medium bg-gray-50 p-2 rounded">{selectedClient.notes}</p>
                  </div>
                )}

                <div>
                  <Label>Mensurations ({selectedClient.mensurations?.length || 0})</Label>
                  {selectedClient.mensurations && selectedClient.mensurations.length > 0 ? (
                    <div className="space-y-2 mt-2">
                      {selectedClient.mensurations.map((mensuration) => (
                        <div key={mensuration.id} className="border rounded p-2">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{mensuration.type_vetement}</span>
                            <span className="text-sm text-gray-500">
                              {new Date(mensuration.date_prise).toLocaleDateString("fr-FR")}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 mt-2">Aucune mensuration enregistrée</p>
                  )}
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setDetailsDialogOpen(false)}>
                    Fermer
                  </Button>
                  <Button 
                    onClick={() => {
                      handleAddMensuration(selectedClient);
                      setDetailsDialogOpen(false);
                    }}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Ruler className="mr-2 h-4 w-4" />
                    Ajouter mensuration
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Dialog Mensuration */}
        <Dialog open={mensurationDialogOpen} onOpenChange={setMensurationDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingMensuration ? "Modifier la mensuration" : "Nouvelle mensuration"}
                {selectedClient && ` - ${selectedClient.prenom} ${selectedClient.nom}`}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleMensurationSubmit} className="space-y-6">
              <div>
                <Label htmlFor="type_vetement">Type de vêtement *</Label>
                <Select 
                  value={mensurationData.type_vetement} 
                  onValueChange={(value) => setMensurationData({ ...mensurationData, type_vetement: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner le type de vêtement" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Boubou">Boubou</SelectItem>
                    <SelectItem value="Dashiki">Dashiki</SelectItem>
                    <SelectItem value="Robe traditionnelle">Robe traditionnelle</SelectItem>
                    <SelectItem value="Costume">Costume</SelectItem>
                    <SelectItem value="Chemise">Chemise</SelectItem>
                    <SelectItem value="Pantalon">Pantalon</SelectItem>
                    <SelectItem value="Kaba">Kaba</SelectItem>
                    <SelectItem value="Autre">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="tour_poitrine">Tour de poitrine (cm)</Label>
                  <Input
                    id="tour_poitrine"
                    type="number"
                    value={mensurationData.tour_poitrine || ""}
                    onChange={(e) => setMensurationData({ ...mensurationData, tour_poitrine: parseFloat(e.target.value) || undefined })}
                  />
                </div>
                <div>
                  <Label htmlFor="tour_taille">Tour de taille (cm)</Label>
                  <Input
                    id="tour_taille"
                    type="number"
                    value={mensurationData.tour_taille || ""}
                    onChange={(e) => setMensurationData({ ...mensurationData, tour_taille: parseFloat(e.target.value) || undefined })}
                  />
                </div>
                <div>
                  <Label htmlFor="tour_hanches">Tour de hanches (cm)</Label>
                  <Input
                    id="tour_hanches"
                    type="number"
                    value={mensurationData.tour_hanches || ""}
                    onChange={(e) => setMensurationData({ ...mensurationData, tour_hanches: parseFloat(e.target.value) || undefined })}
                  />
                </div>
                <div>
                  <Label htmlFor="longueur_bras">Longueur de bras (cm)</Label>
                  <Input
                    id="longueur_bras"
                    type="number"
                    value={mensurationData.longueur_bras || ""}
                    onChange={(e) => setMensurationData({ ...mensurationData, longueur_bras: parseFloat(e.target.value) || undefined })}
                  />
                </div>
                <div>
                  <Label htmlFor="longueur_jambe">Longueur de jambe (cm)</Label>
                  <Input
                    id="longueur_jambe"
                    type="number"
                    value={mensurationData.longueur_jambe || ""}
                    onChange={(e) => setMensurationData({ ...mensurationData, longueur_jambe: parseFloat(e.target.value) || undefined })}
                  />
                </div>
                <div>
                  <Label htmlFor="largeur_epaules">Largeur d'épaules (cm)</Label>
                  <Input
                    id="largeur_epaules"
                    type="number"
                    value={mensurationData.largeur_epaules || ""}
                    onChange={(e) => setMensurationData({ ...mensurationData, largeur_epaules: parseFloat(e.target.value) || undefined })}
                  />
                </div>
                <div>
                  <Label htmlFor="tour_cou">Tour de cou (cm)</Label>
                  <Input
                    id="tour_cou"
                    type="number"
                    value={mensurationData.tour_cou || ""}
                    onChange={(e) => setMensurationData({ ...mensurationData, tour_cou: parseFloat(e.target.value) || undefined })}
                  />
                </div>
                <div>
                  <Label htmlFor="tour_cuisse">Tour de cuisse (cm)</Label>
                  <Input
                    id="tour_cuisse"
                    type="number"
                    value={mensurationData.tour_cuisse || ""}
                    onChange={(e) => setMensurationData({ ...mensurationData, tour_cuisse: parseFloat(e.target.value) || undefined })}
                  />
                </div>
                <div>
                  <Label htmlFor="longueur_dos">Longueur de dos (cm)</Label>
                  <Input
                    id="longueur_dos"
                    type="number"
                    value={mensurationData.longueur_dos || ""}
                    onChange={(e) => setMensurationData({ ...mensurationData, longueur_dos: parseFloat(e.target.value) || undefined })}
                  />
                </div>
                <div>
                  <Label htmlFor="longueur_devant">Longueur de devant (cm)</Label>
                  <Input
                    id="longueur_devant"
                    type="number"
                    value={mensurationData.longueur_devant || ""}
                    onChange={(e) => setMensurationData({ ...mensurationData, longueur_devant: parseFloat(e.target.value) || undefined })}
                  />
                </div>
                <div>
                  <Label htmlFor="tour_biceps">Tour de biceps (cm)</Label>
                  <Input
                    id="tour_biceps"
                    type="number"
                    value={mensurationData.tour_biceps || ""}
                    onChange={(e) => setMensurationData({ ...mensurationData, tour_biceps: parseFloat(e.target.value) || undefined })}
                  />
                </div>
                <div>
                  <Label htmlFor="tour_poignet">Tour de poignet (cm)</Label>
                  <Input
                    id="tour_poignet"
                    type="number"
                    value={mensurationData.tour_poignet || ""}
                    onChange={(e) => setMensurationData({ ...mensurationData, tour_poignet: parseFloat(e.target.value) || undefined })}
                  />
                </div>
                <div>
                  <Label htmlFor="entrejambe">Entrejambe (cm)</Label>
                  <Input
                    id="entrejambe"
                    type="number"
                    value={mensurationData.entrejambe || ""}
                    onChange={(e) => setMensurationData({ ...mensurationData, entrejambe: parseFloat(e.target.value) || undefined })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="notes_mensuration">Notes</Label>
                <Textarea
                  id="notes_mensuration"
                  value={mensurationData.notes}
                  onChange={(e) => setMensurationData({ ...mensurationData, notes: e.target.value })}
                  placeholder="Notes sur les mensurations..."
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setMensurationDialogOpen(false)}>
                  Annuler
                </Button>
                <Button 
                  type="submit" 
                  className="bg-green-600 hover:bg-green-700"
                  disabled={!mensurationData.type_vetement}
                >
                  {editingMensuration ? "Modifier" : "Enregistrer"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
