import { useState, useCallback } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Download, TrendingUp, Users, Package, DollarSign, BarChart3 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Chart from "@/components/charts/Chart";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ReportData {
  [key: string]: string | number;
  period: string;
  sales: number;
  orders: number;
  clients: number;
  revenue: number;
}

export default function RapportsPage() {
  const [activeTab, setActiveTab] = useState("ventes");
  const [selectedPeriod, setSelectedPeriod] = useState("mois");
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Données mock pour les rapports
  const mockSalesData: ReportData[] = [
    { period: "Jan 2024", sales: 45, orders: 23, clients: 18, revenue: 2850000 },
    { period: "Fév 2024", sales: 52, orders: 28, clients: 22, revenue: 3200000 },
    { period: "Mar 2024", sales: 38, orders: 19, clients: 15, revenue: 2400000 },
    { period: "Avr 2024", sales: 61, orders: 32, clients: 26, revenue: 3850000 },
    { period: "Mai 2024", sales: 48, orders: 25, clients: 20, revenue: 3100000 },
    { period: "Jun 2024", sales: 55, orders: 29, clients: 24, revenue: 3500000 },
  ];

  const handlePeriodChange = (value: string) => {
    setSelectedPeriod(value);
    if (value !== 'personnalise') {
      setDateRange({ from: "", to: "" });
    }
  };

  const generateReport = useCallback(async () => {
    setLoading(true);
    try {
      // Simulation de génération de rapport
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      let description = "Le rapport a été généré avec succès.";
      if (selectedPeriod === 'personnalise' && dateRange.from && dateRange.to) {
        description = `Rapport généré pour la période du ${dateRange.from} au ${dateRange.to}.`;
      }

      toast({
        title: "Rapport généré",
        description: description,
      });
    } catch (error) {
      console.error("Failed to generate report:", error);
      toast({
        title: "Erreur",
        description: "Impossible de générer le rapport.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast, selectedPeriod, dateRange]);

  const exportReport = (format: string) => {
    toast({
      title: "Export en cours",
      description: `Export du rapport en format ${format.toUpperCase()}...`,
    });
  };

  const totalRevenue = mockSalesData.reduce((sum, item) => sum + item.revenue, 0);
  const totalOrders = mockSalesData.reduce((sum, item) => sum + item.orders, 0);
  const totalClients = mockSalesData.reduce((sum, item) => sum + item.clients, 0);
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Rapports et Analyses
            </CardTitle>
            <CardDescription>
              Consultez les performances de votre atelier et générez des rapports détaillés
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4 mb-6 items-end">
              <div className="flex-grow">
                <Label>Période</Label>
                <Select value={selectedPeriod} onValueChange={handlePeriodChange}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Période" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="semaine">Cette semaine</SelectItem>
                    <SelectItem value="mois">Ce mois</SelectItem>
                    <SelectItem value="trimestre">Ce trimestre</SelectItem>
                    <SelectItem value="annee">Cette année</SelectItem>
                    <SelectItem value="personnalise">Période personnalisée</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {selectedPeriod === 'personnalise' && (
                <>
                  <div className="flex-grow">
                    <Label htmlFor="start-date">Date de début</Label>
                    <Input
                      id="start-date"
                      type="date"
                      value={dateRange.from}
                      onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                    />
                  </div>
                  <div className="flex-grow">
                    <Label htmlFor="end-date">Date de fin</Label>
                    <Input
                      id="end-date"
                      type="date"
                      value={dateRange.to}
                      onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                    />
                  </div>
                </>
              )}

              <div className="flex gap-2">
                <Button onClick={generateReport} disabled={loading}>
                  <BarChart3 className="mr-2 h-4 w-4" />
                  {loading ? "Génération..." : "Générer"}
                </Button>
                <Button variant="outline" onClick={() => exportReport("pdf")}>
                  <Download className="mr-2 h-4 w-4" />
                  PDF
                </Button>
              </div>
            </div>

            {/* Métriques principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <DollarSign className="h-8 w-8 text-green-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Chiffre d'affaires</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {totalRevenue.toLocaleString()} FCFA
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <Package className="h-8 w-8 text-blue-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Commandes</p>
                      <p className="text-2xl font-bold text-gray-900">{totalOrders}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <Users className="h-8 w-8 text-purple-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Clients</p>
                      <p className="text-2xl font-bold text-gray-900">{totalClients}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <TrendingUp className="h-8 w-8 text-orange-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Panier moyen</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {avgOrderValue.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})} FCFA
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="ventes" className="flex items-center">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Ventes
                </TabsTrigger>
                <TabsTrigger value="clients" className="flex items-center">
                  <Users className="mr-2 h-4 w-4" />
                  Clients
                </TabsTrigger>
                <TabsTrigger value="production" className="flex items-center">
                  <Package className="mr-2 h-4 w-4" />
                  Production
                </TabsTrigger>
                <TabsTrigger value="financier" className="flex items-center">
                  <DollarSign className="mr-2 h-4 w-4" />
                  Financier
                </TabsTrigger>
              </TabsList>

              <TabsContent value="ventes" className="space-y-4 pt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Évolution des ventes</CardTitle>
                    <CardDescription>
                      Analyse des ventes sur les 6 derniers mois
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Chart
                      type="bar"
                      data={mockSalesData}
                      xKey="period"
                      yKey="revenue"
                      title="Chiffre d'affaires mensuel"
                      color="#10B981"
                    />
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Top produits</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span>Chemise Classique</span>
                          <span className="font-semibold">45 ventes</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Pantalon Sur-mesure</span>
                          <span className="font-semibold">38 ventes</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Costume Complet</span>
                          <span className="font-semibold">32 ventes</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Répartition par collection</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Chart
                        type="pie"
                        data={{
                          labels: ['Collection Harmattan', 'Collection Moderne', 'Collection Classique'],
                          datasets: [{
                            label: 'Répartition des ventes',
                            data: [35, 28, 37],
                            backgroundColor: ['#10B981', '#3B82F6', '#8B5CF6'],
                          }]
                        }}
                        title="Ventes par collection"
                      />
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="clients" className="space-y-4 pt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Analyse clientèle</CardTitle>
                    <CardDescription>
                      Évolution et segmentation de la clientèle
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Chart
                      type="line"
                      data={mockSalesData}
                      xKey="period"
                      yKey="clients"
                      title="Nouveaux clients par mois"
                      color="#3B82F6"
                    />
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Clients fidèles</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span>M. Kouamé</span>
                          <span className="font-semibold">12 commandes</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Mme Bamba</span>
                          <span className="font-semibold">8 commandes</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Dr. Diarra</span>
                          <span className="font-semibold">7 commandes</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Satisfaction client</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Chart
                        type="pie"
                        data={{
                          labels: ['Très satisfait', 'Satisfait', 'À améliorer'],
                          datasets: [{
                            label: 'Satisfaction',
                            data: [78, 18, 4],
                            backgroundColor: ['#22C55E', '#FBBF24', '#EF4444'],
                          }]
                        }}
                        title="Satisfaction client"
                      />
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="production" className="space-y-4 pt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Performance de production</CardTitle>
                    <CardDescription>
                      Suivi de la production et des délais
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 border rounded-lg">
                        <p className="text-3xl font-bold text-green-600">95%</p>
                        <p className="text-sm text-gray-600">Commandes livrées à temps</p>
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <p className="text-3xl font-bold text-blue-600">7.2</p>
                        <p className="text-sm text-gray-600">Jours délai moyen</p>
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <p className="text-3xl font-bold text-purple-600">156</p>
                        <p className="text-sm text-gray-600">Pièces produites ce mois</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="financier" className="space-y-4 pt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Analyse financière</CardTitle>
                    <CardDescription>
                      Vue d'ensemble des finances de l'atelier
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-3">Revenus par mois</h4>
                        <Chart
                          type="line"
                          data={mockSalesData}
                          xKey="period"
                          yKey="revenue"
                          title="Évolution du CA"
                          color="#10B981"
                        />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-3">Répartition des coûts</h4>
                        <Chart
                          type="pie"
                          data={{
                            labels: ["Matières premières", "Main d'œuvre", "Frais généraux"],
                            datasets: [{
                              label: 'Coûts',
                              data: [45, 35, 20],
                              backgroundColor: ['#F97316', '#FBBF24', '#A8A29E'],
                            }]
                          }}
                          title="Répartition des coûts"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
