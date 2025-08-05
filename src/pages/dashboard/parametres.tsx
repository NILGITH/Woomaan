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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Edit, Trash2, Settings, Palette, Ruler } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { parametresService, Taille, Couleur } from "@/services/parametresService";

type FormDataTaille = {
  nom: string;
  code: string;
  description: string;
  categorie: Taille["categorie"];
  ordre: string;
};

export default function ParametresPage() {
  const [activeTab, setActiveTab] = useState("tailles");
  const [tailles, setTailles] = useState<Taille[]>([]);
  const [couleurs, setCouleurs] = useState<Couleur[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Taille | Couleur | null>(null);
  const { toast } = useToast();

  const [formDataTaille, setFormDataTaille] = useState<FormDataTaille>({
    nom: "",
    code: "",
    description: "",
    categorie: "unisexe",
    ordre: "1",
  });

  const [formDataCouleur, setFormDataCouleur] = useState({
    nom: "",
    code_hex: "#000000",
    code_rgb: "",
    description: "",
  });

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [taillesData, couleursData] = await Promise.all([
        parametresService.getTailles(),
        parametresService.getCouleurs(),
      ]);

      setTailles(taillesData);
      setCouleurs(couleursData);
    } catch (error) {
      console.error("Failed to load parametres:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les paramètres",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const resetForms = () => {
    setFormDataTaille({
      nom: "",
      code: "",
      description: "",
      categorie: "unisexe",
      ordre: "1",
    });
    setFormDataCouleur({
      nom: "",
      code_hex: "#000000",
      code_rgb: "",
      description: "",
    });
    setEditingItem(null);
  };

  const handleSubmitTaille = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const tailleData = {
        ...formDataTaille,
        ordre: parseInt(formDataTaille.ordre, 10) || 1,
        active: true,
      };

      if (editingItem && "code" in editingItem && "ordre" in editingItem) {
        const updatedTaille = await parametresService.updateTaille(editingItem.id, tailleData);
        setTailles(prev => prev.map(item =>
          item.id === editingItem.id ? updatedTaille : item
        ));
        toast({
          title: "Succès",
          description: "Taille modifiée avec succès",
        });
      } else {
        const newTaille = await parametresService.createTaille(tailleData);
        setTailles(prev => [...prev, newTaille]);
        toast({
          title: "Succès",
          description: "Taille créée avec succès",
        });
      }

      setDialogOpen(false);
      resetForms();
    } catch (error) {
      console.error("Failed to save taille:", error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder la taille",
        variant: "destructive",
      });
    }
  };

  const handleSubmitCouleur = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const couleurData = {
        ...formDataCouleur,
        active: true,
      };

      if (editingItem && "code_hex" in editingItem) {
        const updatedCouleur = await parametresService.updateCouleur(editingItem.id, couleurData);
        setCouleurs(prev => prev.map(item =>
          item.id === editingItem.id ? updatedCouleur : item
        ));
        toast({
          title: "Succès",
          description: "Couleur modifiée avec succès",
        });
      } else {
        const newCouleur = await parametresService.createCouleur(couleurData);
        setCouleurs(prev => [...prev, newCouleur]);
        toast({
          title: "Succès",
          description: "Couleur créée avec succès",
        });
      }

      setDialogOpen(false);
      resetForms();
    } catch (error) {
      console.error("Failed to save couleur:", error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder la couleur",
        variant: "destructive",
      });
    }
  };

  const handleEditTaille = (taille: Taille) => {
    setEditingItem(taille);
    setFormDataTaille({
      nom: taille.nom,
      code: taille.code,
      description: taille.description || "",
      categorie: taille.categorie,
      ordre: taille.ordre.toString(),
    });
    setDialogOpen(true);
  };

  const handleEditCouleur = (couleur: Couleur) => {
    setEditingItem(couleur);
    setFormDataCouleur({
      nom: couleur.nom,
      code_hex: couleur.code_hex,
      code_rgb: couleur.code_rgb || "",
      description: couleur.description || "",
    });
    setDialogOpen(true);
  };

  const handleDeleteTaille = async (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette taille ?")) {
      await parametresService.deleteTaille(id);
      setTailles(prev => prev.filter(item => item.id !== id));
      toast({
        title: "Succès",
        description: "Taille supprimée avec succès",
      });
    }
  };

  const handleDeleteCouleur = async (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette couleur ?")) {
      await parametresService.deleteCouleur(id);
      setCouleurs(prev => prev.filter(item => item.id !== id));
      toast({
        title: "Succès",
        description: "Couleur supprimée avec succès",
      });
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
            <CardTitle className="flex items-center">
              <Settings className="mr-2 h-5 w-5" />
              Paramètres des Articles
            </CardTitle>
            <CardDescription>
              Gérez les tailles, couleurs et déclinaisons de vos articles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="tailles" className="flex items-center">
                  <Ruler className="mr-2 h-4 w-4" />
                  Tailles
                </TabsTrigger>
                <TabsTrigger value="couleurs" className="flex items-center">
                  <Palette className="mr-2 h-4 w-4" />
                  Couleurs
                </TabsTrigger>
              </TabsList>

              <TabsContent value="tailles" className="space-y-4">
                <div className="flex justify-end">
                  <Dialog open={dialogOpen && activeTab === "tailles"} onOpenChange={(open) => { if (!open) resetForms(); setDialogOpen(open); }}>
                    <DialogTrigger asChild>
                      <Button onClick={() => { resetForms(); setActiveTab("tailles"); setDialogOpen(true); }}>
                        <Plus className="mr-2 h-4 w-4" />
                        Nouvelle taille
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>
                          {editingItem && "code" in editingItem ? "Modifier la taille" : "Nouvelle taille"}
                        </DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleSubmitTaille} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="nom-taille">Nom</Label>
                            <Input
                              id="nom-taille"
                              value={formDataTaille.nom}
                              onChange={(e) => setFormDataTaille({ ...formDataTaille, nom: e.target.value })}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="code-taille">Code</Label>
                            <Input
                              id="code-taille"
                              value={formDataTaille.code}
                              onChange={(e) => setFormDataTaille({ ...formDataTaille, code: e.target.value })}
                              required
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="description-taille">Description</Label>
                          <Textarea
                            id="description-taille"
                            value={formDataTaille.description}
                            onChange={(e) => setFormDataTaille({ ...formDataTaille, description: e.target.value })}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="categorie-taille">Catégorie</Label>
                            <Select value={formDataTaille.categorie} onValueChange={(value: Taille["categorie"]) => setFormDataTaille({ ...formDataTaille, categorie: value })}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="homme">Homme</SelectItem>
                                <SelectItem value="femme">Femme</SelectItem>
                                <SelectItem value="enfant">Enfant</SelectItem>
                                <SelectItem value="unisexe">Unisexe</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="ordre-taille">Ordre d'affichage</Label>
                            <Input
                              id="ordre-taille"
                              type="number"
                              value={formDataTaille.ordre}
                              onChange={(e) => setFormDataTaille({ ...formDataTaille, ordre: e.target.value })}
                              required
                            />
                          </div>
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                            Annuler
                          </Button>
                          <Button type="submit">
                            {editingItem && "code" in editingItem ? "Modifier" : "Créer"}
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nom</TableHead>
                      <TableHead>Code</TableHead>
                      <TableHead>Catégorie</TableHead>
                      <TableHead>Ordre</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tailles.sort((a, b) => a.ordre - b.ordre).map((taille) => (
                      <TableRow key={taille.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{taille.nom}</div>
                            {taille.description && (
                              <div className="text-sm text-gray-500">{taille.description}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{taille.code}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{taille.categorie}</Badge>
                        </TableCell>
                        <TableCell>{taille.ordre}</TableCell>
                        <TableCell>
                          <Badge className={taille.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                            {taille.active ? "Actif" : "Inactif"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline" onClick={() => handleEditTaille(taille)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleDeleteTaille(taille.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>

              <TabsContent value="couleurs" className="space-y-4">
                <div className="flex justify-end">
                  <Dialog open={dialogOpen && activeTab === "couleurs"} onOpenChange={(open) => { if (!open) resetForms(); setDialogOpen(open); }}>
                    <DialogTrigger asChild>
                      <Button onClick={() => { resetForms(); setActiveTab("couleurs"); setDialogOpen(true); }}>
                        <Plus className="mr-2 h-4 w-4" />
                        Nouvelle couleur
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>
                          {editingItem && "code_hex" in editingItem ? "Modifier la couleur" : "Nouvelle couleur"}
                        </DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleSubmitCouleur} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="nom-couleur">Nom</Label>
                            <Input
                              id="nom-couleur"
                              value={formDataCouleur.nom}
                              onChange={(e) => setFormDataCouleur({ ...formDataCouleur, nom: e.target.value })}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="code-hex">Code couleur (HEX)</Label>
                            <div className="flex space-x-2">
                              <Input
                                id="code-hex"
                                type="color"
                                value={formDataCouleur.code_hex}
                                onChange={(e) => setFormDataCouleur({ ...formDataCouleur, code_hex: e.target.value })}
                                className="w-16 h-10"
                                required
                              />
                              <Input
                                value={formDataCouleur.code_hex}
                                onChange={(e) => setFormDataCouleur({ ...formDataCouleur, code_hex: e.target.value })}
                                placeholder="#000000"
                                className="flex-1"
                              />
                            </div>
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="code-rgb">Code RGB (optionnel)</Label>
                          <Input
                            id="code-rgb"
                            value={formDataCouleur.code_rgb}
                            onChange={(e) => setFormDataCouleur({ ...formDataCouleur, code_rgb: e.target.value })}
                            placeholder="255,0,0"
                          />
                        </div>
                        <div>
                          <Label htmlFor="description-couleur">Description</Label>
                          <Textarea
                            id="description-couleur"
                            value={formDataCouleur.description}
                            onChange={(e) => setFormDataCouleur({ ...formDataCouleur, description: e.target.value })}
                          />
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                            Annuler
                          </Button>
                          <Button type="submit">
                            {editingItem && "code_hex" in editingItem ? "Modifier" : "Créer"}
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Couleur</TableHead>
                      <TableHead>Nom</TableHead>
                      <TableHead>Code HEX</TableHead>
                      <TableHead>Code RGB</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {couleurs.map((couleur) => (
                      <TableRow key={couleur.id}>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <div
                              className="w-6 h-6 rounded border"
                              style={{ backgroundColor: couleur.code_hex }}
                            />
                            <span>{couleur.nom}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{couleur.nom}</div>
                            {couleur.description && (
                              <div className="text-sm text-gray-500">{couleur.description}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{couleur.code_hex}</Badge>
                        </TableCell>
                        <TableCell>{couleur.code_rgb || "-"}</TableCell>
                        <TableCell>
                          <Badge className={couleur.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                            {couleur.active ? "Actif" : "Inactif"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline" onClick={() => handleEditCouleur(couleur)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleDeleteCouleur(couleur.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
