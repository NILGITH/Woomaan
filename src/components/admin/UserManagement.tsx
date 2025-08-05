import { useState, useEffect, useCallback } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Edit, Trash2 } from "lucide-react";
import { authService } from "@/services/authService";
import { adminService } from "@/services/adminService";
import type { Utilisateur, Magasin } from "@/types";
import { useToast } from "@/hooks/use-toast";

type UserRole = "admin" | "manager" | "vendeur" | "employe";

export default function UserManagement() {
  const [users, setUsers] = useState<Utilisateur[]>([]);
  const [magasins, setMagasins] = useState<Magasin[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<Utilisateur | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    role: "employe" as UserRole,
    magasin_id: "",
    actif: true,
  });

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [usersData, magasinsData] = await Promise.all([
        authService.getUsers(),
        adminService.getMagasins(),
      ]);
      setUsers(usersData);
      setMagasins(magasinsData as Magasin[]);
    } catch (err) {
      console.error("Failed to load ", err);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingUser) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { email, ...updateData } = formData;
        await authService.updateUser(editingUser.id, updateData);
        toast({
          title: "Succès",
          description: "Utilisateur modifié avec succès",
        });
      } else {
        await authService.createUser({
          ...formData,
          mot_de_passe: "password123", // Mot de passe par défaut
        });
        toast({
          title: "Succès",
          description: "Utilisateur créé avec succès",
        });
      }
      setDialogOpen(false);
      resetForm();
      await loadData();
    } catch (err) {
      console.error("Failed to save user:", err);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder l'utilisateur",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (user: Utilisateur) => {
    setEditingUser(user);
    setFormData({
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      role: user.role as UserRole,
      magasin_id: user.magasin_id || "",
      actif: user.actif,
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
      try {
        await authService.deleteUser(id);
        toast({
          title: "Succès",
          description: "Utilisateur supprimé avec succès",
        });
        await loadData();
      } catch (err) {
        console.error("Failed to delete user:", err);
        toast({
          title: "Erreur",
          description: "Impossible de supprimer l'utilisateur",
          variant: "destructive",
        });
      }
    }
  };

  const resetForm = () => {
    setFormData({
      nom: "",
      prenom: "",
      email: "",
      role: "employe",
      magasin_id: "",
      actif: true,
    });
    setEditingUser(null);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin": return "bg-red-100 text-red-800";
      case "manager": return "bg-blue-100 text-blue-800";
      case "vendeur": return "bg-green-100 text-green-800";
      case "employe": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Section d'informations de connexion */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-800">Informations de Connexion</CardTitle>
          <CardDescription className="text-blue-600">
            Utilisez ces identifiants pour vous connecter à l'application
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-blue-700">Email par défaut:</Label>
              <div className="p-2 bg-white border border-blue-200 rounded-md">
                <code className="text-sm">admin@ciss-stmoise.com</code>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-blue-700">Mot de passe par défaut:</Label>
              <div className="p-2 bg-white border border-blue-200 rounded-md">
                <code className="text-sm">password123</code>
              </div>
            </div>
          </div>
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> Tous les nouveaux utilisateurs créés utilisent le mot de passe par défaut "password123". 
              Il est recommandé de changer ce mot de passe après la première connexion.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Gestion des Utilisateurs</CardTitle>
              <CardDescription>Ajoutez, modifiez et gérez les utilisateurs de l'application.</CardDescription>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm}>
                  <Plus className="mr-2 h-4 w-4" />
                  Nouvel utilisateur
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingUser ? "Modifier l'utilisateur" : "Nouvel utilisateur"}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="nom">Nom</Label>
                      <Input
                        id="nom"
                        value={formData.nom}
                        onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="prenom">Prénom</Label>
                      <Input
                        id="prenom"
                        value={formData.prenom}
                        onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      disabled={!!editingUser}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="role">Rôle</Label>
                      <Select value={formData.role} onValueChange={(value: string) => setFormData({ ...formData, role: value as UserRole })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Administrateur</SelectItem>
                          <SelectItem value="manager">Manager</SelectItem>
                          <SelectItem value="vendeur">Vendeur</SelectItem>
                          <SelectItem value="employe">Employé</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="magasin">Magasin</Label>
                      <Select value={formData.magasin_id} onValueChange={(value: string) => setFormData({ ...formData, magasin_id: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un magasin" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Aucun magasin</SelectItem>
                          {magasins.map((magasin) => (
                            <SelectItem key={magasin.id} value={magasin.id}>
                              {magasin.nom}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="actif"
                      checked={formData.actif}
                      onCheckedChange={(checked: boolean | 'indeterminate') => setFormData({ ...formData, actif: !!checked })}
                    />
                    <Label htmlFor="actif">Utilisateur Actif</Label>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                      Annuler
                    </Button>
                    <Button type="submit">
                      {editingUser ? "Modifier" : "Créer"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom complet</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rôle</TableHead>
                <TableHead>Magasin</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.prenom} {user.nom}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge className={getRoleBadgeColor(user.role)}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {magasins.find(m => m.id === user.magasin_id)?.nom || "Aucun"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.actif ? "default" : "secondary"}>
                      {user.actif ? "Actif" : "Inactif"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(user)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDelete(user.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
