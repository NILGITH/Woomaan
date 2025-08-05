import { useState, useEffect, useCallback } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Edit, Ruler } from "lucide-react";
import { commandeService, type TypeMesure } from "@/services/commandeService";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/layout/DashboardLayout";

export default function MesuresPage() {
  const [typesMesures, setTypesMesures] = useState<TypeMesure[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingType, setEditingType] = useState<TypeMesure | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    nom: "",
    description: "",
    unite: "cm",
    categorie: "femme",
    obligatoire: false,
    ordre_affichage: 0,
  });

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await commandeService.getTypesMesures();
      setTypesMesures(data);
    } catch (error) {
      console.error("Failed to load ", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les types de mesures",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingType) {
        await commandeService.updateTypeMesure(editingType.id, formData);
        toast({
          title: "Succès",
          description: "Type de mesure modifié avec succès",
        });
      } else {
        await commandeService.createTypeMesure(formData);
        toast({
          title: "Succès",
          description: "Type de mesure créé avec succès",
        });
      }

      setDialogOpen(false);
      resetForm();
      await loadData();
    } catch (error) {
      console.error("Failed to save type mesure:", error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder le type de mesure",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (type: TypeMesure) => {
    setEditingType(type);
    setFormData({
      nom: type.nom,
      description: type.description || "",
      unite: type.unite,
      categorie: type.categorie,
      obligatoire: type.obligatoire,
      ordre_affichage: type.ordre_affichage,
    });
    setDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      nom: "",
      description: "",
      unite: "cm",
      categorie: "femme",
      obligatoire: false,
      ordre_affichage: 0,
    });
    setEditingType(null);
  };

  const getCategorieColor = (categorie: string) => {
    switch (categorie) {
      case "femme": return "bg-pink-100 text-pink-800";
      case "homme": return "bg-blue-100 text-blue-800";
      case "enfant": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div>Chargement...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex items-center">
                  <Ruler className="mr-2 h-5 w-5" />
                  Gestion des Types de Mesures
                </CardTitle>
                <CardDescription>
                  Configurez les différents types de mesures pour vos produits
                </CardDescription>
              </div>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={resetForm}>
                    <Plus className="mr-2 h-4 w-4" />
                    Nouveau type de mesure
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {editingType ? "Modifier le type de mesure" : "Nouveau type de mesure"}
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="nom">Nom de la mesure</Label>
                        <Input
                          id="nom"
                          value={formData.nom}
                          onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                          required
                          placeholder="Ex: Tour de poitrine"
                        />
                      </div>
                      <div>
                        <Label htmlFor="unite">Unité</Label>
                        <Select value={formData.unite} onValueChange={(value) => setFormData({ ...formData, unite: value })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cm">Centimètres (cm)</SelectItem>
                            <SelectItem value="mm">Millimètres (mm)</SelectItem>
                            <SelectItem value="m">Mètres (m)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Description de la mesure et comment la prendre..."
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="categorie">Catégorie</Label>
                        <Select value={formData.categorie} onValueChange={(value) => setFormData({ ...formData, categorie: value })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="femme">Femme</SelectItem>
                            <SelectItem value="homme">Homme</SelectItem>
                            <SelectItem value="enfant">Enfant</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="ordre">Ordre d'affichage</Label>
                        <Input
                          id="ordre"
                          type="number"
                          value={formData.ordre_affichage}
                          onChange={(e) => setFormData({ ...formData, ordre_affichage: parseInt(e.target.value) || 0 })}
                        />
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="obligatoire"
                        checked={formData.obligatoire}
                        onCheckedChange={(checked) => setFormData({ ...formData, obligatoire: !!checked })}
                      />
                      <Label htmlFor="obligatoire">Mesure obligatoire</Label>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                        Annuler
                      </Button>
                      <Button type="submit">
                        {editingType ? "Modifier" : "Créer"}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {["femme", "homme", "enfant"].map((categorie) => (
                <Card key={categorie}>
                  <CardHeader>
                    <CardTitle className="capitalize flex items-center">
                      <Badge className={getCategorieColor(categorie)}>
                        {categorie}
                      </Badge>
                      <span className="ml-2">
                        {typesMesures.filter(t => t.categorie === categorie).length} mesures
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {typesMesures
                        .filter(type => type.categorie === categorie)
                        .sort((a, b) => a.ordre_affichage - b.ordre_affichage)
                        .map((type) => (
                          <div key={type.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <span className="font-medium">{type.nom}</span>
                                <span className="text-sm text-gray-500">({type.unite})</span>
                                {type.obligatoire && (
                                  <Badge variant="destructive" className="text-xs">
                                    Obligatoire
                                  </Badge>
                                )}
                              </div>
                              {type.description && (
                                <p className="text-sm text-gray-600 mt-1">{type.description}</p>
                              )}
                            </div>
                            <div className="flex space-x-1">
                              <Button size="sm" variant="outline" onClick={() => handleEdit(type)}>
                                <Edit className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
