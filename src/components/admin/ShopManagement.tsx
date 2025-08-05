import { useState, useEffect, useCallback } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Store, MapPin, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Boutique {
  id: string;
  nom: string;
  adresse: string;
  telephone: string;
  email?: string;
  responsable: string;
  ville: string;
  statut: "active" | "inactive" | "maintenance";
  type: "principale" | "succursale" | "depot";
  surface: number;
  capacite_stock: number;
  created_at: string;
}

interface FormData {
  nom: string;
  adresse: string;
  telephone: string;
  email: string;
  responsable: string;
  ville: string;
  statut: "active" | "inactive" | "maintenance";
  type: "principale" | "succursale" | "depot";
  surface: number;
  capacite_stock: number;
}

export default function ShopManagement() {
  const [boutiques, setBoutiques] = useState<Boutique[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBoutique, setEditingBoutique] = useState<Boutique | null>(null);
  const [formData, setFormData] = useState<FormData>({
    nom: "",
    adresse: "",
    telephone: "",
    email: "",
    responsable: "",
    ville: "",
    statut: "active",
    type: "succursale",
    surface: 0,
    capacite_stock: 0,
  });
  const { toast } = useToast();

  const loadBoutiques = useCallback(async () => {
    setLoading(true);
    try {
      // Simulation des données
      const mockBoutiques: Boutique[] = [
        {
          id: "1",
          nom: "CISS ST MOISE - Siège Principal",
          adresse: "Avenue de la République, Saint-Moise",
          telephone: "+225 XX XX XX XX",
          email: "siege@ciss-stmoise.ci",
          responsable: "Directeur Général",
          ville: "Saint-Moise",
          statut: "active",
          type: "principale",
          surface: 200,
          capacite_stock: 1000,
          created_at: new Date().toISOString(),
        },
        {
          id: "2",
          nom: "CISS ST MOISE - Abidjan",
          adresse: "Boulevard Lagunaire, Cocody",
          telephone: "+225 XX XX XX XX",
          email: "abidjan@ciss-stmoise.ci",
          responsable: "Marie Kouassi",
          ville: "Abidjan",
          statut: "active",
          type: "succursale",
          surface: 150,
          capacite_stock: 500,
          created_at: new Date().toISOString(),
        },
        {
          id: "3",
          nom: "CISS ST MOISE - Dépôt Yamoussoukro",
          adresse: "Zone Industrielle, Yamoussoukro",
          telephone: "+225 XX XX XX XX",
          responsable: "Jean Koffi",
          ville: "Yamoussoukro",
          statut: "maintenance",
          type: "depot",
          surface: 300,
          capacite_stock: 2000,
          created_at: new Date().toISOString(),
        },
      ];
      setBoutiques(mockBoutiques);
    } catch (error) {
      console.error("Erreur lors du chargement:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les boutiques",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadBoutiques();
  }, [loadBoutiques]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingBoutique) {
        // Mise à jour
        const updatedBoutique: Boutique = {
          ...editingBoutique,
          ...formData,
        };
        setBoutiques(prev => prev.map(boutique => boutique.id === editingBoutique.id ? updatedBoutique : boutique));
        toast({
          title: "Succès",
          description: "Boutique mise à jour avec succès",
        });
      } else {
        // Création
        const newBoutique: Boutique = {
          id: Date.now().toString(),
          ...formData,
          created_at: new Date().toISOString(),
        };
        setBoutiques(prev => [newBoutique, ...prev]);
        toast({
          title: "Succès",
          description: "Boutique créée avec succès",
        });
      }
      
      resetForm();
      setDialogOpen(false);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la sauvegarde",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (boutique: Boutique) => {
    setEditingBoutique(boutique);
    setFormData({
      nom: boutique.nom,
      adresse: boutique.adresse,
      telephone: boutique.telephone,
      email: boutique.email || "",
      responsable: boutique.responsable,
      ville: boutique.ville,
      statut: boutique.statut,
      type: boutique.type,
      surface: boutique.surface,
      capacite_stock: boutique.capacite_stock,
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette boutique ?")) {
      try {
        setBoutiques(prev => prev.filter(boutique => boutique.id !== id));
        toast({
          title: "Succès",
          description: "Boutique supprimée avec succès",
        });
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
        toast({
          title: "Erreur",
          description: "Erreur lors de la suppression",
          variant: "destructive",
        });
      }
    }
  };

  const resetForm = () => {
    setFormData({
      nom: "",
      adresse: "",
      telephone: "",
      email: "",
      responsable: "",
      ville: "",
      statut: "active",
      type: "succursale",
      surface: 0,
      capacite_stock: 0,
    });
    setEditingBoutique(null);
  };

  const getStatutBadgeColor = (statut: string) => {
    switch (statut) {
      case "active": return "bg-green-100 text-green-800";
      case "inactive": return "bg-red-100 text-red-800";
      case "maintenance": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case "principale": return "bg-blue-100 text-blue-800";
      case "succursale": return "bg-purple-100 text-purple-800";
      case "depot": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestion des Boutiques</h2>
          <p className="text-gray-600">Gérez vos boutiques, succursales et dépôts</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="bg-green-600 hover:bg-green-700">
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle Boutique
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingBoutique ? "Modifier la Boutique" : "Nouvelle Boutique"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nom">Nom de la boutique *</Label>
                  <Input
                    id="nom"
                    value={formData.nom}
                    onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                    placeholder="Ex: CISS ST MOISE - Abidjan"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="type">Type</Label>
                  <select
                    id="type"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as Boutique["type"] })}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="principale">Boutique Principale</option>
                    <option value="succursale">Succursale</option>
                    <option value="depot">Dépôt</option>
                  </select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="adresse">Adresse complète *</Label>
                <Textarea
                  id="adresse"
                  value={formData.adresse}
                  onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
                  placeholder="Adresse complète de la boutique"
                  rows={2}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="ville">Ville *</Label>
                  <Input
                    id="ville"
                    value={formData.ville}
                    onChange={(e) => setFormData({ ...formData, ville: e.target.value })}
                    placeholder="Abidjan"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="telephone">Téléphone *</Label>
                  <Input
                    id="telephone"
                    value={formData.telephone}
                    onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                    placeholder="+225 XX XX XX XX"
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
                    placeholder="boutique@ciss-stmoise.ci"
                  />
                </div>
                <div>
                  <Label htmlFor="responsable">Responsable *</Label>
                  <Input
                    id="responsable"
                    value={formData.responsable}
                    onChange={(e) => setFormData({ ...formData, responsable: e.target.value })}
                    placeholder="Nom du responsable"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="surface">Surface (m²)</Label>
                  <Input
                    id="surface"
                    type="number"
                    value={formData.surface}
                    onChange={(e) => setFormData({ ...formData, surface: parseInt(e.target.value) || 0 })}
                    placeholder="150"
                    min="0"
                  />
                </div>
                <div>
                  <Label htmlFor="capacite_stock">Capacité stock</Label>
                  <Input
                    id="capacite_stock"
                    type="number"
                    value={formData.capacite_stock}
                    onChange={(e) => setFormData({ ...formData, capacite_stock: parseInt(e.target.value) || 0 })}
                    placeholder="500"
                    min="0"
                  />
                </div>
                <div>
                  <Label htmlFor="statut">Statut</Label>
                  <select
                    id="statut"
                    value={formData.statut}
                    onChange={(e) => setFormData({ ...formData, statut: e.target.value as Boutique["statut"] })}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit" className="bg-green-600 hover:bg-green-700">
                  {editingBoutique ? "Mettre à jour" : "Créer"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total boutiques</p>
                <p className="text-2xl font-bold text-green-600">{boutiques.length}</p>
              </div>
              <Store className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Actives</p>
                <p className="text-2xl font-bold text-green-600">
                  {boutiques.filter(b => b.statut === "active").length}
                </p>
              </div>
              <Store className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">En maintenance</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {boutiques.filter(b => b.statut === "maintenance").length}
                </p>
              </div>
              <Store className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Surface totale</p>
                <p className="text-2xl font-bold text-blue-600">
                  {boutiques.reduce((total, b) => total + b.surface, 0)} m²
                </p>
              </div>
              <MapPin className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Store className="mr-2 h-5 w-5" />
            Liste des Boutiques ({boutiques.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Ville</TableHead>
                <TableHead>Responsable</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {boutiques.map((boutique) => (
                <TableRow key={boutique.id}>
                  <TableCell className="font-medium">
                    {boutique.nom}
                    <div className="text-sm text-gray-500">{boutique.adresse}</div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getTypeBadgeColor(boutique.type)}>
                      {boutique.type}
                    </Badge>
                  </TableCell>
                  <TableCell>{boutique.ville}</TableCell>
                  <TableCell>{boutique.responsable}</TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm">
                      <Phone className="h-4 w-4 mr-1" />
                      {boutique.telephone}
                    </div>
                    {boutique.email && (
                      <div className="text-sm text-gray-500">{boutique.email}</div>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatutBadgeColor(boutique.statut)}>
                      {boutique.statut}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(boutique)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(boutique.id)}
                        className="text-red-600 hover:text-red-700"
                      >
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
    </div>
  );
}
