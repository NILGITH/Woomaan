
import { supabase } from "@/integrations/supabase/client";

// Types defined locally to avoid issues with stale generated types
export interface OnlineOrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
  size: string;
  color: string;
}

export interface OnlineOrder {
  id: string;
  created_at: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_address: string | null;
  customer_city: string | null;
  notes: string | null;
  total_amount: number;
  status: string;
  items: OnlineOrderItem[];
}

export type OnlineOrderInsert = Omit<OnlineOrder, "id" | "created_at" | "items">;
export type NewOnlineOrderPayload = Omit<OnlineOrder, "id" | "created_at" | "items" | "status">;
export type NewOnlineOrderItemPayload = Omit<OnlineOrderItem, "id" | "order_id">;


export const onlineOrderService = {
  async createOrder(order: NewOnlineOrderPayload, items: NewOnlineOrderItemPayload[]): Promise<OnlineOrder | null> {
    try {
      const orderToInsert: OnlineOrderInsert = { ...order, status: 'pending' };
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const {  newOrder, error: orderError } = await (supabase as any)
        .from('online_orders')
        .insert([orderToInsert]) // insert expects an array
        .select()
        .single();

      if (orderError) {
        console.error("Error creating order:", orderError);
        throw orderError;
      }

      if (!newOrder) {
        throw new Error("No order data returned");
      }

      const itemsToInsert: Omit<OnlineOrderItem, "id">[] = items.map(item => ({
        ...item,
        order_id: newOrder.id,
      }));

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const {  newItems, error: itemsError } = await (supabase as any)
        .from('online_order_items')
        .insert(itemsToInsert)
        .select();

      if (itemsError) {
        console.error("Error creating order items, rolling back order:", itemsError);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase as any).from('online_orders').delete().eq('id', newOrder.id);
        throw itemsError;
      }

      return { ...newOrder, items: newItems || [] };
    } catch (error) {
      console.error("Error in createOrder:", error);
      throw error;
    }
  },

  async getOrders(): Promise<OnlineOrder[]> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from('online_orders')
        .select(`
          *,
          online_order_items(*)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching orders:", error);
        throw error;
      }
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const orders = (data || []).map((o: any) => ({
          ...o,
          items: o.online_order_items || [],
      })) as OnlineOrder[];

      return orders;
    } catch (error) {
      console.error("Error in getOrders:", error);
      return [];
    }
  },

  async updateOrderStatus(orderId: string, status: string): Promise<OnlineOrder | null> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from('online_orders')
        .update({ status })
        .eq('id', orderId)
        .select(`
          *,
          online_order_items(*)
        `)
        .single();

      if (error) {
        console.error("Error updating order status:", error);
        throw error;
      }
      
      if (!data) {
        return null;
      }

      const updatedOrder = {
          ...data,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          items: (data as any).online_order_items || [],
      } as OnlineOrder;

      return updatedOrder;
    } catch (error) {
      console.error("Error in updateOrderStatus:", error);
      throw error;
    }
  }
};
