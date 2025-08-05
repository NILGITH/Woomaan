
import { useState, useEffect, useCallback } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  BarChart3, 
  Download, 
  Filter, 
  DollarSign,
  Package,
  Users,
  Settings,
  Eye
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { rapportsService, FiltreRapport, RapportVente, RapportProduction, RapportStock, RapportClient, ChartMetric } from "@/services/rapportsService";
import Chart from "@/components/charts/Chart";
import type { ChartData } from "chart.js";

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState("vue-globale");
  const [filtres, setFiltres] = useState<FiltreRapport>({
    date_debut: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    date_fin: new Date().toISOString().split('T')[0],
    type_rapport: "global"
  });
  
  const [rapportVentes, setRapportVentes] = useState<RapportVente | null>(null);
  const [rapportProduction, setRapportProduction] = useState<RapportProduction | null>(null);
  const [rapportStock, setRapportStock] = useState<RapportStock | null>(null);
  const [rapportClients, setRapportClients] = useState<RapportClient | null>(null);
  
  const [graphiqueVentesData, setGraphiqueVentesData] = useState<ChartData<"line"> | null>(null);
  const [graphiqueProductionData, setGraphiqueProductionData] = useState<ChartData<"bar"> | null>(null);
  const [graphiqueStockData, setGraphiqueStockData] = useState<ChartData<"pie"> | null>(null);
  const [graphiqueClientsData, setGraphiqueClientsData] = useState<ChartData<"line"> | null>(null);

  const [loading, setLoading] = useState(true);
  const [filtreDialogOpen, setFiltreDialogOpen] = useState(false);
  
  const { toast } = useToast();

  const chargerDonneesRapports = useCallback(async () => {
    setLoading(true);
    try {
      const [ventes, production, stock, clients] = await Promise.all([
        rapportsService.getRapportVentes(filtres),
        rapportsService.getRapportProduction(filtres),
        rapportsService.getRapportStock(filtres),
        rapportsService.getRapportClients(filtres)
      ]);

      setRapportVentes(ventes);
      setRapportProduction(production);
      setRapportStock(stock);
      setRapportClients(clients);

    } catch (err) {
      console.error("Erreur lors du chargement des rapports:", err);
      toast({
        title: "Erreur",
        description: "Impossible de charger les rapports",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [filtres, toast]);

  const chargerDonneesGraphique = useCallback(async (metric: ChartMetric) => {
    try {
      const data = await rapportsService.getDonneesGraphique(metric, filtres);
      if (data) {
        if (metric.startsWith("ventes")) setGraphiqueVentesData(data as ChartData<"line">);
        if (metric.startsWith("production")) setGraphiqueProductionData(data as ChartData<"bar">);
        if (metric.startsWith("stock")) setGraphiqueStockData(data as ChartData<"pie">);
        if (metric.startsWith("clients")) setGraphiqueClientsData(data as ChartData<"line">);
      }
    } catch (err) {
      console.error(`Erreur lors du chargement du graphique ${metric}:`, err);
      toast({
        title: "Erreur Graphique",
        description: `Impossible de charger les données pour ${metric}`,
        variant: "destructive",
      });
    }
  }, [filtres, toast]);

  useEffect(() => {
    chargerDonneesRapports();
  }, [chargerDonneesRapports]);

  useEffect(() => {
    chargerDonneesGraphique("ventes_ca");
    chargerDonneesGraphique("production_evolution");
    chargerDonneesGraphique("stock_valeur");
    chargerDonneesGraphique("clients_nouveaux");
  }, [chargerDonneesGraphique]);

  const handleExport = async (type: string, format: "excel" | "pdf" | "csv") => {
    try {
      const filename = await rapportsService.exporterRapport(type, format, filtres);
      toast({
        title: "Export réussi",
        description: `Rapport exporté : ${filename}`,
      });
    } catch (err) {
      console.error("Erreur d'export:", err);
      toast({
        title: "Erreur d'export",
        description: "Impossible d'exporter le rapport",
        variant: "destructive",
      });
    }
  };

  const appliquerFiltres = () => {
    setFiltreDialogOpen(false);
    chargerDonneesRapports();
    chargerDonneesGraphique("ventes_ca");
    chargerDonneesGraphique("production_evolution");
    chargerDonneesGraphique("stock_valeur");
    chargerDonneesGraphique("clients_nouveaux");
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div>Chargement des rapports...</div>
        </div>
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
                  <BarChart3 className="mr-2 h-5 w-5" />
                  Rapports et Analyses
                </CardTitle>
                <CardDescription>
                  Tableau de bord analytique pour CISS ST MOISE - Période: {filtres.date_debut} au {filtres.date_fin}
                </CardDescription>
              </div>
              <div className="flex space-x-2">
                <Dialog open={filtreDialogOpen} onOpenChange={setFiltreDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Filter className="mr-2 h-4 w-4" />
                      Filtres
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Filtres de rapport</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="date_debut">Date de début</Label>
                        <Input
                          id="date_debut"
                          type="date"
                          value={filtres.date_debut}
                          onChange={(e) => setFiltres({ ...filtres, date_debut: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="date_fin">Date de fin</Label>
                        <Input
                          id="date_fin"
                          type="date"
                          value={filtres.date_fin}
                          onChange={(e) => setFiltres({ ...filtres, date_fin: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2 mt-4">
                      <Button variant="outline" onClick={() => setFiltreDialogOpen(false)}>
                        Annuler
                      </Button>
                      <Button onClick={appliquerFiltres}>
                        Appliquer les filtres
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
                <Button variant="outline" onClick={() => handleExport("global", "excel")}>
                  <Download className="mr-2 h-4 w-4" />
                  Exporter
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="vue-globale"><Eye className="mr-2 h-4 w-4" />Vue Globale</TabsTrigger>
            <TabsTrigger value="ventes"><DollarSign className="mr-2 h-4 w-4" />Ventes</TabsTrigger>
            <TabsTrigger value="production"><Settings className="mr-2 h-4 w-4" />Production</TabsTrigger>
            <TabsTrigger value="stock"><Package className="mr-2 h-4 w-4" />Stock</TabsTrigger>
            <TabsTrigger value="clients"><Users className="mr-2 h-4 w-4" />Clients</TabsTrigger>
          </TabsList>

          <TabsContent value="vue-globale" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Chiffre d'affaires</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{rapportVentes?.chiffre_affaires.toLocaleString()} FCFA</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Ordres terminés</CardTitle>
                  <Settings className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{rapportProduction?.ordres_termines}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Valeur du stock</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{rapportStock?.valeur_stock_total.toLocaleString()} FCFA</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Clients actifs</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{rapportClients?.clients_actifs}</div>
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Évolution du chiffre d'affaires</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                {graphiqueVentesData && <Chart type="line" data={graphiqueVentesData} />}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ventes" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Évolution des ventes</CardTitle>
                  <Select defaultValue="ventes_ca" onValueChange={(value: ChartMetric) => chargerDonneesGraphique(value)}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ventes_ca">Chiffre d'affaires</SelectItem>
                      <SelectItem value="ventes_nombre">Nombre de ventes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent className="h-80">
                {graphiqueVentesData && <Chart type="line" data={graphiqueVentesData} />}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="production" className="space-y-6">
             <Card>
              <CardHeader>
                <CardTitle>Évolution de la production</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                {graphiqueProductionData && <Chart type="bar" data={graphiqueProductionData} />}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stock" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Stock par catégorie</CardTitle>
                  <Select defaultValue="stock_valeur" onValueChange={(value: ChartMetric) => chargerDonneesGraphique(value)}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="stock_valeur">Valeur du stock</SelectItem>
                      <SelectItem value="stock_quantite">Quantité en stock</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent className="h-80">
                {graphiqueStockData && <Chart type="pie" data={graphiqueStockData} />}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="clients" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Évolution des nouveaux clients</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                {graphiqueClientsData && <Chart type="line" data={graphiqueClientsData} />}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
