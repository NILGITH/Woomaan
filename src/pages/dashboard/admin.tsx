import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Users, Package, Package2, Store, Settings, Shield, Crown } from "lucide-react";
import UserManagement from "@/components/admin/UserManagement";
import OutfitTypeManagement from "@/components/admin/OutfitTypeManagement";
import RawMaterialManagement from "@/components/admin/RawMaterialManagement";
import ShopManagement from "@/components/admin/ShopManagement";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Trash2 } from "lucide-react";
import Image from "next/image";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header avec logo */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Image 
              src="/woomaan-logo.svg" 
              alt="WOOMAAN"
              width={48}
              height={48}
              className="rounded-full border-2 border-yellow-300"
            />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Administration WOOMAAN</h1>
              <p className="text-gray-600 mt-2">Gestion complète de votre atelier de mode</p>
            </div>
          </div>
          <Badge className="bg-yellow-100 text-yellow-800 px-4 py-2">
            <Shield className="mr-2 h-4 w-4" />
            Administrateur
          </Badge>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-yellow-50">
            <TabsTrigger 
              value="overview" 
              className="data-[state=active]:bg-yellow-600 data-[state=active]:text-white"
            >
              <Settings className="mr-2 h-4 w-4" />
              Vue d'ensemble
            </TabsTrigger>
            <TabsTrigger 
              value="users"
              className="data-[state=active]:bg-yellow-600 data-[state=active]:text-white"
            >
              <Users className="mr-2 h-4 w-4" />
              Utilisateurs
            </TabsTrigger>
            <TabsTrigger 
              value="outfit-types"
              className="data-[state=active]:bg-yellow-600 data-[state=active]:text-white"
            >
              <Package className="mr-2 h-4 w-4" />
              Types Vêtements
            </TabsTrigger>
            <TabsTrigger 
              value="materials"
              className="data-[state=active]:bg-yellow-600 data-[state=active]:text-white"
            >
              <Package2 className="mr-2 h-4 w-4" />
              Matières Premières
            </TabsTrigger>
            <TabsTrigger 
              value="shops"
              className="data-[state=active]:bg-yellow-600 data-[state=active]:text-white"
            >
              <Store className="mr-2 h-4 w-4" />
              Boutiques
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-l-4 border-l-yellow-500">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Utilisateurs</CardTitle>
                  <Users className="h-4 w-4 text-yellow-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">12</div>
                  <p className="text-xs text-muted-foreground">+2 ce mois</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-blue-500">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Types Vêtements</CardTitle>
                  <Package className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">8</div>
                  <p className="text-xs text-muted-foreground">Actifs</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-orange-500">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Matières Premières</CardTitle>
                  <Package2 className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">24</div>
                  <p className="text-xs text-muted-foreground">3 en stock critique</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-purple-500">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Boutiques</CardTitle>
                  <Store className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">3</div>
                  <p className="text-xs text-muted-foreground">Toutes actives</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="mr-2 h-5 w-5 text-yellow-600" />
                    Actions Rapides
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={() => setActiveTab("users")}
                      className="p-4 bg-yellow-50 hover:bg-yellow-100 rounded-lg text-left transition-colors"
                    >
                      <Users className="h-6 w-6 text-yellow-600 mb-2" />
                      <h3 className="font-medium text-yellow-900">Gérer Utilisateurs</h3>
                      <p className="text-sm text-yellow-700">Ajouter, modifier ou supprimer des utilisateurs</p>
                    </button>
                    <button 
                      onClick={() => setActiveTab("outfit-types")}
                      className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg text-left transition-colors"
                    >
                      <Package className="h-6 w-6 text-blue-600 mb-2" />
                      <h3 className="font-medium text-blue-900">Types Vêtements</h3>
                      <p className="text-sm text-blue-700">Configurer les types de vêtements</p>
                    </button>
                    <button 
                      onClick={() => setActiveTab("materials")}
                      className="p-4 bg-orange-50 hover:bg-orange-100 rounded-lg text-left transition-colors"
                    >
                      <Package2 className="h-6 w-6 text-orange-600 mb-2" />
                      <h3 className="font-medium text-orange-900">Matières Premières</h3>
                      <p className="text-sm text-orange-700">Gérer le stock de matières</p>
                    </button>
                    <button 
                      onClick={() => setActiveTab("shops")}
                      className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg text-left transition-colors"
                    >
                      <Store className="h-6 w-6 text-purple-600 mb-2" />
                      <h3 className="font-medium text-purple-900">Boutiques</h3>
                      <p className="text-sm text-purple-700">Gérer les boutiques et succursales</p>
                    </button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="mr-2 h-5 w-5 text-yellow-600" />
                    Informations Système
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                      <span className="text-sm font-medium text-yellow-900">Statut Système</span>
                      <Badge className="bg-yellow-100 text-yellow-800">Opérationnel</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <span className="text-sm font-medium text-blue-900">Base de données</span>
                      <Badge className="bg-blue-100 text-blue-800">Connectée</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                      <span className="text-sm font-medium text-orange-900">Dernière sauvegarde</span>
                      <span className="text-sm text-orange-700">Il y a 2h</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                      <span className="text-sm font-medium text-purple-900">Version</span>
                      <span className="text-sm text-purple-700">v1.0.0</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users">
            <div className="text-center mb-16">
              <Badge className="woomaan-bg-gradient text-white font-semibold px-4 py-2 mb-4">
                <Crown className="w-4 h-4 mr-2" />
                Informations de Connexion
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
                Identifiants de l'Application
              </h2>
              <p className="text-lg text-gray-600">
                Utilisez ces identifiants pour vous connecter à l'application
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor="default-email">Email par défaut:</Label>
                <Input 
                  id="default-email" 
                  value="admin@woomaan.com" 
                  readOnly 
                  className="bg-gray-50"
                />
              </div>
              <div>
                <Label htmlFor="default-password">Mot de passe par défaut:</Label>
                <Input 
                  id="default-password" 
                  value="password123" 
                  readOnly 
                  className="bg-gray-50"
                />
              </div>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> Le mot de passe par défaut pour tout nouvel utilisateur est "password123". Il est recommandé de le changer après la première connexion.
              </p>
            </div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Gestion des Utilisateurs</h2>
                <p className="text-gray-600">Ajoutez, modifiez et gérez les utilisateurs de l'application.</p>
              </div>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Utilisateur</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Rôle</TableHead>
                  <TableHead>Permissions</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>WOOMAAN Admin</TableCell>
                  <TableCell>admin@woomaan.com</TableCell>
                  <TableCell>
                    <Badge className="bg-red-100 text-red-800">admin</Badge>
                  </TableCell>
                  <TableCell>Tous</TableCell>
                  <TableCell>
                    <Badge className="bg-green-100 text-green-800">Actif</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="outfit-types">
            <OutfitTypeManagement />
          </TabsContent>

          <TabsContent value="materials">
            <RawMaterialManagement />
          </TabsContent>

          <TabsContent value="shops">
            <ShopManagement />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
