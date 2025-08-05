import { useState, useEffect, useCallback, useRef } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Trash2, Search, Barcode, Printer, ShoppingCart, Minus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { ventesService, ArticleVente, LigneVente, Vente } from "@/services/ventesService";
import { clientService, Client } from "@/services/clientService";
import { parametresService, Taille, Couleur, DeclinaisonArticle } from "@/services/parametresService";

type PanierItem = LigneVente & {
  taille_nom?: string;
  couleur_nom?: string;
  couleur_hex?: string;
};

export default function SalesPage() {
  const [articles, setArticles] = useState<ArticleVente[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [tailles, setTailles] = useState<Taille[]>([]);
  const [couleurs, setCouleurs] = useState<Couleur[]>([]);
  const [panier, setPanier] = useState<PanierItem[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [barcode, setBarcode] = useState("");
  const { toast } = useToast();

  const [declinaisonDialog, setDeclinaisonDialog] = useState<{ open: boolean; article: ArticleVente | null }>({ open: false, article: null });
  const [paiementDialog, setPaiementDialog] = useState(false);
  const [recuDialog, setRecuDialog] = useState<{ open: boolean; vente: Vente | null }>({ open: false, vente: null });

  const barcodeRef = useRef<HTMLInputElement>(null);

  const loadInitialData = useCallback(async () => {
    setLoading(true);
    try {
      const [articlesData, clientsData, taillesData, couleursData] = await Promise.all([
        ventesService.getArticlesVente(),
        clientService.getClients(),
        parametresService.getTailles(),
        parametresService.getCouleurs(),
      ]);
      setArticles(articlesData);
      setClients(clientsData);
      setTailles(taillesData);
      setCouleurs(couleursData);
    } catch (error) {
      console.error(error);
      toast({ title: "Erreur", description: "Impossible de charger les données initiales.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  const handleAddToPanier = (article: ArticleVente, declinaison: DeclinaisonArticle) => {
    const itemExistant = panier.find(item => item.declinaison_id === declinaison.id);
    const taille = tailles.find(t => t.id === declinaison.taille_id);
    const couleur = couleurs.find(c => c.id === declinaison.couleur_id);

    if (itemExistant) {
      setPanier(panier.map(item =>
        item.declinaison_id === declinaison.id
          ? { ...item, quantite: item.quantite + 1, prix_total: (item.quantite + 1) * item.prix_unitaire }
          : item
      ));
    } else {
      const newItem: PanierItem = {
        id: declinaison.id,
        article_id: article.id,
        declinaison_id: declinaison.id,
        nom_article: article.nom,
        quantite: 1,
        prix_unitaire: declinaison.prix_vente || article.prix_base,
        prix_total: declinaison.prix_vente || article.prix_base,
        taille: taille?.code,
        taille_nom: taille?.nom,
        couleur: couleur?.nom,
        couleur_hex: couleur?.code_hex,
      };
      setPanier([...panier, newItem]);
    }
    toast({ title: "Succès", description: `${article.nom} ajouté au panier.` });
  };

  const handleSelectArticle = (article: ArticleVente) => {
    if (article.declinaisons && article.declinaisons.length > 0) {
      setDeclinaisonDialog({ open: true, article });
    } else {
      toast({ title: "Info", description: "Cet article n'a pas de déclinaisons." });
    }
  };

  const handleBarcodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!barcode) return;
    const result = await ventesService.getArticleByCodeBarre(barcode);
    if (result && result.declinaison) {
      handleAddToPanier(result.article, result.declinaison);
      setBarcode("");
    } else {
      toast({ title: "Erreur", description: "Article non trouvé pour ce code-barres.", variant: "destructive" });
    }
  };

  const updateQuantite = (declinaisonId: string, newQuantite: number) => {
    if (newQuantite <= 0) {
      setPanier(panier.filter(item => item.declinaison_id !== declinaisonId));
    } else {
      setPanier(panier.map(item =>
        item.declinaison_id === declinaisonId
          ? { ...item, quantite: newQuantite, prix_total: newQuantite * item.prix_unitaire }
          : item
      ));
    }
  };

  const { sousTotal, total } = panier.reduce(
    (acc, item) => {
      acc.sousTotal += item.prix_total;
      acc.total += item.prix_total;
      return acc;
    },
    { sousTotal: 0, total: 0 }
  );

  const handleValiderVente = async (modePaiement: Vente["mode_paiement"]) => {
    if (panier.length === 0) {
      toast({ title: "Erreur", description: "Le panier est vide.", variant: "destructive" });
      return;
    }

    const venteData: Partial<Vente> = {
      client_id: selectedClient?.id,
      client_nom: selectedClient ? `${selectedClient.prenom} ${selectedClient.nom}` : "Client au comptant",
      lignes: panier,
      sous_total: sousTotal,
      total: total,
      mode_paiement: modePaiement,
    };

    const nouvelleVente = await ventesService.createVente(venteData);
    setRecuDialog({ open: true, vente: nouvelleVente });
    setPanier([]);
    setSelectedClient(null);
    setPaiementDialog(false);
    toast({ title: "Succès", description: `Vente ${nouvelleVente.numero_facture} validée.` });
  };

  const filteredArticles = articles.filter(article =>
    article.nom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <DashboardLayout><div>Chargement...</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-100px)]">
        {/* Left side - Articles */}
        <div className="lg:col-span-2 flex flex-col h-full">
          <Card className="flex-grow flex flex-col">
            <CardHeader>
              <CardTitle>Articles en vente</CardTitle>
              <div className="flex gap-2 pt-2">
                <div className="relative flex-grow">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Rechercher un article..." className="pl-8" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                </div>
                <form onSubmit={handleBarcodeSubmit} className="relative">
                  <Barcode className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Scanner un code-barres" className="pl-8" ref={barcodeRef} value={barcode} onChange={e => setBarcode(e.target.value)} />
                </form>
              </div>
            </CardHeader>
            <CardContent className="flex-grow overflow-y-auto">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {filteredArticles.map(article => (
                  <Card key={article.id} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleSelectArticle(article)}>
                    <CardContent className="p-2 text-center">
                      <div className="w-full h-24 bg-gray-100 rounded-md mb-2 flex items-center justify-center">
                        <ShoppingCart className="h-10 w-10 text-gray-400" />
                      </div>
                      <p className="text-sm font-medium truncate">{article.nom}</p>
                      <p className="text-xs text-muted-foreground">{article.prix_base.toLocaleString()} FCFA</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right side - Panier */}
        <div className="flex flex-col h-full">
          <Card className="flex-grow flex flex-col">
            <CardHeader>
              <CardTitle>Panier</CardTitle>
              <Select onValueChange={id => setSelectedClient(clients.find(c => c.id === id) || null)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un client" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="comptant">Client au comptant</SelectItem>
                  {clients.map(client => (
                    <SelectItem key={client.id} value={client.id}>{client.prenom} {client.nom}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent className="flex-grow overflow-y-auto p-0">
              {panier.length === 0 ? (
                <div className="flex items-center justify-center h-full text-muted-foreground">Votre panier est vide</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Article</TableHead>
                      <TableHead>Qté</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {panier.map(item => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div className="font-medium">{item.nom_article}</div>
                          <div className="text-xs text-muted-foreground">
                            {item.taille_nom && `Taille: ${item.taille_nom}`}
                            {item.couleur_nom && ` • Couleur: ${item.couleur_nom}`}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => updateQuantite(item.declinaison_id, item.quantite - 1)}><Minus className="h-3 w-3" /></Button>
                            <span>{item.quantite}</span>
                            <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => updateQuantite(item.declinaison_id, item.quantite + 1)}><Plus className="h-3 w-3" /></Button>
                          </div>
                        </TableCell>
                        <TableCell>{item.prix_total.toLocaleString()} F</TableCell>
                        <TableCell>
                          <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => updateQuantite(item.declinaison_id, 0)}><Trash2 className="h-3 w-3" /></Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
            <div className="p-4 border-t">
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>{total.toLocaleString()} FCFA</span>
              </div>
              <Button className="w-full mt-4" size="lg" onClick={() => setPaiementDialog(true)} disabled={panier.length === 0}>
                Procéder au paiement
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Declinaison Dialog */}
      <Dialog open={declinaisonDialog.open} onOpenChange={open => setDeclinaisonDialog({ ...declinaisonDialog, open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sélectionner une déclinaison pour {declinaisonDialog.article?.nom}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {declinaisonDialog.article?.declinaisons.map(declinaison => {
              const taille = tailles.find(t => t.id === declinaison.taille_id);
              const couleur = couleurs.find(c => c.id === declinaison.couleur_id);
              return (
                <div key={declinaison.id} className="flex items-center justify-between p-2 border rounded-md">
                  <div>
                    <p>Taille: {taille?.nom || "N/A"}, Couleur: {couleur?.nom || "N/A"}</p>
                    <p className="text-sm text-muted-foreground">Stock: {declinaison.quantite_stock}</p>
                  </div>
                  <Button onClick={() => {
                    handleAddToPanier(declinaisonDialog.article, declinaison);
                    setDeclinaisonDialog({ open: false, article: null });
                  }} disabled={declinaison.quantite_stock <= 0}>
                    Ajouter
                  </Button>
                </div>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>

      {/* Paiement Dialog */}
      <Dialog open={paiementDialog} onOpenChange={setPaiementDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Finaliser la vente</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-center text-2xl font-bold">{total.toLocaleString()} FCFA</div>
            <Label>Mode de paiement</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" onClick={() => handleValiderVente("especes")}>Espèces</Button>
              <Button variant="outline" onClick={() => handleValiderVente("carte")}>Carte</Button>
              <Button variant="outline" onClick={() => handleValiderVente("mobile_money")}>Mobile Money</Button>
              <Button variant="outline" onClick={() => handleValiderVente("cheque")}>Chèque</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Recu Dialog */}
      <Dialog open={recuDialog.open} onOpenChange={open => setRecuDialog({ ...recuDialog, open })}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Reçu de caisse</DialogTitle>
          </DialogHeader>
          <div id="recu-content" className="text-sm space-y-2">
            <h3 className="text-center font-bold">WOOMAAN</h3>
            <p className="text-center text-xs">BY YOLANDA DIVA</p>
            <p className="text-center text-xs">Reçu de caisse</p>
            <hr />
            <p>Facture: {recuDialog.vente?.numero_facture}</p>
            <p>Date: {new Date(recuDialog.vente?.date_vente || "").toLocaleString("fr-FR")}</p>
            <p>Client: {recuDialog.vente?.client_nom}</p>
            <hr />
            {recuDialog.vente?.lignes.map(l => (
              <div key={l.id} className="grid grid-cols-3">
                <div className="col-span-2">
                  <p>{l.nom_article}</p>
                  <p className="text-xs text-muted-foreground">{l.quantite} x {l.prix_unitaire.toLocaleString()} F</p>
                </div>
                <p className="text-right">{l.prix_total.toLocaleString()} F</p>
              </div>
            ))}
            <hr />
            <div className="flex justify-between font-bold">
              <p>TOTAL</p>
              <p>{recuDialog.vente?.total.toLocaleString()} FCFA</p>
            </div>
            <p className="text-xs">Mode de paiement: {recuDialog.vente?.mode_paiement}</p>
            <p className="text-center text-xs pt-2">Merci de votre visite !</p>
          </div>
          <Button className="w-full" onClick={() => window.print()}>
            <Printer className="mr-2 h-4 w-4" /> Imprimer le reçu
          </Button>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
