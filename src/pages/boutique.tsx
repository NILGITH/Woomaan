import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ShoppingCart, Plus, Minus, Search, Star, Eye, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { onlineOrderService } from "@/services/onlineOrderService";

type ProductCategory = "vetement" | "accessoire" | "soin";

interface Product {
  id: string;
  nom: string;
  description: string;
  prix: number;
  image_url: string;
  collection_id?: string;
  collection_nom?: string;
  tailles_disponibles?: string[];
  couleurs_disponibles?: string[];
  en_stock: boolean;
  note: number;
  nombre_avis: number;
  category: ProductCategory;
}

interface CartItem {
  product: Product;
  quantity: number;
  taille?: string;
  couleur?: string;
}

export default function BoutiquePage() {
  const router = useRouter();
  const { toast } = useToast();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedTaille, setSelectedTaille] = useState("");
  const [selectedCouleur, setSelectedCouleur] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | "all">("all");
  const [priceRange, setPriceRange] = useState("all");
  const [sortBy, setSortBy] = useState("nom");
  const [showCart, setShowCart] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  
  const [orderData, setOrderData] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    adresse: "",
    ville: "",
    notes: ""
  });

  const mockProducts: Product[] = [
    {
      id: "prod1",
      nom: "Robe Élégance Dorée",
      description: "Robe sophistiquée en tissu noble, coupe ajustée avec finitions dorées signature WOOMAAN.",
      prix: 125000,
      image_url: "/images/complet3.jpg",
      collection_id: "col1",
      collection_nom: "Collection Élégance",
      tailles_disponibles: ["XS", "S", "M", "L", "XL"],
      couleurs_disponibles: ["Doré", "Noir Élégant", "Blanc Nacré"],
      en_stock: true,
      note: 4.9,
      nombre_avis: 32,
      category: "vetement"
    },
    {
      id: "prod2",
      nom: "Ensemble Tailleur Prestige",
      description: "Tailleur féminin haut de gamme, parfait pour la femme d'affaires moderne et sophistiquée.",
      prix: 185000,
      image_url: "/images/complet1.jpg",
      collection_id: "col2",
      collection_nom: "Collection Business",
      tailles_disponibles: ["S", "M", "L", "XL"],
      couleurs_disponibles: ["Rouge Prestige", "Noir Chic", "Bleu Marine", "Bordeaux"],
      en_stock: true,
      note: 4.8,
      nombre_avis: 28,
      category: "vetement"
    },
    {
      id: "soin1",
      nom: "Huile de Beauté Scintillante",
      description: "Huile sèche pour le corps et les cheveux, enrichie en particules d'or pour un éclat sublime.",
      prix: 25000,
      image_url: "/images/complet2.jpg",
      en_stock: true,
      note: 4.9,
      nombre_avis: 52,
      category: "soin"
    },
    {
      id: "acc1",
      nom: "Sac à Main Signature",
      description: "Sac à main en cuir véritable, l'accessoire parfait pour compléter votre look WOOMAAN.",
      prix: 85000,
      image_url: "/images/complet6.jpg",
      couleurs_disponibles: ["Noir", "Beige", "Rouge Rubis"],
      en_stock: true,
      note: 4.7,
      nombre_avis: 18,
      category: "accessoire"
    },
    {
      id: "acc2",
      nom: "Sac à Main Signature",
      description: "Sac à main en cuir véritable, l'accessoire parfait pour compléter votre look WOOMAAN.",
      prix: 85000,
      image_url: "/images/complet7.jpg",
      couleurs_disponibles: ["Noir", "Beige", "Rouge Rubis"],
      en_stock: true,
      note: 4.7,
      nombre_avis: 18,
      category: "accessoire"
    },
    {
      id: "acc1",
      nom: "Sac à Main Signature",
      description: "Sac à main en cuir véritable, l'accessoire parfait pour compléter votre look WOOMAAN.",
      prix: 85000,
      image_url: "/images/complet8.jpg",
      couleurs_disponibles: ["Noir", "Beige", "Rouge Rubis"],
      en_stock: true,
      note: 4.7,
      nombre_avis: 18,
      category: "accessoire"
    },
    {
      id: "acc1",
      nom: "Sac à Main Signature",
      description: "Sac à main en cuir véritable, l'accessoire parfait pour compléter votre look WOOMAAN.",
      prix: 85000,
      image_url: "/images/complet9.jpg",
      couleurs_disponibles: ["Noir", "Beige", "Rouge Rubis"],
      en_stock: true,
      note: 4.7,
      nombre_avis: 18,
      category: "accessoire"
    },
    {
      id: "acc1",
      nom: "Sac à Main Signature",
      description: "Sac à main en cuir véritable, l'accessoire parfait pour compléter votre look WOOMAAN.",
      prix: 85000,
      image_url: "/images/complet10.jpg",
      couleurs_disponibles: ["Noir", "Beige", "Rouge Rubis"],
      en_stock: true,
      note: 4.7,
      nombre_avis: 18,
      category: "accessoire"
    },
    {
      id: "acc1",
      nom: "Sac à Main Signature",
      description: "Sac à main en cuir véritable, l'accessoire parfait pour compléter votre look WOOMAAN.",
      prix: 85000,
      image_url: "/images/complet11.jpg",
      couleurs_disponibles: ["Noir", "Beige", "Rouge Rubis"],
      en_stock: true,
      note: 4.7,
      nombre_avis: 18,
      category: "accessoire"
    },
    {
      id: "acc1",
      nom: "Sac à Main Signature",
      description: "Sac à main en cuir véritable, l'accessoire parfait pour compléter votre look WOOMAAN.",
      prix: 85000,
      image_url: "/images/complet12.jpg",
      couleurs_disponibles: ["Noir", "Beige", "Rouge Rubis"],
      en_stock: true,
      note: 4.7,
      nombre_avis: 18,
      category: "accessoire"
    },
    {
      id: "acc1",
      nom: "Sac à Main Signature",
      description: "Sac à main en cuir véritable, l'accessoire parfait pour compléter votre look WOOMAAN.",
      prix: 85000,
      image_url: "/images/polo1.jpg",
      couleurs_disponibles: ["Noir", "Beige", "Rouge Rubis"],
      en_stock: true,
      note: 4.7,
      nombre_avis: 18,
      category: "accessoire"
    },
    {
      id: "acc1",
      nom: "Sac à Main Signature",
      description: "Sac à main en cuir véritable, l'accessoire parfait pour compléter votre look WOOMAAN.",
      prix: 85000,
      image_url: "/images/polo2.jpg",
      couleurs_disponibles: ["Noir", "Beige", "Rouge Rubis"],
      en_stock: true,
      note: 4.7,
      nombre_avis: 18,
      category: "accessoire"
    },
    {
      id: "acc1",
      nom: "Sac à Main Signature",
      description: "Sac à main en cuir véritable, l'accessoire parfait pour compléter votre look WOOMAAN.",
      prix: 85000,
      image_url: "/images/polo3.jpg",
      couleurs_disponibles: ["Noir", "Beige", "Rouge Rubis"],
      en_stock: true,
      note: 4.7,
      nombre_avis: 18,
      category: "accessoire"
    },
    {
      id: "acc1",
      nom: "Sac à Main Signature",
      description: "Sac à main en cuir véritable, l'accessoire parfait pour compléter votre look WOOMAAN.",
      prix: 85000,
      image_url: "/images/polo4.jpg",
      couleurs_disponibles: ["Noir", "Beige", "Rouge Rubis"],
      en_stock: true,
      note: 4.7,
      nombre_avis: 18,
      category: "accessoire"
    },
    {
      id: "acc1",
      nom: "Sac à Main Signature",
      description: "Sac à main en cuir véritable, l'accessoire parfait pour compléter votre look WOOMAAN.",
      prix: 85000,
      image_url: "/images/polo5.jpg",
      couleurs_disponibles: ["Noir", "Beige", "Rouge Rubis"],
      en_stock: true,
      note: 4.7,
      nombre_avis: 18,
      category: "accessoire"
    },
    {
      id: "acc1",
      nom: "Sac à Main Signature",
      description: "Sac à main en cuir véritable, l'accessoire parfait pour compléter votre look WOOMAAN.",
      prix: 85000,
      image_url: "/images/polo6.jpg",
      couleurs_disponibles: ["Noir", "Beige", "Rouge Rubis"],
      en_stock: true,
      note: 4.7,
      nombre_avis: 18,
      category: "accessoire"
    },
    {
      id: "prod3",
      nom: "Robe Soirée Premium",
      description: "Création exclusive pour grandes occasions, alliant tradition africaine et modernité.",
      prix: 295000,
      image_url: "/images/complet4.jpg",
      collection_id: "col3",
      collection_nom: "Collection Soirée",
      tailles_disponibles: ["XS", "S", "M", "L"],
      couleurs_disponibles: ["Or Royal", "Emeraude", "Pourpre"],
      en_stock: true,
      note: 5.0,
      nombre_avis: 45,
      category: "vetement"
    },
    {
      id: "soin2",
      nom: "Crème Corps au Karité",
      description: "Crème riche et nourrissante pour une peau douce et hydratée toute la journée.",
      prix: 18000,
      image_url: "/images/robepolo2.jpg",
      en_stock: true,
      note: 4.8,
      nombre_avis: 67,
      category: "soin"
    },
    {
      id: "acc2",
      nom: "Boucles d'oreilles Plume d'Or",
      description: "Élégantes boucles d'oreilles pendantes, plaquées or, design exclusif.",
      prix: 35000,
      image_url: "/images/robepolo1.jpg",
      couleurs_disponibles: ["Or", "Argent"],
      en_stock: true,
      note: 4.9,
      nombre_avis: 25,
      category: "accessoire"
    },
  ];

  const loadData = useCallback(async () => {
    try {
      // For now, we use mock data. This can be replaced with a service call.
      setProducts(mockProducts);
    } catch (error) {
      console.error("Failed to load data:", error);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filterProducts = useCallback(() => {
    let filtered = [...products];

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedCategory !== "all") {
        filtered = filtered.filter(p => p.category === selectedCategory);
    }

    if (priceRange !== "all") {
      const [min, max] = priceRange.split("-").map(Number);
      filtered = filtered.filter(product => {
        if (max) {
          return product.prix >= min && product.prix <= max;
        } else {
          return product.prix >= min;
        }
      });
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "prix_asc":
          return a.prix - b.prix;
        case "prix_desc":
          return b.prix - a.prix;
        case "note":
          return b.note - a.note;
        default:
          return a.nom.localeCompare(b.nom);
      }
    });

    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory, priceRange, sortBy]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    filterProducts();
  }, [filterProducts]);

  const addToCart = () => {
    if (!selectedProduct) return;
    if (selectedProduct.category === 'vetement' && (!selectedTaille || !selectedCouleur)) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner une taille et une couleur",
        variant: "destructive",
      });
      return;
    }

    const existingItem = cart.find(item => 
      item.product.id === selectedProduct.id && 
      item.taille === selectedTaille && 
      item.couleur === selectedCouleur
    );

    if (existingItem) {
      setCart(cart.map(item =>
        item === existingItem
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ));
    } else {
      setCart([...cart, {
        product: selectedProduct,
        quantity,
        taille: selectedTaille,
        couleur: selectedCouleur
      }]);
    }

    toast({
      title: "Produit ajouté",
      description: `${selectedProduct.nom} ajouté au panier`,
    });

    setShowProductModal(false);
    resetProductSelection();
  };

  const removeFromCart = (index: number) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  const updateCartQuantity = (index: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(index);
      return;
    }
    setCart(cart.map((item, i) => 
      i === index ? { ...item, quantity: newQuantity } : item
    ));
  };

  const resetProductSelection = () => {
    setSelectedProduct(null);
    setSelectedTaille("");
    setSelectedCouleur("");
    setQuantity(1);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.product.prix * item.quantity), 0);
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      toast({
        title: "Panier vide",
        description: "Ajoutez des produits à votre panier avant de commander",
        variant: "destructive",
      });
      return;
    }

    if (!orderData.nom || !orderData.email || !orderData.telephone) {
      toast({
        title: "Informations manquantes",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      });
      return;
    }

    try {
      const orderToCreate = {
        customer_name: `${orderData.prenom} ${orderData.nom}`,
        customer_email: orderData.email,
        customer_phone: orderData.telephone,
        customer_address: orderData.adresse,
        customer_city: orderData.ville,
        notes: orderData.notes,
        total_amount: getTotalPrice(),
      };

      const itemsToCreate = cart.map(item => ({
        product_id: item.product.id,
        product_name: item.product.nom,
        quantity: item.quantity,
        price: item.product.prix,
        size: item.taille || '',
        color: item.couleur || '',
      }));

      await onlineOrderService.createOrder(orderToCreate, itemsToCreate);

      toast({
        title: "Commande confirmée",
        description: "Votre commande a été envoyée avec succès. Nous vous contactons bientôt.",
      });

      setCart([]);
      setOrderData({
        nom: "",
        prenom: "",
        email: "",
        telephone: "",
        adresse: "",
        ville: "",
        notes: ""
      });
      setShowCheckout(false);
    } catch (error) {
      console.error("Failed to create order:", error);
      toast({
        title: "Erreur de commande",
        description: "Impossible de passer la commande. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => router.push("/")} className="p-2">
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10">
                  <Image
                    src="/woomaan-logo.svg"
                    alt="WOOMAAN by Yolanda Diva Logo"
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-black tracking-wider">WOOMAAN</h1>
                  <p className="text-sm woomaan-text-gradient font-medium tracking-wide">BY YOLANDA DIVA</p>
                </div>
              </div>
            </div>
            <Button onClick={() => setShowCart(true)} className="relative bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black">
              <ShoppingCart className="h-5 w-5 mr-2" />
              Panier ({cart.length})
              {cart.length > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-black text-yellow-400">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher une création..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as ProductCategory | "all")}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les catégories</SelectItem>
                <SelectItem value="vetement">Vêtements</SelectItem>
                <SelectItem value="accessoire">Accessoires</SelectItem>
                <SelectItem value="soin">Produits de Soin</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Prix" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les prix</SelectItem>
                <SelectItem value="0-50000">0 - 50,000 FCFA</SelectItem>
                <SelectItem value="50000-100000">50,000 - 100,000 FCFA</SelectItem>
                <SelectItem value="100000-200000">100,000 - 200,000 FCFA</SelectItem>
                <SelectItem value="200000">200,000+ FCFA</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Trier par" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nom">Nom A-Z</SelectItem>
                <SelectItem value="prix_asc">Prix croissant</SelectItem>
                <SelectItem value="prix_desc">Prix décroissant</SelectItem>
                <SelectItem value="note">Mieux notées</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={product.image_url}
                  alt={product.nom}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  className="object-cover transition-transform hover:scale-105"
                />
                <div className="absolute top-2 right-2">
                  <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-semibold">
                    {product.category === 'vetement' && product.collection_nom ? product.collection_nom.replace("Collection ", "") : product.category === 'accessoire' ? 'Accessoire' : 'Soin'}
                  </Badge>
                </div>
                {!product.en_stock && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <Badge variant="destructive">Rupture de stock</Badge>
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-2 line-clamp-1">{product.nom}</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                
                <div className="flex items-center mb-3">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.note) ? "text-yellow-400 fill-current" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 ml-2">
                    {product.note} ({product.nombre_avis} avis)
                  </span>
                </div>

                <div className="flex justify-between items-center mb-4">
                  <span className="text-xl font-bold woomaan-text-gradient">
                    {product.prix.toLocaleString()} FCFA
                  </span>
                </div>

                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedProduct(product);
                      setShowProductModal(true);
                    }}
                    disabled={!product.en_stock}
                    className="flex-1"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Voir
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      setSelectedProduct(product);
                      setShowProductModal(true);
                    }}
                    disabled={!product.en_stock}
                    className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black"
                  >
                    <ShoppingCart className="h-4 w-4 mr-1" />
                    Ajouter
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Aucune création trouvée</p>
          </div>
        )}
      </div>

      <Dialog open={showProductModal} onOpenChange={setShowProductModal}>
        <DialogContent className="max-w-4xl">
          {selectedProduct && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative h-96 overflow-hidden rounded-lg">
                <Image
                  src={selectedProduct.image_url}
                  alt={selectedProduct.nom}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="space-y-4">
                <div>
                  <h2 className="text-2xl font-bold">{selectedProduct.nom}</h2>
                  <p className="text-gray-600 mt-2">{selectedProduct.description}</p>
                </div>

                <div className="flex items-center">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(selectedProduct.note) ? "text-yellow-400 fill-current" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-gray-600">
                    {selectedProduct.note} ({selectedProduct.nombre_avis} avis)
                  </span>
                </div>

                <div className="text-3xl font-bold woomaan-text-gradient">
                  {selectedProduct.prix.toLocaleString()} FCFA
                </div>

                <div className="space-y-4">
                  {selectedProduct.category === 'vetement' && selectedProduct.tailles_disponibles && (
                    <div>
                      <Label>Taille</Label>
                      <Select value={selectedTaille} onValueChange={setSelectedTaille}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choisir une taille" />
                        </SelectTrigger>
                        <SelectContent>
                          {selectedProduct.tailles_disponibles.map((taille) => (
                            <SelectItem key={taille} value={taille}>
                              {taille}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {(selectedProduct.category === 'vetement' || selectedProduct.category === 'accessoire') && selectedProduct.couleurs_disponibles && (
                    <div>
                      <Label>Couleur</Label>
                      <Select value={selectedCouleur} onValueChange={setSelectedCouleur}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choisir une couleur" />
                        </SelectTrigger>
                        <SelectContent>
                          {selectedProduct.couleurs_disponibles.map((couleur) => (
                            <SelectItem key={couleur} value={couleur}>
                              {couleur}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div>
                    <Label>Quantité</Label>
                    <div className="flex items-center space-x-2 mt-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="px-4 py-2 border rounded">{quantity}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setQuantity(quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <Button onClick={addToCart} className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black" size="lg">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Ajouter au panier
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showCart} onOpenChange={setShowCart}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Mon Panier ({cart.length} articles)</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {cart.length === 0 ? (
              <p className="text-center text-gray-500 py-8">Votre panier est vide</p>
            ) : (
              cart.map((item, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 border rounded-lg">
                  <div className="relative w-16 h-16 overflow-hidden rounded">
                    <Image
                      src={item.product.image_url}
                      alt={item.product.nom}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">{item.product.nom}</h4>
                    <p className="text-sm text-gray-600">
                      {item.taille && `Taille: ${item.taille}`}
                      {item.taille && item.couleur && ' | '}
                      {item.couleur && `Couleur: ${item.couleur}`}
                    </p>
                    <p className="text-green-600 font-semibold">
                      {item.product.prix.toLocaleString()} FCFA
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateCartQuantity(index, item.quantity - 1)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="px-2">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateCartQuantity(index, item.quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeFromCart(index)}
                  >
                    Supprimer
                  </Button>
                </div>
              ))
            )}
          </div>
          {cart.length > 0 && (
            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold">Total:</span>
                <span className="text-2xl font-bold woomaan-text-gradient">
                  {getTotalPrice().toLocaleString()} FCFA
                </span>
              </div>
              <Button
                onClick={() => {
                  setShowCart(false);
                  setShowCheckout(true);
                }}
                className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black"
                size="lg"
              >
                Passer la commande
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showCheckout} onOpenChange={setShowCheckout}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Finaliser la commande</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nom">Nom *</Label>
                <Input
                  id="nom"
                  value={orderData.nom}
                  onChange={(e) => setOrderData({ ...orderData, nom: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="prenom">Prénom</Label>
                <Input
                  id="prenom"
                  value={orderData.prenom}
                  onChange={(e) => setOrderData({ ...orderData, prenom: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={orderData.email}
                onChange={(e) => setOrderData({ ...orderData, email: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="telephone">Téléphone *</Label>
              <Input
                id="telephone"
                value={orderData.telephone}
                onChange={(e) => setOrderData({ ...orderData, telephone: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="adresse">Adresse</Label>
              <Input
                id="adresse"
                value={orderData.adresse}
                onChange={(e) => setOrderData({ ...orderData, adresse: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="ville">Ville</Label>
              <Input
                id="ville"
                value={orderData.ville}
                onChange={(e) => setOrderData({ ...orderData, ville: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="notes">Notes (optionnel)</Label>
              <Textarea
                id="notes"
                value={orderData.notes}
                onChange={(e) => setOrderData({ ...orderData, notes: e.target.value })}
                placeholder="Instructions spéciales, préférences de livraison..."
              />
            </div>
            
            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold">Total à payer:</span>
                <span className="text-2xl font-bold woomaan-text-gradient">
                  {getTotalPrice().toLocaleString()} FCFA
                </span>
              </div>
              <Button onClick={handleCheckout} className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black" size="lg">
                Confirmer la commande
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
