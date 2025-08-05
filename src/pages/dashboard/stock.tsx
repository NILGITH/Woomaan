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
import { Plus, Edit, Trash2, Package, AlertTriangle, Download, Upload, Scissors, ShoppingBag } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/layout/DashboardLayout";

// Interfaces for stock items
interface MatierePremiereStock {
  id: string;
  nom: string;
  description?: string;
  type: "tissu" | "fil" | "accessoire" | "outil" | "fourniture";
  quantite_stock: number;
  quantite_min: number;
  unite_mesure: string;
  prix_unitaire: number;
  fournisseur?: string;
  emplacement?: string;
  couleur?: string;
  qualite?: string;
  created_at: string;
  updated_at: string;
}

interface ArticleVenteStock {
  id: string;
  nom: string;
  description: string;
  categorie: "vetement_femme" | "accessoire" | "produit_soin" | "chaussure" | "autre";
  taille?: string;
  couleur?: string;
  quantite_stock: number;
  quantite_min: number;
  prix_vente: number;
  prix_achat: number;
  magasin: string;
  emplacement?: string;
  code_barre?: string;
  created_at: string;
  updated_at: string;
}

interface AccessoireSoinsStock {
  id: string;
  nom: string;
  description?: string;
  type: "accessoire_mode" | "produit_soin" | "bijou" | "sac" | "chaussure";
  quantite_stock: number;
  quantite_min: number;
  unite_mesure: string;
  prix_unitaire: number;
  prix_vente?: number;
  fournisseur?: string;
  emplacement?: string;
  couleur?: string;
  taille?: string;
  marque?: string;
  created_at: string;
  updated_at: string;
}

// Types for form data
type FormDataMatiere = {
  nom: string;
  description: string;
  type: "tissu" | "fil" | "accessoire" | "outil" | "fourniture";
  quantite_stock: string;
  quantite_min: string;
  unite_mesure: string;
  prix_unitaire: string;
  fournisseur: string;
  emplacement: string;
  couleur: string;
  qualite: string;
};

type FormDataArticle = {
  nom: string;
  description: string;
  categorie: "vetement_femme" | "accessoire" | "produit_soin" | "chaussure" | "autre";
  taille: string;
  couleur: string;
  quantite_stock: string;
  quantite_min: string;
  prix_vente: string;
  prix_achat: string;
  magasin: string;
  emplacement: string;
  code_barre: string;
};

type FormDataAccessoireSoins = {
  nom: string;
  description: string;
  type: "accessoire_mode" | "produit_soin" | "bijou" | "sac" | "chaussure";
  quantite_stock: string;
  quantite_min: string;
  unite_mesure: string;
  prix_unitaire: string;
  prix_vente: string;
  fournisseur: string;
  emplacement: string;
  couleur: string;
  taille: string;
  marque: string;
};

