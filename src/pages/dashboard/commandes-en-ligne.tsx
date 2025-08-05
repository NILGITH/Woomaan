
import { useState, useEffect, useCallback } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Package, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { onlineOrderService, OnlineOrder } from "@/services/onlineOrderService";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function OnlineOrdersPage() {
  const [orders, setOrders] = useState<OnlineOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<OnlineOrder | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const { toast } = useToast();

  const loadOrders = useCallback(async () => {
    setLoading(true);
    try {
      const ordersData = await onlineOrderService.getOrders();
      setOrders(ordersData);
    } catch (error) {
      console.error("Failed to load online orders:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les commandes en ligne.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const updatedOrder = await onlineOrderService.updateOrderStatus(orderId, newStatus);
      if (updatedOrder) {
        setOrders(prevOrders =>
          prevOrders.map(order => (order.id === orderId ? updatedOrder : order))
        );
        toast({
          title: "Statut mis à jour",
          description: `La commande a été mise à jour à "${getStatusLabel(newStatus)}".`,
        });
      }
    } catch (error) {
      console.error("Failed to update order status:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut de la commande.",
        variant: "destructive",
      });
    }
  };
  
  const getStatusBadgeClassName = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-500 text-white hover:bg-yellow-600";
      case "processing": return "bg-blue-500 text-white hover:bg-blue-600";
      case "shipped": return "bg-purple-500 text-white hover:bg-purple-600";
      case "delivered": return "bg-green-500 text-white hover:bg-green-600";
      case "cancelled": return "bg-red-500 text-white hover:bg-red-600";
      default: return "";
    }
  }

  const getStatusLabel = (status: string) => {
    const labels: { [key: string]: string } = {
      pending: "En attente",
      processing: "En traitement",
      shipped: "Expédiée",
      delivered: "Livrée",
      cancelled: "Annulée",
    };
    return labels[status] || status;
  };

  const openDetailsModal = (order: OnlineOrder) => {
    setSelectedOrder(order);
    setIsDetailsModalOpen(true);
  };

  if (loading) {
    return <DashboardLayout><div>Chargement des commandes...</div></DashboardLayout>;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="mr-2 h-5 w-5" />
              Gestion des Commandes en Ligne
            </CardTitle>
            <CardDescription>
              Visualisez et gérez les commandes passées depuis la boutique en ligne.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{format(new Date(order.created_at), "dd/MM/yyyy HH:mm", { locale: fr })}</TableCell>
                    <TableCell>
                      <div className="font-medium">{order.customer_name}</div>
                      <div className="text-sm text-muted-foreground">{order.customer_email}</div>
                    </TableCell>
                    <TableCell>{order.total_amount.toLocaleString()} FCFA</TableCell>
                    <TableCell>
                      <Badge className={getStatusBadgeClassName(order.status)}>
                        {getStatusLabel(order.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" onClick={() => openDetailsModal(order)}>
                        <Eye className="h-4 w-4 mr-2" />
                        Détails
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {orders.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Aucune commande en ligne pour le moment.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Détails de la commande</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Informations Client</h3>
                  <p><strong>Nom:</strong> {selectedOrder.customer_name}</p>
                  <p><strong>Email:</strong> {selectedOrder.customer_email}</p>
                  <p><strong>Téléphone:</strong> {selectedOrder.customer_phone}</p>
                  <p><strong>Adresse:</strong> {selectedOrder.customer_address || "N/A"}</p>
                  <p><strong>Ville:</strong> {selectedOrder.customer_city || "N/A"}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Informations Commande</h3>
                  <p><strong>Date:</strong> {format(new Date(selectedOrder.created_at), "PPP p", { locale: fr })}</p>
                  <p><strong>Total:</strong> <span className="font-bold text-green-600">{selectedOrder.total_amount.toLocaleString()} FCFA</span></p>
                  <div className="flex items-center gap-2 mt-2">
                    <strong>Statut:</strong>
                    <Select
                      value={selectedOrder.status}
                      onValueChange={(newStatus) => handleStatusChange(selectedOrder.id, newStatus)}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">En attente</SelectItem>
                        <SelectItem value="processing">En traitement</SelectItem>
                        <SelectItem value="shipped">Expédiée</SelectItem>
                        <SelectItem value="delivered">Livrée</SelectItem>
                        <SelectItem value="cancelled">Annulée</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                   {selectedOrder.notes && <p className="mt-2"><strong>Notes:</strong> {selectedOrder.notes}</p>}
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Articles</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Produit</TableHead>
                      <TableHead>Taille</TableHead>
                      <TableHead>Couleur</TableHead>
                      <TableHead>Quantité</TableHead>
                      <TableHead className="text-right">Prix</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedOrder.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.product_name}</TableCell>
                        <TableCell>{item.size}</TableCell>
                        <TableCell>{item.color}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell className="text-right">{(item.price * item.quantity).toLocaleString()} FCFA</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
