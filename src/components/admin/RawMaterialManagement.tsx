
import { useState, useEffect, useCallback } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Package2, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MatierePremiere {
  id: string;
  nom: string;
  description: string;
  unite: string;
  prix_unitaire: number;
  stock_actuel: number;
  stock_minimum: number;
  fournisseur: string;
  couleur?: string;
  actif: boolean;
  created_at: string;
}

export default function RawMaterialManagement() {
  const [matieres, setMatieres] = useState<MatierePremiere[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMatiere, setEditingMatiere] = useState<MatierePremiere | null>(null);
  const [formData, setFormData] = useState({
    nom: "",
    description: "",
    unite: "mètre",
    prix_unitaire: 0,
    stock_actuel: 0,
    stock_minimum: 0,
    fournisseur: "",
    couleur: "",
    actif: true,
  });
  const { toast } = useToast();

  const loadMatieres = useCallback(async () => {
    setLoading(true);
    try {
      // Simulation des données
      const mockMatieres: MatierePremiere[] = [
        {
          id: "1",
          nom: "Tissu Wax Premium",
          description: "Tissu traditionnel africain de haute qualité",
          unite: "mètre",
          prix_unitaire: 3500,
          stock_actuel: 45,
          stock_minimum: 10,
          fournisseur: "Fournisseur Abidjan",
          couleur: "Multicolore",
          actif: true,
          created_at: new Date().toISOString(),
        },
        {
          id: "2",
          nom: "Fil de Couture",
          description: "Fil polyester résistant",
          unite: "bobine",
          prix_unitaire: 500,
          stock_actuel: 8,
          stock_minimum: 15,
          fournisseur: "Mercerie Centrale",
          couleur: "Blanc",
          actif: true,
          created_at: new Date().toISOString(),
        },
        {
          id: "3",
          nom: "Boutons Dorés",
          description: "Boutons décoratifs dorés",
          unite: "pièce",
          prix_unitaire: 150,
          stock_actuel: 120,
          stock_minimum: 50,
          fournisseur: "Accessoires Mode",
          actif: true,
          created_at: new Date().toISOString(),
        },
      ];
      setMatieres(mockMatieres);
    } catch (error) {
      console.error("Erreur lors du chargement:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les matières premières",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadMatieres();
  }, [loadMatieres]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingMatiere) {
        // Mise à jour
        const updatedMatiere: MatierePremiere = {
          ...editingMatiere,
          ...formData,
        };
        setMatieres(prev => prev.map(matiere => matiere.id === editingMatiere.id ? updatedMatiere : matiere));
        toast({
          title: "Succès",
          description: "Matière première mise à jour avec succès",
        });
      } else {
        // Création
        const newMatiere: MatierePremiere = {
          id: Date.now().toString(),
          ...formData,
          created_at: new Date().toISOString(),
        };
        setMatieres(prev => [newMatiere, ...prev]);
        toast({
          title: "Succès",
          description: "Matière première créée avec succès",
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

  const handleEdit = (matiere: MatierePremiere) => {
    setEditingMatiere(matiere);
    setFormData({
      nom: matiere.nom,
      description: matiere.description,
      unite: matiere.unite,
      prix_unitaire: matiere.prix_unitaire,
      stock_actuel: matiere.stock_actuel,
      stock_minimum: matiere.stock_minimum,
      fournisseur: matiere.fournisseur,
      couleur: matiere.couleur || "",
      actif: matiere.actif,
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette matière première ?")) {
      try {
        setMatieres(prev => prev.filter(matiere => matiere.id !== id));
        toast({
          title: "Succès",
          description: "Matière première supprimée avec succès",
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
      description: "",
      unite: "mètre",
      prix_unitaire: 0,
      stock_actuel: 0,
      stock_minimum: 0,
      fournisseur: "",
      couleur: "",
      actif: true,
    });
    setEditingMatiere(null);
  };

  const getStockStatus = (matiere: MatierePremiere) => {
    if (matiere.stock_actuel <= matiere.stock_minimum) {
      return { status: "critique", color: "bg-red-100 text-red-800" };
    } else if (matiere.stock_actuel <= matiere.stock_minimum * 1.5) {
      return { status: "faible", color: "bg-yellow-100 text-yellow-800" };
    }
    return { status: "normal", color: "bg-green-100 text-green-800" };
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
          <h2 className="text-2xl font-bold text-gray-900">Matières Premières</h2>
          <p className="text-gray-600">Gérez votre stock de matières premières et fournitures</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="bg-green-600 hover:bg-green-700">
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle Matière
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingMatiere ? "Modifier la Matière" : "Nouvelle Matière Première"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nom">Nom de la matière *</Label>
                  <Input
                    id="nom"
                    value={formData.nom}
                    onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                    placeholder="Ex: Tissu Wax Premium"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="unite">Unité de mesure</Label>
                  <select
                    id="unite"
                    value={formData.unite}
                    onChange={(e) => setFormData({ ...formData, unite: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="mètre">Mètre</option>
                    <option value="pièce">Pièce</option>
                    <option value="bobine">Bobine</option>
                    <option value="kg">Kilogramme</option>
                    <option value="litre">Litre</option>
                  </select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Description de la matière première"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="prix_unitaire">Prix unitaire (FCFA)</Label>
                  <Input
                    id="prix_unitaire"
                    type="number"
                    value={formData.prix_unitaire}
                    onChange={(e) => setFormData({ ...formData, prix_unitaire: parseInt(e.target.value) || 0 })}
                    placeholder="3500"
                    min="0"
                  />
                </div>
                <div>
                  <Label htmlFor="fournisseur">Fournisseur</Label>
                  <Input
                    id="fournisseur"
                    value={formData.fournisseur}
                    onChange={(e) => setFormData({ ...formData, fournisseur: e.target.value })}
                    placeholder="Nom du fournisseur"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="stock_actuel">Stock actuel</Label>
                  <Input
                    id="stock_actuel"
                    type="number"
                    value={formData.stock_actuel}
                    onChange={(e) => setFormData({ ...formData, stock_actuel: parseInt(e.target.value) || 0 })}
                    placeholder="45"
                    min="0"
                  />
                </div>
                <div>
                  <Label htmlFor="stock_minimum">Stock minimum</Label>
                  <Input
                    id="stock_minimum"
                    type="number"
                    value={formData.stock_minimum}
                    onChange={(e) => setFormData({ ...formData, stock_minimum: parseInt(e.target.value) || 0 })}
                    placeholder="10"
                    min="0"
                  />
                </div>
                <div>
                  <Label htmlFor="couleur">Couleur (optionnel)</Label>
                  <Input
                    id="couleur"
                    value={formData.couleur}
                    onChange={(e) => setFormData({ ...formData, couleur: e.target.value })}
                    placeholder="Rouge, Bleu..."
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="actif"
                  checked={formData.actif}
                  onChange={(e) => setFormData({ ...formData, actif: e.target.checked })}
                  className="rounded"
                />
                <Label htmlFor="actif">Matière active</Label>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit" className="bg-green-600 hover:bg-green-700">
                  {editingMatiere ? "Mettre à jour" : "Créer"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Alertes stock */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Stock critique</p>
                <p className="text-2xl font-bold text-red-600">
                  {matieres.filter(m => m.stock_actuel <= m.stock_minimum).length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Stock faible</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {matieres.filter(m => m.stock_actuel > m.stock_minimum && m.stock_actuel <= m.stock_minimum * 1.5).length}
                </p>
              </div>
              <Package2 className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total matières</p>
                <p className="text-2xl font-bold text-green-600">{matieres.length}</p>
              </div>
              <Package2 className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Package2 className="mr-2 h-5 w-5" />
            Liste des Matières ({matieres.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Prix unitaire</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Statut stock</TableHead>
                <TableHead>Fournisseur</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {matieres.map((matiere) => {
                const stockStatus = getStockStatus(matiere);
                return (
                  <TableRow key={matiere.id}>
                    <TableCell className="font-medium">
                      {matiere.nom}
                      {matiere.couleur && (
                        <span className="text-sm text-gray-500 block">{matiere.couleur}</span>
                      )}
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{matiere.description}</TableCell>
                    <TableCell>{matiere.prix_unitaire.toLocaleString()} FCFA/{matiere.unite}</TableCell>
                    <TableCell>
                      {matiere.stock_actuel} {matiere.unite}
                      <span className="text-sm text-gray-500 block">Min: {matiere.stock_minimum}</span>
                    </TableCell>
                    <TableCell>
                      <Badge className={stockStatus.color}>
                        {stockStatus.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{matiere.fournisseur}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(matiere)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(matiere.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