export default function StockPage() {
  const [activeTab, setActiveTab] = useState("stock");
  const [stockItems, setStockItems] = useState<MatierePremiereStock[]>([]);
  const [accessoiresSoins, setAccessoiresSoins] = useState<AccessoireSoinsStock[]>([]);
  const [articlesVente, setArticlesVente] = useState<ArticleVenteStock[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MatierePremiereStock | AccessoireSoinsStock | ArticleVenteStock | null>(null);
  const { toast } = useToast();

  const initialFormDataMatiere: FormDataMatiere = {
    nom: "",
    description: "",
    type: "tissu",
    quantite_stock: "",
    quantite_min: "",
    unite_mesure: "mètre",
    prix_unitaire: "",
    fournisseur: "",
    emplacement: "",
    couleur: "",
    qualite: "",
  };

  const initialFormDataArticle: FormDataArticle = {
    nom: "",
    description: "",
    categorie: "vetement_femme",
    taille: "",
    couleur: "",
    quantite_stock: "",
    quantite_min: "",
    prix_vente: "",
    prix_achat: "",
    magasin: "principal",
    emplacement: "",
    code_barre: "",
  };

  const initialFormDataAccessoireSoins: FormDataAccessoireSoins = {
    nom: "",
    description: "",
    type: "accessoire_mode",
    quantite_stock: "",
    quantite_min: "",
    unite_mesure: "pièce",
    prix_unitaire: "",
    prix_vente: "",
    fournisseur: "",
    emplacement: "",
    couleur: "",
    taille: "",
    marque: "",
  };

  const [formDataMatiere, setFormDataMatiere] = useState<FormDataMatiere>(initialFormDataMatiere);
  const [formDataAccessoireSoins, setFormDataAccessoireSoins] = useState<FormDataAccessoireSoins>(initialFormDataAccessoireSoins);
  const [formDataArticle, setFormDataArticle] = useState<FormDataArticle>(initialFormDataArticle);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const mockMatieresPremiere: MatierePremiereStock[] = [
        {
          id: "mp1",
          nom: "Tissu Wax Premium",
          description: "Tissu wax de haute qualité",
          type: "tissu",
          quantite_stock: 50,
          quantite_min: 10,
          unite_mesure: "mètre",
          prix_unitaire: 5000,
          fournisseur: "Fournisseur Textile A",
          emplacement: "Entrepôt A1",
          couleur: "Multicolore",
          qualite: "Premium",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: "mp2",
          nom: "Fil de couture",
          description: "Fil polyester résistant",
          type: "fil",
          quantite_stock: 5,
          quantite_min: 20,
          unite_mesure: "bobine",
          prix_unitaire: 500,
          fournisseur: "Fournisseur Mercerie B",
          emplacement: "Rayon B2",
          couleur: "Blanc",
          qualite: "Standard",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ];

      const mockAccessoiresSoins: AccessoireSoinsStock[] = [
        {
          id: "as1",
          nom: "Crème Hydratante Corps Karité",
          description: "Crème nourrissante au beurre de karité naturel",
          type: "produit_soin",
          quantite_stock: 25,
          quantite_min: 5,
          unite_mesure: "tube",
          prix_unitaire: 3500,
          prix_vente: 5000,
          fournisseur: "Laboratoire Beauté Africaine",
          emplacement: "Rayon Soins",
          marque: "WOOMAAN Beauty",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: "as2",
          nom: "Sac à Main Cuir Premium",
          description: "Sac en cuir véritable fait main",
          type: "accessoire_mode",
          quantite_stock: 12,
          quantite_min: 3,
          unite_mesure: "pièce",
          prix_unitaire: 15000,
          prix_vente: 25000,
          fournisseur: "Maroquinerie Artisanale",
          emplacement: "Vitrine Accessoires",
          couleur: "Marron",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: "as3",
          nom: "Huile Essentielle Argan",
          description: "Huile d'argan pure pour cheveux et peau",
          type: "produit_soin",
          quantite_stock: 18,
          quantite_min: 8,
          unite_mesure: "flacon",
          prix_unitaire: 2800,
          prix_vente: 4200,
          fournisseur: "Coopérative Argan Maroc",
          emplacement: "Rayon Soins",
          marque: "WOOMAAN Naturel",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ];

      const mockArticlesVente: ArticleVenteStock[] = [
        {
          id: "av1",
          nom: "Robe Élégance Premium",
          description: "Robe sophistiquée WOOMAAN",
          categorie: "vetement_femme",
          taille: "M",
          couleur: "Doré",
          quantite_stock: 8,
          quantite_min: 3,
          prix_vente: 125000,
          prix_achat: 85000,
          magasin: "principal",
          emplacement: "Collection Premium",
          code_barre: "123456789012",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: "av2",
          nom: "Ensemble Tailleur Business",
          description: "Tailleur femme professionnel",
          categorie: "vetement_femme",
          taille: "L",
          couleur: "Noir Chic",
          quantite_stock: 6,
          quantite_min: 2,
          prix_vente: 185000,
          prix_achat: 125000,
          magasin: "principal",
          emplacement: "Collection Business",
          code_barre: "123456789013",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ];

      setStockItems(mockMatieresPremiere);
      setAccessoiresSoins(mockAccessoiresSoins);
      setArticlesVente(mockArticlesVente);
    } catch (error) {
      console.error("Failed to load stock:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger le stock",
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
    setFormDataMatiere(initialFormDataMatiere);
    setFormDataAccessoireSoins(initialFormDataAccessoireSoins);
    setFormDataArticle(initialFormDataArticle);
    setEditingItem(null);
  };

  const handleSubmitMatiere = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const matiereData = {
        ...formDataMatiere,
        quantite_stock: parseInt(formDataMatiere.quantite_stock, 10) || 0,
        quantite_min: parseInt(formDataMatiere.quantite_min, 10) || 0,
        prix_unitaire: parseFloat(formDataMatiere.prix_unitaire) || 0,
      };

      if (editingItem && "type" in editingItem) {
        const updatedMatiere: MatierePremiereStock = {
          ...editingItem,
          ...matiereData,
          updated_at: new Date().toISOString(),
        };
        setStockItems(prev => prev.map(item =>
          item.id === editingItem.id ? updatedMatiere : item
        ));
        toast({
          title: "Succès",
          description: "Matière première modifiée avec succès",
        });
      } else {
        const newMatiere: MatierePremiereStock = {
          id: Date.now().toString(),
          ...matiereData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        setStockItems(prev => [...prev, newMatiere]);
        toast({
          title: "Succès",
          description: "Matière première créée avec succès",
        });
      }

      setDialogOpen(false);
      resetForms();
    } catch (error) {
      console.error("Failed to save matiere:", error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder la matière première",
        variant: "destructive",
      });
    }
  };

  const handleSubmitArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const articleData = {
        ...formDataArticle,
        quantite_stock: parseInt(formDataArticle.quantite_stock, 10) || 0,
        quantite_min: parseInt(formDataArticle.quantite_min, 10) || 0,
        prix_vente: parseFloat(formDataArticle.prix_vente) || 0,
        prix_achat: parseFloat(formDataArticle.prix_achat) || 0,
      };

      if (editingItem && "categorie" in editingItem) {
        const updatedArticle: ArticleVenteStock = {
          ...editingItem,
          ...articleData,
          updated_at: new Date().toISOString(),
        };
        setArticlesVente(prev => prev.map(item =>
          item.id === editingItem.id ? updatedArticle : item
        ));
        toast({
          title: "Succès",
          description: "Article modifié avec succès",
        });
      } else {
        const newArticle: ArticleVenteStock = {
          id: Date.now().toString(),
          ...articleData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        setArticlesVente(prev => [...prev, newArticle]);
        toast({
          title: "Succès",
          description: "Article créé avec succès",
        });
      }

      setDialogOpen(false);
      resetForms();
    } catch (error) {
      console.error("Failed to save article:", error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder l'article",
        variant: "destructive",
      });
    }
  };

  const handleSubmitAccessoireSoins = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const accessoireSoinsData = {
        ...formDataAccessoireSoins,
        quantite_stock: parseInt(formDataAccessoireSoins.quantite_stock, 10) || 0,
        quantite_min: parseInt(formDataAccessoireSoins.quantite_min, 10) || 0,
        prix_unitaire: parseFloat(formDataAccessoireSoins.prix_unitaire) || 0,
        prix_vente: formDataAccessoireSoins.prix_vente ? parseFloat(formDataAccessoireSoins.prix_vente) : undefined,
      };

      if (editingItem && "type" in editingItem && (editingItem.type === "accessoire_mode" || editingItem.type === "produit_soin" || editingItem.type === "bijou" || editingItem.type === "sac" || editingItem.type === "chaussure")) {
        const updatedAccessoireSoins: AccessoireSoinsStock = {
          ...editingItem as AccessoireSoinsStock,
          ...accessoireSoinsData,
          updated_at: new Date().toISOString(),
        };
        setAccessoiresSoins(prev => prev.map(item =>
          item.id === editingItem.id ? updatedAccessoireSoins : item
        ));
        toast({
          title: "Succès",
          description: "Accessoire/Soin modifié avec succès",
        });
      } else {
        const newAccessoireSoins: AccessoireSoinsStock = {
          id: Date.now().toString(),
          ...accessoireSoinsData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        setAccessoiresSoins(prev => [...prev, newAccessoireSoins]);
        toast({
          title: "Succès",
          description: "Accessoire/Soin créé avec succès",
        });
      }

      setDialogOpen(false);
      resetForms();
    } catch (error) {
      console.error("Failed to save accessoire/soin:", error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder l'accessoire/soin",
        variant: "destructive",
      });
    }
  };

  const handleEditMatiere = (matiere: MatierePremiereStock) => {
    setEditingItem(matiere);
    setFormDataMatiere({
      nom: matiere.nom,
      description: matiere.description || "",
      type: matiere.type,
      quantite_stock: matiere.quantite_stock.toString(),
      quantite_min: matiere.quantite_min.toString(),
      unite_mesure: matiere.unite_mesure,
      prix_unitaire: matiere.prix_unitaire.toString(),
      fournisseur: matiere.fournisseur || "",
      emplacement: matiere.emplacement || "",
      couleur: matiere.couleur || "",
      qualite: matiere.qualite || "",
    });
    setDialogOpen(true);
  };

  const handleEditArticle = (article: ArticleVenteStock) => {
    setEditingItem(article);
    setFormDataArticle({
      nom: article.nom,
      description: article.description || "",
      categorie: article.categorie,
      taille: article.taille || "",
      couleur: article.couleur || "",
      quantite_stock: article.quantite_stock.toString(),
      quantite_min: article.quantite_min.toString(),
      prix_vente: article.prix_vente.toString(),
      prix_achat: article.prix_achat?.toString() || "",
      magasin: article.magasin,
      emplacement: article.emplacement || "",
      code_barre: article.code_barre || "",
    });
    setDialogOpen(true);
  };

  const handleEditAccessoireSoins = (item: AccessoireSoinsStock) => {
    setEditingItem(item);
    setFormDataAccessoireSoins({
      nom: item.nom,
      description: item.description || "",
      type: item.type,
      quantite_stock: item.quantite_stock.toString(),
      quantite_min: item.quantite_min.toString(),
      unite_mesure: item.unite_mesure,
      prix_unitaire: item.prix_unitaire.toString(),
      prix_vente: item.prix_vente?.toString() || "",
      fournisseur: item.fournisseur || "",
      emplacement: item.emplacement || "",
      couleur: item.couleur || "",
      taille: item.taille || "",
      marque: item.marque || "",
    });
    setDialogOpen(true);
  };

  const handleDeleteMatiere = async (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette matière première ?")) {
      setStockItems(prev => prev.filter(item => item.id !== id));
      toast({
        title: "Succès",
        description: "Matière première supprimée avec succès",
      });
    }
  };

  const handleDeleteArticle = async (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet article ?")) {
      setArticlesVente(prev => prev.filter(item => item.id !== id));
      toast({
        title: "Succès",
        description: "Article supprimé avec succès",
      });
    }
  };

  const handleDeleteAccessoireSoins = async (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet accessoire/soin ?")) {
      setAccessoiresSoins(prev => prev.filter(item => item.id !== id));
      toast({
        title: "Succès",
        description: "Accessoire/Soin supprimé avec succès",
      });
    }
  };

  const getStockStatus = (quantite: number, min: number) => {
    if (quantite <= min) {
      return { status: "critique", color: "bg-red-100 text-red-800" };
    } else if (quantite <= min * 2) {
      return { status: "faible", color: "bg-yellow-100 text-yellow-800" };
    }
    return { status: "normal", color: "bg-green-100 text-green-800" };
  };

  const matieresEnRupture = stockItems.filter(m => m.quantite_stock <= m.quantite_min);
  const accessoiresEnRupture = accessoiresSoins.filter(a => a.quantite_stock <= a.quantite_min);
  const articlesEnRupture = articlesVente.filter(a => a.quantite_stock <= a.quantite_min);
  const totalEnRupture = matieresEnRupture.length + accessoiresEnRupture.length + articlesEnRupture.length;

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
        {totalEnRupture > 0 && (
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="flex items-center text-red-800">
                <AlertTriangle className="mr-2 h-5 w-5" />
                Alertes de Stock
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-700 mb-2">
                {totalEnRupture} article(s) en rupture ou stock faible :
              </p>
              <div className="space-y-1">
                {matieresEnRupture.map(matiere => (
                  <div key={matiere.id} className="text-sm text-red-600">
                    • {matiere.nom} : {matiere.quantite_stock} {matiere.unite_mesure} (min: {matiere.quantite_min})
                  </div>
                ))}
                {accessoiresEnRupture.map(accessoire => (
                  <div key={accessoire.id} className="text-sm text-red-600">
                    • {accessoire.nom} : {accessoire.quantite_stock} {accessoire.unite_mesure} (min: {accessoire.quantite_min})
                  </div>
                ))}
                {articlesEnRupture.map(article => (
                  <div key={article.id} className="text-sm text-red-600">
                    • {article.nom} : {article.quantite_stock} unités (min: {article.quantite_min})
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex items-center">
                  <Package className="mr-2 h-5 w-5" />
                  Gestion du Stock
                </CardTitle>
                <CardDescription>
                  Gérez votre inventaire - {stockItems.length} articles en stock, {accessoiresSoins.length} accessoires & soins et {articlesVente.length} articles en vente
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="stock" className="flex items-center">
                  <Scissors className="mr-2 h-4 w-4" />
                  Stock
                </TabsTrigger>
                <TabsTrigger value="accessoires-soins" className="flex items-center">
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Stock Accessoires & Soins
                </TabsTrigger>
                <TabsTrigger value="articles-vente" className="flex items-center">
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Stock Articles en Vente
                </TabsTrigger>
              </TabsList>

              <TabsContent value="stock" className="space-y-4">
                <div className="flex justify-end space-x-2">
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Exporter Excel
                  </Button>
                  <Button variant="outline">
                    <Upload className="mr-2 h-4 w-4" />
                    Importer Excel
                  </Button>
                  <Dialog open={dialogOpen && activeTab === "stock"} onOpenChange={(open) => { if (!open) resetForms(); setDialogOpen(open); }}>
                    <DialogTrigger asChild>
                      <Button onClick={() => { resetForms(); setActiveTab("stock"); setDialogOpen(true); }}>
                        <Plus className="mr-2 h-4 w-4" />
                        Ajouter au stock
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl">
                      <DialogHeader>
                        <DialogTitle>
                          {editingItem && "type" in editingItem ? "Modifier l'article en stock" : "Nouvel article en stock"}
                        </DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleSubmitMatiere} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="nom">Nom</Label>
                            <Input
                              id="nom"
                              value={formDataMatiere.nom}
                              onChange={(e) => setFormDataMatiere({ ...formDataMatiere, nom: e.target.value })}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="type">Type</Label>
                            <Select value={formDataMatiere.type} onValueChange={(value: FormDataMatiere["type"]) => setFormDataMatiere({ ...formDataMatiere, type: value })}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="tissu">Tissu</SelectItem>
                                <SelectItem value="fil">Fil</SelectItem>
                                <SelectItem value="accessoire">Accessoire</SelectItem>
                                <SelectItem value="outil">Outil</SelectItem>
                                <SelectItem value="fourniture">Fourniture</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="description">Description</Label>
                          <Textarea
                            id="description"
                            value={formDataMatiere.description}
                            onChange={(e) => setFormDataMatiere({ ...formDataMatiere, description: e.target.value })}
                          />
                        </div>
                        <div className="grid grid-cols-4 gap-4">
                          <div>
                            <Label htmlFor="quantite_stock">Quantité en stock</Label>
                            <Input
                              id="quantite_stock"
                              type="number"
                              value={formDataMatiere.quantite_stock}
                              onChange={(e) => setFormDataMatiere({ ...formDataMatiere, quantite_stock: e.target.value })}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="quantite_min">Stock minimum</Label>
                            <Input
                              id="quantite_min"
                              type="number"
                              value={formDataMatiere.quantite_min}
                              onChange={(e) => setFormDataMatiere({ ...formDataMatiere, quantite_min: e.target.value })}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="unite_mesure">Unité de mesure</Label>
                            <Select value={formDataMatiere.unite_mesure} onValueChange={(value: string) => setFormDataMatiere({ ...formDataMatiere, unite_mesure: value })}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="mètre">Mètre</SelectItem>
                                <SelectItem value="bobine">Bobine</SelectItem>
                                <SelectItem value="pièce">Pièce</SelectItem>
                                <SelectItem value="kg">Kilogramme</SelectItem>
                                <SelectItem value="litre">Litre</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="prix_unitaire">Prix unitaire (FCFA)</Label>
                            <Input
                              id="prix_unitaire"
                              type="number"
                              value={formDataMatiere.prix_unitaire}
                              onChange={(e) => setFormDataMatiere({ ...formDataMatiere, prix_unitaire: e.target.value })}
                              required
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="couleur">Couleur</Label>
                            <Input
                              id="couleur"
                              value={formDataMatiere.couleur}
                              onChange={(e) => setFormDataMatiere({ ...formDataMatiere, couleur: e.target.value })}
                            />
                          </div>
                          <div>
                            <Label htmlFor="qualite">Qualité</Label>
                            <Input
                              id="qualite"
                              value={formDataMatiere.qualite}
                              onChange={(e) => setFormDataMatiere({ ...formDataMatiere, qualite: e.target.value })}
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="fournisseur">Fournisseur</Label>
                            <Input
                              id="fournisseur"
                              value={formDataMatiere.fournisseur}
                              onChange={(e) => setFormDataMatiere({ ...formDataMatiere, fournisseur: e.target.value })}
                            />
                          </div>
                          <div>
                            <Label htmlFor="emplacement">Emplacement</Label>
                            <Input
                              id="emplacement"
                              value={formDataMatiere.emplacement}
                              onChange={(e) => setFormDataMatiere({ ...formDataMatiere, emplacement: e.target.value })}
                            />
                          </div>
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                            Annuler
                          </Button>
                          <Button type="submit">
                            {editingItem && "type" in editingItem ? "Modifier" : "Créer"}
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Matière Première / Outil</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Prix unitaire</TableHead>
                      <TableHead>Fournisseur</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stockItems.map((matiere) => {
                      const stockStatus = getStockStatus(matiere.quantite_stock, matiere.quantite_min);
                      return (
                        <TableRow key={matiere.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{matiere.nom}</div>
                              <div className="text-sm text-gray-500">{matiere.description}</div>
                              {matiere.couleur && (
                                <div className="text-sm text-gray-500">Couleur: {matiere.couleur}</div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{matiere.type}</Badge>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{matiere.quantite_stock} {matiere.unite_mesure}</div>
                              <div className="text-sm text-gray-500">Min: {matiere.quantite_min}</div>
                            </div>
                          </TableCell>
                          <TableCell>{matiere.prix_unitaire.toLocaleString()} FCFA</TableCell>
                          <TableCell>{matiere.fournisseur}</TableCell>
                          <TableCell>
                            <Badge className={stockStatus.color}>
                              {stockStatus.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline" onClick={() => handleEditMatiere(matiere)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => handleDeleteMatiere(matiere.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TabsContent>

              <TabsContent value="accessoires-soins" className="space-y-4">
                <div className="flex justify-end space-x-2">
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Exporter Excel
                  </Button>
                  <Button variant="outline">
                    <Upload className="mr-2 h-4 w-4" />
                    Importer Excel
                  </Button>
                  <Dialog open={dialogOpen && activeTab === "accessoires-soins"} onOpenChange={(open) => { if (!open) resetForms(); setDialogOpen(open); }}>
                    <DialogTrigger asChild>
                      <Button onClick={() => { resetForms(); setActiveTab("accessoires-soins"); setDialogOpen(true); }}>
                        <Plus className="mr-2 h-4 w-4" />
                        Nouvel accessoire/soin
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl">
                      <DialogHeader>
                        <DialogTitle>
                          {editingItem && "type" in editingItem && (editingItem.type === "accessoire_mode" || editingItem.type === "produit_soin" || editingItem.type === "bijou" || editingItem.type === "sac" || editingItem.type === "chaussure") ? "Modifier l'accessoire/soin" : "Nouvel accessoire/soin"}
                        </DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleSubmitAccessoireSoins} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="nom-accessoire">Nom</Label>
                            <Input
                              id="nom-accessoire"
                              value={formDataAccessoireSoins.nom}
                              onChange={(e) => setFormDataAccessoireSoins({ ...formDataAccessoireSoins, nom: e.target.value })}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="type-accessoire">Type</Label>
                            <Select value={formDataAccessoireSoins.type} onValueChange={(value: FormDataAccessoireSoins["type"]) => setFormDataAccessoireSoins({ ...formDataAccessoireSoins, type: value })}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="accessoire_mode">Accessoire Mode</SelectItem>
                                <SelectItem value="produit_soin">Produit de Soin</SelectItem>
                                <SelectItem value="bijou">Bijou</SelectItem>
                                <SelectItem value="sac">Sac</SelectItem>
                                <SelectItem value="chaussure">Chaussure</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="description-accessoire">Description</Label>
                          <Textarea
                            id="description-accessoire"
                            value={formDataAccessoireSoins.description}
                            onChange={(e) => setFormDataAccessoireSoins({ ...formDataAccessoireSoins, description: e.target.value })}
                          />
                        </div>
                        <div className="grid grid-cols-4 gap-4">
                          <div>
                            <Label htmlFor="quantite_stock-accessoire">Quantité en stock</Label>
                            <Input
                              id="quantite_stock-accessoire"
                              type="number"
                              value={formDataAccessoireSoins.quantite_stock}
                              onChange={(e) => setFormDataAccessoireSoins({ ...formDataAccessoireSoins, quantite_stock: e.target.value })}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="quantite_min-accessoire">Stock minimum</Label>
                            <Input
                              id="quantite_min-accessoire"
                              type="number"
                              value={formDataAccessoireSoins.quantite_min}
                              onChange={(e) => setFormDataAccessoireSoins({ ...formDataAccessoireSoins, quantite_min: e.target.value })}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="unite_mesure-accessoire">Unité de mesure</Label>
                            <Select value={formDataAccessoireSoins.unite_mesure} onValueChange={(value: string) => setFormDataAccessoireSoins({ ...formDataAccessoireSoins, unite_mesure: value })}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pièce">Pièce</SelectItem>
                                <SelectItem value="tube">Tube</SelectItem>
                                <SelectItem value="flacon">Flacon</SelectItem>
                                <SelectItem value="pot">Pot</SelectItem>
                                <SelectItem value="sachet">Sachet</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="prix_unitaire-accessoire">Prix unitaire (FCFA)</Label>
                            <Input
                              id="prix_unitaire-accessoire"
                              type="number"
                              value={formDataAccessoireSoins.prix_unitaire}
                              onChange={(e) => setFormDataAccessoireSoins({ ...formDataAccessoireSoins, prix_unitaire: e.target.value })}
                              required
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="prix_vente-accessoire">Prix de vente (FCFA)</Label>
                            <Input
                              id="prix_vente-accessoire"
                              type="number"
                              value={formDataAccessoireSoins.prix_vente}
                              onChange={(e) => setFormDataAccessoireSoins({ ...formDataAccessoireSoins, prix_vente: e.target.value })}
                            />
                          </div>
                          <div>
                            <Label htmlFor="marque">Marque</Label>
                            <Input
                              id="marque"
                              value={formDataAccessoireSoins.marque}
                              onChange={(e) => setFormDataAccessoireSoins({ ...formDataAccessoireSoins, marque: e.target.value })}
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <Label htmlFor="couleur-accessoire">Couleur</Label>
                            <Input
                              id="couleur-accessoire"
                              value={formDataAccessoireSoins.couleur}
                              onChange={(e) => setFormDataAccessoireSoins({ ...formDataAccessoireSoins, couleur: e.target.value })}
                            />
                          </div>
                          <div>
                            <Label htmlFor="taille-accessoire">Taille</Label>
                            <Input
                              id="taille-accessoire"
                              value={formDataAccessoireSoins.taille}
                              onChange={(e) => setFormDataAccessoireSoins({ ...formDataAccessoireSoins, taille: e.target.value })}
                            />
                          </div>
                          <div>
                            <Label htmlFor="emplacement-accessoire">Emplacement</Label>
                            <Input
                              id="emplacement-accessoire"
                              value={formDataAccessoireSoins.emplacement}
                              onChange={(e) => setFormDataAccessoireSoins({ ...formDataAccessoireSoins, emplacement: e.target.value })}
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="fournisseur-accessoire">Fournisseur</Label>
                          <Input
                            id="fournisseur-accessoire"
                            value={formDataAccessoireSoins.fournisseur}
                            onChange={(e) => setFormDataAccessoireSoins({ ...formDataAccessoireSoins, fournisseur: e.target.value })}
                          />
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                            Annuler
                          </Button>
                          <Button type="submit">
                            {editingItem && "type" in editingItem && (editingItem.type === "accessoire_mode" || editingItem.type === "produit_soin" || editingItem.type === "bijou" || editingItem.type === "sac" || editingItem.type === "chaussure") ? "Modifier" : "Créer"}
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Accessoire/Soin</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Prix unitaire</TableHead>
                      <TableHead>Prix de vente</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {accessoiresSoins.map((item) => {
                      const stockStatus = getStockStatus(item.quantite_stock, item.quantite_min);
                      return (
                        <TableRow key={item.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{item.nom}</div>
                              <div className="text-sm text-gray-500">{item.description}</div>
                              {item.marque && (
                                <div className="text-sm text-gray-500">Marque: {item.marque}</div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{item.type.replace(/_/g, " ")}</Badge>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{item.quantite_stock} {item.unite_mesure}</div>
                              <div className="text-sm text-gray-500">Min: {item.quantite_min}</div>
                            </div>
                          </TableCell>
                          <TableCell>{item.prix_unitaire.toLocaleString()} FCFA</TableCell>
                          <TableCell>{item.prix_vente ? `${item.prix_vente.toLocaleString()} FCFA` : "-"}</TableCell>
                          <TableCell>
                            <Badge className={stockStatus.color}>
                              {stockStatus.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline" onClick={() => handleEditAccessoireSoins(item)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => handleDeleteAccessoireSoins(item.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TabsContent>

              <TabsContent value="articles-vente" className="space-y-4">
                <div className="flex justify-end space-x-2">
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Exporter Excel
                  </Button>
                  <Button variant="outline">
                    <Upload className="mr-2 h-4 w-4" />
                    Importer Excel
                  </Button>
                  <Dialog open={dialogOpen && activeTab === "articles-vente"} onOpenChange={(open) => { if (!open) resetForms(); setDialogOpen(open); }}>
                    <DialogTrigger asChild>
                      <Button onClick={() => { resetForms(); setActiveTab("articles-vente"); setDialogOpen(true); }}>
                        <Plus className="mr-2 h-4 w-4" />
                        Nouvel article
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl">
                      <DialogHeader>
                        <DialogTitle>
                          {editingItem && "categorie" in editingItem ? "Modifier l'article" : "Nouvel article"}
                        </DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleSubmitArticle} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="nom-article">Nom de l'article</Label>
                            <Input
                              id="nom-article"
                              value={formDataArticle.nom}
                              onChange={(e) => setFormDataArticle({ ...formDataArticle, nom: e.target.value })}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="categorie-article">Catégorie</Label>
                            <Select value={formDataArticle.categorie} onValueChange={(value: FormDataArticle["categorie"]) => setFormDataArticle({ ...formDataArticle, categorie: value })}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="vetement_femme">Vêtement Femme</SelectItem>
                                <SelectItem value="accessoire">Accessoire</SelectItem>
                                <SelectItem value="produit_soin">Produit de Soin</SelectItem>
                                <SelectItem value="chaussure">Chaussure</SelectItem>
                                <SelectItem value="autre">Autre</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="description-article">Description</Label>
                          <Textarea
                            id="description-article"
                            value={formDataArticle.description}
                            onChange={(e) => setFormDataArticle({ ...formDataArticle, description: e.target.value })}
                          />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <Label htmlFor="taille">Taille</Label>
                            <Input
                              id="taille"
                              value={formDataArticle.taille}
                              onChange={(e) => setFormDataArticle({ ...formDataArticle, taille: e.target.value })}
                            />
                          </div>
                          <div>
                            <Label htmlFor="couleur-article">Couleur</Label>
                            <Input
                              id="couleur-article"
                              value={formDataArticle.couleur}
                              onChange={(e) => setFormDataArticle({ ...formDataArticle, couleur: e.target.value })}
                            />
                          </div>
                          <div>
                            <Label htmlFor="code_barre">Code-barres</Label>
                            <Input
                              id="code_barre"
                              value={formDataArticle.code_barre}
                              onChange={(e) => setFormDataArticle({ ...formDataArticle, code_barre: e.target.value })}
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-4 gap-4">
                          <div>
                            <Label htmlFor="quantite_stock-article">Quantité en stock</Label>
                            <Input
                              id="quantite_stock-article"
                              type="number"
                              value={formDataArticle.quantite_stock}
                              onChange={(e) => setFormDataArticle({ ...formDataArticle, quantite_stock: e.target.value })}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="quantite_min-article">Stock minimum</Label>
                            <Input
                              id="quantite_min-article"
                              type="number"
                              value={formDataArticle.quantite_min}
                              onChange={(e) => setFormDataArticle({ ...formDataArticle, quantite_min: e.target.value })}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="prix_vente">Prix de vente (FCFA)</Label>
                            <Input
                              id="prix_vente"
                              type="number"
                              value={formDataArticle.prix_vente}
                              onChange={(e) => setFormDataArticle({ ...formDataArticle, prix_vente: e.target.value })}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="prix_achat">Prix d'achat (FCFA)</Label>
                            <Input
                              id="prix_achat"
                              type="number"
                              value={formDataArticle.prix_achat}
                              onChange={(e) => setFormDataArticle({ ...formDataArticle, prix_achat: e.target.value })}
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="magasin">Magasin</Label>
                            <Select value={formDataArticle.magasin} onValueChange={(value: string) => setFormDataArticle({ ...formDataArticle, magasin: value })}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="principal">Magasin Principal</SelectItem>
                                <SelectItem value="succursale">Succursale</SelectItem>
                                <SelectItem value="depot">Dépôt</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="emplacement-article">Emplacement</Label>
                            <Input
                              id="emplacement-article"
                              value={formDataArticle.emplacement}
                              onChange={(e) => setFormDataArticle({ ...formDataArticle, emplacement: e.target.value })}
                            />
                          </div>
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                            Annuler
                          </Button>
                          <Button type="submit">
                            {editingItem && "categorie" in editingItem ? "Modifier" : "Créer"}
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Article</TableHead>
                      <TableHead>Catégorie</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Prix de vente</TableHead>
                      <TableHead>Magasin</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {articlesVente.map((article) => {
                      const stockStatus = getStockStatus(article.quantite_stock, article.quantite_min);
                      return (
                        <TableRow key={article.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{article.nom}</div>
                              <div className="text-sm text-gray-500">{article.description}</div>
                              <div className="text-sm text-gray-500">
                                {article.taille && `Taille: ${article.taille}`}
                                {article.taille && article.couleur && " • "}
                                {article.couleur && `Couleur: ${article.couleur}`}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{article.categorie.replace(/_/g, " ")}</Badge>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{article.quantite_stock}</div>
                              <div className="text-sm text-gray-500">Min: {article.quantite_min}</div>
                            </div>
                          </TableCell>
                          <TableCell>{article.prix_vente.toLocaleString()} FCFA</TableCell>
                          <TableCell>
                            <Badge variant="secondary">{article.magasin}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={stockStatus.color}>
                              {stockStatus.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline" onClick={() => handleEditArticle(article)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => handleDeleteArticle(article.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
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
