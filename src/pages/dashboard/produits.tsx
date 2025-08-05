import { useState, useEffect, useCallback } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Trash2, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { produitService, type Produit, type CategorieProduit } from "@/services/produitService";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/layout/DashboardLayout";

export default function ProduitsPage() {
  const [produits, setProduits] = useState<Produit[]>([]);
  const [categories, setCategories] = useState<CategorieProduit[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [categorieDialogOpen, setCategorieDialogOpen] = useState(false);
  const [editingProduit, setEditingProduit] = useState<Produit | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    nom: "",
    description: "",
    prix_base: "",
    categorie_id: "",
    image_url: "",
    temps_confection: "",
    difficulte: "moyen",
  });

  const [categorieFormData, setCategorieFormData] = useState({
    nom: "",
    description: "",
    image_url: "",
  });

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [produitsData, categoriesData] = await Promise.all([
        produitService.getProduits(),
        produitService.getCategories(),
      ]);
      setProduits(produitsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error("Failed to load ", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSubmitProduit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const produitData = {
        ...formData,
        prix_base: parseFloat(formData.prix_base),
        temps_confection: formData.temps_confection ? parseInt(formData.temps_confection) : undefined,
        actif: true,
      };

      if (editingProduit) {
        await produitService.updateProduit(editingProduit.id, produitData);
        toast({
          title: "Succès",
          description: "Produit modifié avec succès",
        });
      } else {
        await produitService.createProduit(produitData);
        toast({
          title: "Succès",
          description: "Produit créé avec succès",
        });
      }

      setDialogOpen(false);
      resetForm();
      await loadData();
    } catch (error) {
      console.error("Failed to save produit:", error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder le produit",
        variant: "destructive",
      });
    }
  };

  const handleSubmitCategorie = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await produitService.createCategorie({
        ...categorieFormData,
        actif: true,
      });
      
      toast({
        title: "Succès",
        description: "Catégorie créée avec succès",
      });
      
      setCategorieDialogOpen(false);
      resetCategorieForm();
      await loadData();
    } catch (error) {
      console.error("Failed to create categorie:", error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la catégorie",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (produit: Produit) => {
    setEditingProduit(produit);
    setFormData({
      nom: produit.nom,
      description: produit.description || "",
      prix_base: produit.prix_base.toString(),
      categorie_id: produit.categorie_id || "",
      image_url: produit.image_url || "",
      temps_confection: produit.temps_confection?.toString() || "",
      difficulte: produit.difficulte,
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) {
      try {
        await produitService.deleteProduit(id);
        toast({
          title: "Succès",
          description: "Produit supprimé avec succès",
        });
        await loadData();
      } catch (error) {
        console.error("Failed to delete produit:", error);
        toast({
          title: "Erreur",
          description: "Impossible de supprimer le produit",
          variant: "destructive",
        });
      }
    }
  };

  const resetForm = () => {
    setFormData({
      nom: "",
      description: "",
      prix_base: "",
      categorie_id: "",
      image_url: "",
      temps_confection: "",
      difficulte: "moyen",
    });
    setEditingProduit(null);
  };

  const resetCategorieForm = () => {
    setCategorieFormData({
      nom: "",
      description: "",
      image_url: "",
    });
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
                <CardTitle>Gestion des Produits</CardTitle>
                <CardDescription>Gérez votre catalogue de produits et services</CardDescription>
              </div>
              <div className="flex space-x-2">
                <Dialog open={categorieDialogOpen} onOpenChange={setCategorieDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" onClick={resetCategorieForm}>
                      <Plus className="mr-2 h-4 w-4" />
                      Nouvelle catégorie
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Nouvelle Catégorie</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmitCategorie} className="space-y-4">
                      <div>
                        <Label htmlFor="nom_categorie">Nom de la catégorie</Label>
                        <Input
                          id="nom_categorie"
                          value={categorieFormData.nom}
                          onChange={(e) => setCategorieFormData({ ...categorieFormData, nom: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="description_categorie">Description</Label>
                        <Textarea
                          id="description_categorie"
                          value={categorieFormData.description}
                          onChange={(e) => setCategorieFormData({ ...categorieFormData, description: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="image_categorie">URL de l'image</Label>
                        <Input
                          id="image_categorie"
                          type="url"
                          value={categorieFormData.image_url}
                          onChange={(e) => setCategorieFormData({ ...categorieFormData, image_url: e.target.value })}
                        />
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button type="button" variant="outline" onClick={() => setCategorieDialogOpen(false)}>
                          Annuler
                        </Button>
                        <Button type="submit">Créer</Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>

                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={resetForm}>
                      <Plus className="mr-2 h-4 w-4" />
                      Nouveau produit
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>
                        {editingProduit ? "Modifier le produit" : "Nouveau produit"}
                      </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmitProduit} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="nom">Nom du produit</Label>
                          <Input
                            id="nom"
                            value={formData.nom}
                            onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="prix">Prix de base (FCFA)</Label>
                          <Input
                            id="prix"
                            type="number"
                            value={formData.prix_base}
                            onChange={(e) => setFormData({ ...formData, prix_base: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="categorie">Catégorie</Label>
                          <Select value={formData.categorie_id} onValueChange={(value) => setFormData({ ...formData, categorie_id: value })}>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner une catégorie" />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map((categorie) => (
                                <SelectItem key={categorie.id} value={categorie.id}>
                                  {categorie.nom}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="difficulte">Difficulté</Label>
                          <Select value={formData.difficulte} onValueChange={(value) => setFormData({ ...formData, difficulte: value })}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="facile">Facile</SelectItem>
                              <SelectItem value="moyen">Moyen</SelectItem>
                              <SelectItem value="difficile">Difficile</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="temps">Temps de confection (heures)</Label>
                          <Input
                            id="temps"
                            type="number"
                            value={formData.temps_confection}
                            onChange={(e) => setFormData({ ...formData, temps_confection: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="image">URL de l'image</Label>
                          <Input
                            id="image"
                            type="url"
                            value={formData.image_url}
                            onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                          Annuler
                        </Button>
                        <Button type="submit">
                          {editingProduit ? "Modifier" : "Créer"}
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produit</TableHead>
                  <TableHead>Catégorie</TableHead>
                  <TableHead>Prix</TableHead>
                  <TableHead>Difficulté</TableHead>
                  <TableHead>Temps</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {produits.map((produit) => (
                  <TableRow key={produit.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        {produit.image_url ? (
                          <Image src={produit.image_url} alt={produit.nom} width={40} height={40} className="w-10 h-10 rounded object-cover" />
                        ) : (
                          <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
                            <ImageIcon className="h-5 w-5 text-gray-400" />
                          </div>
                        )}
                        <div>
                          <div className="font-medium">{produit.nom}</div>
                          <div className="text-sm text-gray-500">{produit.description}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{produit.categorie?.nom || "N/A"}</TableCell>
                    <TableCell>{produit.prix_base.toLocaleString()} FCFA</TableCell>
                    <TableCell>
                      <Badge className={getDifficulteBadgeColor(produit.difficulte)}>
                        {produit.difficulte}
                      </Badge>
                    </TableCell>
                    <TableCell>{produit.temps_confection ? `${produit.temps_confection}h` : "N/A"}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" onClick={() => handleEdit(produit)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDelete(produit.id)}>
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
    </DashboardLayout>
  );
}
