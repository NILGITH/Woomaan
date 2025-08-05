import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Users, Package, DollarSign, TrendingUp, ShoppingCart, Calendar, AlertCircle } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Chart from "@/components/charts/Chart";

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalClients: number;
  pendingOrders: number;
  monthlyGrowth: number;
}

export default function DashboardOverview() {
  // Utilisateur mock par défaut
  const user = {
    prenom: "Casual F&I",
    nom: "Admin"
  };

  const [stats] = useState<DashboardStats>({
    totalRevenue: 18900000,
    totalOrders: 156,
    totalClients: 125,
    pendingOrders: 23,
    monthlyGrowth: 12.5
  });

  // Données mock pour les graphiques
  const revenueData = [
    { period: "Jan", revenue: 2850000 },
    { period: "Fév", revenue: 3200000 },
    { period: "Mar", revenue: 2400000 },
    { period: "Avr", revenue: 3850000 },
    { period: "Mai", revenue: 3100000 },
    { period: "Jun", revenue: 3500000 },
  ];

  const ordersData = [
    { period: "Jan", orders: 23 },
    { period: "Fév", orders: 28 },
    { period: "Mar", orders: 19 },
    { period: "Avr", orders: 32 },
    { period: "Mai", orders: 25 },
    { period: "Jun", orders: 29 },
  ];

  const recentOrders = [
    { id: "CMD001", client: "M. Laurent", montant: 85000, statut: "En cours", date: "2024-07-09" },
    { id: "CMD002", client: "Mme Dubois", montant: 65000, statut: "Terminé", date: "2024-07-08" },
    { id: "CMD003", client: "M. Martin", montant: 120000, statut: "En attente", date: "2024-07-07" },
    { id: "CMD004", client: "M. Bernard", montant: 45000, statut: "En cours", date: "2024-07-06" },
  ];

  const getStatusBadge = (statut: string) => {
    switch (statut) {
      case "Terminé":
        return <Badge className="bg-green-100 text-green-800">Terminé</Badge>;
      case "En cours":
        return <Badge className="bg-blue-100 text-blue-800">En cours</Badge>;
      case "En attente":
        return <Badge className="bg-yellow-100 text-yellow-800">En attente</Badge>;
      default:
        return <Badge variant="secondary">{statut}</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* En-tête de bienvenue */}
        <div className="bg-gradient-to-r from-yellow-500 to-black rounded-lg p-6 text-white">
          <h1 className="text-2xl font-bold mb-2">
            Bienvenue, {user?.prenom} {user?.nom}
          </h1>
          <p className="text-yellow-100">
            Voici un aperçu de l'activité de votre atelier Casual F&I
          </p>
        </div>

        {/* Métriques principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Chiffre d'affaires</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.totalRevenue.toLocaleString()} FCFA
                  </p>
                  <p className="text-xs text-yellow-600 flex items-center mt-1">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +{stats.monthlyGrowth}% ce mois
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Commandes totales</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
                  <p className="text-xs text-blue-600 flex items-center mt-1">
                    <Package className="w-3 h-3 mr-1" />
                    {stats.pendingOrders} en attente
                  </p>
                </div>
                <ShoppingCart className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Clients actifs</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalClients}</p>
                  <p className="text-xs text-purple-600 flex items-center mt-1">
                    <Users className="w-3 h-3 mr-1" />
                    +8 ce mois
                  </p>
                </div>
                <Users className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Panier moyen</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {Math.round(stats.totalRevenue / stats.totalOrders).toLocaleString()} FCFA
                  </p>
                  <p className="text-xs text-orange-600 flex items-center mt-1">
                    <BarChart className="w-3 h-3 mr-1" />
                    Stable
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Graphiques */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Évolution du chiffre d'affaires</CardTitle>
              <CardDescription>Revenus des 6 derniers mois</CardDescription>
            </CardHeader>
            <CardContent>
              <Chart
                type="line"
                data={revenueData}
                xKey="period"
                yKey="revenue"
                title="Revenus mensuels"
                color="#EAB308"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Nombre de commandes</CardTitle>
              <CardDescription>Commandes des 6 derniers mois</CardDescription>
            </CardHeader>
            <CardContent>
              <Chart
                type="bar"
                data={ordersData}
                xKey="period"
                yKey="orders"
                title="Commandes mensuelles"
                color="#3B82F6"
              />
            </CardContent>
          </Card>
        </div>

        {/* Commandes récentes et alertes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Commandes récentes</CardTitle>
              <CardDescription>Dernières commandes passées</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{order.id}</p>
                      <p className="text-sm text-gray-600">{order.client}</p>
                      <p className="text-xs text-gray-500">{order.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold casual-text-gradient">
                        {order.montant.toLocaleString()} FCFA
                      </p>
                      {getStatusBadge(order.statut)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Alertes et notifications</CardTitle>
              <CardDescription>Points d'attention importants</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-yellow-800">Stock faible</p>
                    <p className="text-sm text-yellow-700">
                      3 articles ont un stock inférieur à 10 unités
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <Calendar className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-800">Livraisons prévues</p>
                    <p className="text-sm text-blue-700">
                      5 commandes à livrer cette semaine
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-green-800">Performance</p>
                    <p className="text-sm text-green-700">
                      Croissance de 12.5% par rapport au mois dernier
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
