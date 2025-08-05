import { useState, useEffect, useCallback } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Edit, Trash2, Calendar, Palette, BookOpen, Upload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { collectionsService, Collection, CollectionInsert } from "@/services/collectionsService";
import { storageService } from "@/services/storageService";
import Image from "next/image";

type CollectionFormData = {
  nom: string;
  description: string;
  saison: Collection["saison"];
  periode: Collection["periode"];
  type_evenement?: Collection["type_evenement"];
  couleurs_dominantes: string[];
  tissus_recommandes: string[];
  prix_min?: number;
  prix_max?: number;
  image_url: string;
  date_debut: string;
  date_fin: string;
  histoire: string;
  inspiration: string;
};

export default function CollectionsPage() {
  const [activeTab, setActiveTab] = useState("collections");
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState<CollectionFormData>({
    nom: "",
    description: "",
    saison: "toute_annee",
    periode: "toute_annee",
    type_evenement: undefined,
    couleurs_dominantes: [],
    tissus_recommandes: [],
    prix_min: undefined,
    prix_max: undefined,
    image_url: "",
    date_debut: "",
    date_fin: "",
    histoire: "",
    inspiration: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [newCouleur, setNewCouleur] = useState("#000000");
  const [newTissu, setNewTissu] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const collectionsData = await collectionsService.getCollections();
      setCollections(collectionsData);
    } catch (error) {
      console.error("Failed to load collections:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les collections",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const resetForm = () => {
    setFormData({
      nom: "",
      description: "",
      saison: "toute_annee",
      periode: "toute_annee",
      type_evenement: undefined,
      couleurs_dominantes: [],
      tissus_recommandes: [],
      prix_min: undefined,
      prix_max: undefined,
      image_url: "",
      date_debut: "",
      date_fin: "",
      histoire: "",
      inspiration: "",
    });
    setImageFile(null);
    setImagePreview("");
    setEditingCollection(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
        setFormData({ ...formData, image_url: "" });
    }
  };

  const handleImageUrlChange = (url: string) => {
    setFormData({ ...formData, image_url: url });
    setImagePreview(url);
    setImageFile(null);
  };

  const addCouleur = () => {
    if (newCouleur && !formData.couleurs_dominantes.includes(newCouleur)) {
      setFormData({
        ...formData,
        couleurs_dominantes: [...formData.couleurs_dominantes, newCouleur]
      });
    }
  };

  const removeCouleur = (couleur: string) => {
    setFormData({
      ...formData,
      couleurs_dominantes: formData.couleurs_dominantes.filter(c => c !== couleur)
    });
  };

  const addTissu = () => {
    if (newTissu.trim() && !formData.tissus_recommandes.includes(newTissu.trim())) {
      setFormData({
        ...formData,
        tissus_recommandes: [...formData.tissus_recommandes, newTissu.trim()]
      });
      setNewTissu("");
    }
  };

  const removeTissu = (tissu: string) => {
    setFormData({
      ...formData,
      tissus_recommandes: formData.tissus_recommandes.filter(t => t !== tissu)
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    try {
      let imageUrl = formData.image_url;
      if (imageFile) {
        imageUrl = await storageService.uploadCollectionImage(imageFile);
      }

      if (!imageUrl) {
        toast({
          title: "Erreur",
          description: "Veuillez fournir une image pour la collection.",
          variant: "destructive",
        });
        setIsUploading(false);
        return;
      }

      const collectionData: CollectionInsert = {
        nom: formData.nom,
        description: formData.description,
        saison: formData.saison,
        periode: formData.periode,
        type_evenement: formData.type_evenement,
        couleurs_dominantes: formData.couleurs_dominantes,
        tissus_recommandes: formData.tissus_recommandes,
        prix_min: formData.prix_min,
        prix_max: formData.prix_max,
        image_url: imageUrl,
        date_debut: formData.date_debut,
        date_fin: formData.date_fin,
        histoire: formData.histoire,
        inspiration: formData.inspiration,
        active: true,
        articles_ids: editingCollection ? editingCollection.articles_ids : []
      };

      if (editingCollection) {
        const updatedCollection = await collectionsService.updateCollection(editingCollection.id, collectionData);
        if (updatedCollection) {
          setCollections(prev => prev.map(c => c.id === editingCollection.id ? updatedCollection : c));
          toast({
            title: "Succès",
            description: "Collection modifiée avec succès",
          });
        }
      } else {
        const newCollection = await collectionsService.createCollection(collectionData);
        if (newCollection) {
          setCollections(prev => [newCollection, ...prev]);
          toast({
            title: "Succès",
            description: "Collection créée avec succès",
          });
        }
      }
      setDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error("Failed to save collection:", error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder la collection. Assurez-vous que le compartiment de stockage 'images' existe et est public.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleEdit = (collection: Collection) => {
    setEditingCollection(collection);
    setFormData({
      nom: collection.nom,
      description: collection.description || "",
      saison: collection.saison,
      periode: collection.periode,
      type_evenement: collection.type_evenement,
      couleurs_dominantes: collection.couleurs_dominantes,
      tissus_recommandes: collection.tissus_recommandes,
      prix_min: collection.prix_min,
      prix_max: collection.prix_max,
      image_url: collection.image_url || "",
      date_debut: collection.date_debut || "",
      date_fin: collection.date_fin || "",
      histoire: collection.histoire || "",
      inspiration: collection.inspiration || "",
    });
    setImagePreview(collection.image_url || "");
    setImageFile(null);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette collection ?")) {
      await collectionsService.deleteCollection(id);
      setCollections(prev => prev.filter(c => c.id !== id));
      toast({
        title: "Succès",
        description: "Collection supprimée avec succès",
      });
    }
  };

  const getSaisonLabel = (saison: string) => {
    const saisons = {
      "saison_seche": "Saison sèche",
      "saison_pluies": "Saison des pluies",
      "harmattan": "Harmattan",
      "toute_annee": "Toute l'année"
    };
    return saisons[saison as keyof typeof saisons] || saison;
  };

  const getEvenementLabel = (evenement?: string | null) => {
    if (!evenement) return "-";
    const evenements = {
      "mariage": "Mariage",
      "bapteme": "Baptême",
      "fete_nationale": "Fête nationale",
      "nouvel_an": "Nouvel An",
      "paques": "Pâques",
      "ramadan": "Ramadan",
      "tabaski": "Tabaski",
      "fete_generation": "Fête de génération",
      "ceremonie_traditionnelle": "Cérémonie traditionnelle",
      "autre": "Autre",
      "quotidien": "Quotidien"
    };
    return evenements[evenement as keyof typeof evenements] || evenement;
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
              <Calendar className="mr-2 h-5 w-5" />
              Gestion des Collections
            </CardTitle>
            <CardDescription>
              Gérez vos collections saisonnières et thématiques - {collections.length} collections créées
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="collections" className="flex items-center">
                  <Palette className="mr-2 h-4 w-4" />
                  Collections
                </TabsTrigger>
                <TabsTrigger value="histoires" className="flex items-center">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Histoires
                </TabsTrigger>
              </TabsList>

              <TabsContent value="collections" className="space-y-4">
                <div className="flex justify-end">
                  <Dialog open={dialogOpen} onOpenChange={(isOpen) => {
                      setDialogOpen(isOpen);
                      if (!isOpen) resetForm();
                  }}>
                    <DialogTrigger asChild>
                      <Button onClick={() => setDialogOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Nouvelle collection
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>
                          {editingCollection ? "Modifier la collection" : "Nouvelle collection"}
                        </DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleSubmit} className="space-y-4 p-1">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="nom">Nom de la collection</Label>
                            <Input
                              id="nom"
                              value={formData.nom}
                              onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="saison">Saison</Label>
                            <Select value={formData.saison} onValueChange={(value: Collection["saison"]) => setFormData({ ...formData, saison: value })}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="saison_seche">Saison sèche</SelectItem>
                                <SelectItem value="saison_pluies">Saison des pluies</SelectItem>
                                <SelectItem value="harmattan">Harmattan</SelectItem>
                                <SelectItem value="toute_annee">Toute l'année</SelectItem>
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
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="periode">Période</Label>
                            <Select value={formData.periode} onValueChange={(value: Collection["periode"]) => setFormData({ ...formData, periode: value })}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="janvier">Janvier</SelectItem>
                                <SelectItem value="fevrier">Février</SelectItem>
                                <SelectItem value="mars">Mars</SelectItem>
                                <SelectItem value="avril">Avril</SelectItem>
                                <SelectItem value="mai">Mai</SelectItem>
                                <SelectItem value="juin">Juin</SelectItem>
                                <SelectItem value="juillet">Juillet</SelectItem>
                                <SelectItem value="aout">Août</SelectItem>
                                <SelectItem value="septembre">Septembre</SelectItem>
                                <SelectItem value="octobre">Octobre</SelectItem>
                                <SelectItem value="novembre">Novembre</SelectItem>
                                <SelectItem value="decembre">Décembre</SelectItem>
                                <SelectItem value="toute_annee">Toute l'année</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="type_evenement">Type d'événement</Label>
                            <Select value={formData.type_evenement || ""} onValueChange={(value: Collection["type_evenement"]) => setFormData({ ...formData, type_evenement: value || undefined })}>
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionner un événement" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="mariage">Mariage</SelectItem>
                                <SelectItem value="bapteme">Baptême</SelectItem>
                                <SelectItem value="fete_nationale">Fête nationale</SelectItem>
                                <SelectItem value="nouvel_an">Nouvel An</SelectItem>
                                <SelectItem value="paques">Pâques</SelectItem>
                                <SelectItem value="ramadan">Ramadan</SelectItem>
                                <SelectItem value="tabaski">Tabaski</SelectItem>
                                <SelectItem value="fete_generation">Fête de génération</SelectItem>
                                <SelectItem value="ceremonie_traditionnelle">Cérémonie traditionnelle</SelectItem>
                                <SelectItem value="autre">Autre</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="prix_min">Prix minimum (FCFA)</Label>
                            <Input
                              id="prix_min"
                              type="number"
                              value={formData.prix_min || ""}
                              onChange={(e) => setFormData({ ...formData, prix_min: e.target.value ? parseInt(e.target.value) : undefined })}
                            />
                          </div>
                          <div>
                            <Label htmlFor="prix_max">Prix maximum (FCFA)</Label>
                            <Input
                              id="prix_max"
                              type="number"
                              value={formData.prix_max || ""}
                              onChange={(e) => setFormData({ ...formData, prix_max: e.target.value ? parseInt(e.target.value) : undefined })}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="date_debut">Date de début</Label>
                            <Input
                              id="date_debut"
                              type="date"
                              value={formData.date_debut}
                              onChange={(e) => setFormData({ ...formData, date_debut: e.target.value })}
                            />
                          </div>
                          <div>
                            <Label htmlFor="date_fin">Date de fin</Label>
                            <Input
                              id="date_fin"
                              type="date"
                              value={formData.date_fin}
                              onChange={(e) => setFormData({ ...formData, date_fin: e.target.value })}
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="histoire">Histoire de la collection</Label>
                          <Textarea
                            id="histoire"
                            value={formData.histoire}
                            onChange={(e) => setFormData({ ...formData, histoire: e.target.value })}
                            placeholder="Racontez l'histoire et l'inspiration derrière cette collection..."
                          />
                        </div>

                        <div>
                          <Label htmlFor="inspiration">Source d'inspiration</Label>
                          <Textarea
                            id="inspiration"
                            value={formData.inspiration}
                            onChange={(e) => setFormData({ ...formData, inspiration: e.target.value })}
                            placeholder="Décrivez ce qui a inspiré cette collection..."
                          />
                        </div>

                        <div>
                          <Label>Image de la collection</Label>
                          <div className="space-y-4">
                            {imagePreview ? (
                              <div className="relative w-full h-48 border rounded-lg overflow-hidden">
                                <Image
                                  src={imagePreview}
                                  alt="Aperçu de l'image"
                                  fill
                                  className="object-cover"
                                  onError={() => {
                                    setImagePreview("");
                                    toast({
                                      title: "Erreur",
                                      description: "Impossible de charger l'image. Vérifiez l'URL ou le fichier.",
                                      variant: "destructive",
                                    });
                                  }}
                                />
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="sm"
                                  className="absolute top-2 right-2"
                                  onClick={() => {
                                    setFormData({ ...formData, image_url: "" });
                                    setImagePreview("");
                                    setImageFile(null);
                                    const fileInput = document.getElementById('image_upload') as HTMLInputElement;
                                    if (fileInput) fileInput.value = "";
                                  }}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ) : (
                              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                                <Input
                                  id="image_upload"
                                  type="file"
                                  className="hidden"
                                  onChange={handleFileChange}
                                  accept="image/*"
                                />
                                <Label htmlFor="image_upload" className="cursor-pointer text-green-600 hover:underline font-semibold">
                                  Télécharger une image
                                </Label>
                                <p className="text-xs text-gray-500 mt-1">ou collez une URL ci-dessous</p>
                              </div>
                            )}

                            <Input
                              id="image_url"
                              type="url"
                              placeholder="https://example.com/image.jpg"
                              value={formData.image_url}
                              onChange={(e) => handleImageUrlChange(e.target.value)}
                              disabled={!!imageFile}
                            />
                            
                            <div className="text-sm text-gray-600">
                              <p className="mb-2">Domaines d'images approuvés pour les URLs :</p>
                              <ul className="list-disc list-inside space-y-1 text-xs">
                                <li>images.unsplash.com</li>
                                <li>unsplash.com</li>
                                <li>pexels.com</li>
                                <li>pixabay.com</li>
                                <li>giphy.com</li>
                                <li>wikimedia.org</li>
                              </ul>
                            </div>
                          </div>
                        </div>

                        <div>
                          <Label>Couleurs dominantes</Label>
                          <div className="space-y-3">
                            <div className="flex gap-2">
                              <Input
                                type="color"
                                value={newCouleur}
                                onChange={(e) => setNewCouleur(e.target.value)}
                                className="w-16 h-10"
                              />
                              <Button type="button" onClick={addCouleur} variant="outline">
                                Ajouter couleur
                              </Button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {formData.couleurs_dominantes.map((couleur, index) => (
                                <div key={index} className="flex items-center gap-1 bg-gray-100 rounded-full px-3 py-1">
                                  <div
                                    className="w-4 h-4 rounded-full border"
                                    style={{ backgroundColor: couleur }}
                                  />
                                  <span className="text-sm">{couleur}</span>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeCouleur(couleur)}
                                    className="h-4 w-4 p-0 hover:bg-red-100"
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div>
                          <Label>Tissus recommandés</Label>
                          <div className="space-y-3">
                            <div className="flex gap-2">
                              <Input
                                placeholder="Ex: Wax, Coton, Soie..."
                                value={newTissu}
                                onChange={(e) => setNewTissu(e.target.value)}
                                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTissu())}
                              />
                              <Button type="button" onClick={addTissu} variant="outline">
                                Ajouter tissu
                              </Button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {formData.tissus_recommandes.map((tissu, index) => (
                                <div key={index} className="flex items-center gap-1 bg-gray-100 rounded-full px-3 py-1">
                                  <span className="text-sm">{tissu}</span>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeTissu(tissu)}
                                    className="h-4 w-4 p-0 hover:bg-red-100"
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-end space-x-2">
                          <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                            Annuler
                          </Button>
                          <Button type="submit" disabled={isUploading}>
                            {isUploading ? "Sauvegarde..." : (editingCollection ? "Modifier" : "Créer")}
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {collections.map((collection) => (
                    <Card key={collection.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      {collection.image_url && (
                        <div className="relative h-48 overflow-hidden">
                          <Image
                            src={collection.image_url}
                            alt={collection.nom}
                            fill
                            style={{objectFit: 'cover'}}
                            className="transition-transform hover:scale-105"
                          />
                          <div className="absolute top-2 left-2">
                            <Badge className="bg-green-600 text-white">
                              {getSaisonLabel(collection.saison)}
                            </Badge>
                          </div>
                          {collection.type_evenement && (
                            <div className="absolute top-2 right-2">
                              <Badge variant="secondary">
                                {getEvenementLabel(collection.type_evenement)}
                              </Badge>
                            </div>
                          )}
                        </div>
                      )}
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-lg font-semibold">{collection.nom}</h3>
                          <Badge className={collection.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                            {collection.active ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{collection.description}</p>
                        
                        {collection.prix_min && collection.prix_max && (
                          <div className="text-sm font-medium text-green-600 mb-3">
                            {collection.prix_min.toLocaleString()} - {collection.prix_max.toLocaleString()} FCFA
                          </div>
                        )}

                        <div className="flex flex-wrap gap-1 mb-3">
                          {collection.couleurs_dominantes.slice(0, 5).map((couleur, index) => (
                            <div
                              key={index}
                              className="w-4 h-4 rounded-full border border-gray-300"
                              style={{ backgroundColor: couleur }}
                              title={couleur}
                            />
                          ))}
                        </div>

                        <div className="flex justify-between items-center">
                          <div className="flex space-x-1">
                            <Button size="sm" variant="outline" onClick={() => handleEdit(collection)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleDelete(collection.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <Badge variant="outline">
                            {collection.articles_ids?.length || 0} articles
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="histoires" className="space-y-4">
                <div className="text-center py-8">
                  <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-500">Fonctionnalité des histoires en cours de développement</p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
