import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShoppingCart, Search, Filter, Clock, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { produitService, type Produit, type CategorieProduit } from "@/services/produitService";
import { useToast } from "@/hooks/use-toast";

export default function VitrinePage() {
  const [produits, setProduits] = useState<Produit[]>([]);
  const [categories, setCategories] = useState<CategorieProduit[]>([]);
  const [filteredProduits, setFilteredProduits] = useState<Produit[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("nom");
  const { toast } = useToast();

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
        description: "Impossible de charger les créations",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const filterProduits = useCallback(() => {
    let filtered = [...produits];

    if (searchTerm) {
      filtered = filtered.filter(produit =>
        produit.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        produit.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(produit => produit.categorie_id === selectedCategory);
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "prix_asc":
          return a.prix_base - b.prix_base;
        case "prix_desc":
          return b.prix_base - a.prix_base;
        case "temps":
          return (a.temps_confection || 0) - (b.temps_confection || 0);
        default:
          return a.nom.localeCompare(b.nom);
      }
    });

    setFilteredProduits(filtered);
  }, [produits, searchTerm, selectedCategory, sortBy]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    filterProduits();
  }, [filterProduits]);

  const handleAddToCart = (produit: Produit) => {
    toast({
      title: "Ajouté à la sélection",
      description: `${produit.nom} a été ajouté à votre sélection`,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div>Chargement...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12">
                <Image 
                  src="/woomaan-logo.svg" 
                  alt="WOOMAAN by Yolanda Diva" 
                  width={48}
                  height={48}
                  className="h-12 w-auto object-contain"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-black tracking-wider">WOOMAAN</h1>
                <p className="text-sm woomaan-text-gradient font-medium tracking-wide">BY YOLANDA DIVA</p>
              </div>
            </div>
            <Button className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Collection
            </Button>
          </div>
        </div>
      </header>

      <section className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Découvrez nos Créations</h2>
          <p className="text-xl mb-8">Haute couture féminine africaine d'exception</p>
          <div className="flex justify-center space-x-4">
            <Badge className="bg-white text-black px-4 py-2">Élégance Premium</Badge>
            <Badge className="bg-white text-black px-4 py-2">Qualité Exceptionnelle</Badge>
            <Badge className="bg-white text-black px-4 py-2">Créations Uniques</Badge>
          </div>
        </div>
      </section>

      <section className="bg-white py-6 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Rechercher une création..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Toutes catégories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Toutes catégories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.nom}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Trier par" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nom">Nom A-Z</SelectItem>
                <SelectItem value="prix_asc">Prix croissant</SelectItem>
                <SelectItem value="prix_desc">Prix décroissant</SelectItem>
                <SelectItem value="temps">Temps de confection</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProduits.map((produit) => (
              <Card key={produit.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-square bg-gray-100 relative">
                  {produit.image_url ? (
                    <Image
                      src={produit.image_url}
                      alt={produit.nom}
                      width={400}
                      height={400}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="h-16 w-16 text-gray-400" />
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <div className="mb-2">
                    <h3 className="font-semibold text-lg mb-1">{produit.nom}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">{produit.description}</p>
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl font-bold woomaan-text-gradient">
                      {produit.prix_base.toLocaleString()} FCFA
                    </span>
                    {produit.temps_confection && (
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        {produit.temps_confection}h
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant="outline">{produit.categorie?.nom}</Badge>
                    <div className="flex items-center">
                      
                    </div>
                  </div>
                  <Button 
                    className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black"
                    onClick={() => handleAddToCart(produit)}
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Commander
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {filteredProduits.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Aucune création trouvée</p>
            </div>
          )}
        </div>
      </section>

      <footer className="bg-black text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4 woomaan-text-gradient tracking-wider">WOOMAAN</h3>
              <p className="text-sm text-gray-400 mb-2 tracking-wide">BY YOLANDA DIVA</p>
              <p className="text-gray-400">
                Spécialiste de la haute couture féminine africaine d'exception.
                Nous créons des pièces uniques pour sublimer la femme moderne.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <div className="text-gray-400 space-y-2">
                <p>📍 Bamako, Mali</p>
                <p>📞 +223 76 XX XX XX</p>
                <p>✉️ contact@woomaan.com</p>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Suivez-nous</h3>
              <div className="flex space-x-4">
                <a href="https://web.facebook.com/WoomanbyYolandaDiva" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-yellow-500 transition-colors">
                  Facebook
                </a>
                <a href="#" className="text-gray-400 hover:text-yellow-500 transition-colors">
                  Instagram
                </a>
                <a href="#" className="text-gray-400 hover:text-yellow-500 transition-colors">
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 WOOMAAN by Yolanda Diva. Tous droits réservés. Haute Couture Féminine Africaine.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
