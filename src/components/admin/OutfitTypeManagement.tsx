import { useState, useEffect, useCallback } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Package } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TypeVetement {
  id: string;
  nom: string;
  description: string;
  difficulte: "facile" | "moyen" | "difficile";
  temps_moyen: number;
  prix_base: number;
  actif: boolean;
  created_at: string;
}

interface FormData {
  nom: string;
  description: string;
  difficulte: "facile" | "moyen" | "difficile";
  temps_moyen: number;
  prix_base: number;
  actif: boolean;
}

export default function OutfitTypeManagement() {
  const [types, setTypes] = useState<TypeVetement[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingType, setEditingType] = useState<TypeVetement | null>(null);
  const [formData, setFormData] = useState<FormData>({
    nom: "",
    description: "",
    difficulte: "moyen",
    temps_moyen: 0,
    prix_base: 0,
    actif: true,
  });
  const { toast } = useToast();

  const loadTypes = useCallback(async () => {
    setLoading(true);
    try {
      // Simulation des données
      const mockTypes: TypeVetement[] = [
        {
          id: "1",
          nom: "Boubou Traditionnel",
          description: "Vêtement traditionnel ample et élégant",
          difficulte: "moyen",
          temps_moyen: 8,
          prix_base: 25000,
          actif: true,
          created_at: new Date().toISOString(),
        },
        {
          id: "2",
          nom: "Dashiki",
          description: "Tunique traditionnelle colorée",
          difficulte: "facile",
          temps_moyen: 4,
          prix_base: 15000,
          actif: true,
          created_at: new Date().toISOString(),
        },
        {
          id: "3",
          nom: "Costume Complet",
          description: "Costume moderne sur mesure",
          difficulte: "difficile",
          temps_moyen: 16,
          prix_base: 45000,
          actif: true,
          created_at: new Date().toISOString(),
        },
      ];
      setTypes(mockTypes);
    } catch (error) {
      console.error("Erreur lors du chargement:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les types de vêtements",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadTypes();
  }, [loadTypes]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingType) {
        // Mise à jour
        const updatedType: TypeVetement = {
          ...editingType,
          ...formData,
        };
        setTypes(prev => prev.map(type => type.id === editingType.id ? updatedType : type));
        toast({
          title: "Succès",
          description: "Type de vêtement mis à jour avec succès",
        });
      } else {
        // Création
        const newType: TypeVetement = {
          id: Date.now().toString(),
          ...formData,
          created_at: new Date().toISOString(),
        };
        setTypes(prev => [newType, ...prev]);
        toast({
          title: "Succès",
          description: "Type de vêtement créé avec succès",
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

  const handleEdit = (type: TypeVetement) => {
    setEditingType(type);
    setFormData({
      nom: type.nom,
      description: type.description,
      difficulte: type.difficulte,
      temps_moyen: type.temps_moyen,
      prix_base: type.prix_base,
      actif: type.actif,
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce type de vêtement ?")) {
      try {
        setTypes(prev => prev.filter(type => type.id !== id));
        toast({
          title: "Succès",
          description: "Type de vêtement supprimé avec succès",
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
      difficulte: "moyen",
      temps_moyen: 0,
      prix_base: 0,
      actif: true,
    });
    setEditingType(null);
  };

  const getDifficulteBadgeColor = (difficulte: string) => {
    switch (difficulte) {
      case "facile": return "bg-green-100 text-green-800";
      case "moyen": return "bg-yellow-100 text-yellow-800";
      case "difficile": return "bg-red-100 text-red-800";
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
          <h2 className="text-2xl font-bold text-gray-900">Types de Vêtements</h2>
          <p className="text-gray-600">Gérez les différents types de vêtements proposés</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="bg-green-600 hover:bg-green-700">
              <Plus className="mr-2 h-4 w-4" />
              Nouveau Type
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingType ? "Modifier le Type" : "Nouveau Type de Vêtement"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nom">Nom du type *</Label>
                  <Input
                    id="nom"
                    value={formData.nom}
                    onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                    placeholder="Ex: Boubou Traditionnel"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="difficulte">Difficulté</Label>
                  <select
                    id="difficulte"
                    value={formData.difficulte}
                    onChange={(e) => setFormData({ ...formData, difficulte: e.target.value as TypeVetement["difficulte"] })}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="facile">Facile</option>
                    <option value="moyen">Moyen</option>
                    <option value="difficile">Difficile</option>
                  </select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Description du type de vêtement"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="temps_moyen">Temps moyen (heures)</Label>
                  <Input
                    id="temps_moyen"
                    type="number"
                    value={formData.temps_moyen}
                    onChange={(e) => setFormData({ ...formData, temps_moyen: parseInt(e.target.value) || 0 })}
                    placeholder="8"
                    min="0"
                  />
                </div>
                <div>
                  <Label htmlFor="prix_base">Prix de base (FCFA)</Label>
                  <Input
                    id="prix_base"
                    type="number"
                    value={formData.prix_base}
                    onChange={(e) => setFormData({ ...formData, prix_base: parseInt(e.target.value) || 0 })}
                    placeholder="25000"
                    min="0"
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
                <Label htmlFor="actif">Type actif</Label>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit" className="bg-green-600 hover:bg-green-700">
                  {editingType ? "Mettre à jour" : "Créer"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Package className="mr-2 h-5 w-5" />
            Liste des Types ({types.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Difficulté</TableHead>
                <TableHead>Temps (h)</TableHead>
                <TableHead>Prix de base</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {types.map((type) => (
                <TableRow key={type.id}>
                  <TableCell className="font-medium">{type.nom}</TableCell>
                  <TableCell className="max-w-xs truncate">{type.description}</TableCell>
                  <TableCell>
                    <Badge className={getDifficulteBadgeColor(type.difficulte)}>
                      {type.difficulte}
                    </Badge>
                  </TableCell>
                  <TableCell>{type.temps_moyen}h</TableCell>
                  <TableCell>{type.prix_base.toLocaleString()} FCFA</TableCell>
                  <TableCell>
                    <Badge variant={type.actif ? "default" : "secondary"}>
                      {type.actif ? "Actif" : "Inactif"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(type)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(type.id)}
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
