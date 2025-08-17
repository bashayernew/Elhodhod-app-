import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from './index';
import type { Provider, Product, Request, Bid, Order, User } from '@el-hodh0d/types';

export function useProviders() {
  return useQuery({ queryKey: ['providers'], queryFn: async () => (await api.get<Provider[]>('/providers')).data });
}
export function useProducts() {
  return useQuery({ queryKey: ['products'], queryFn: async () => (await api.get<Product[]>('/products')).data });
}
export function useRequests() {
  return useQuery({ queryKey: ['requests'], queryFn: async () => (await api.get<Request[]>('/requests')).data });
}
export function useBids(requestId: string) {
  return useQuery({ queryKey: ['bids', requestId], queryFn: async () => (await api.get<Bid[]>(`/requests/${requestId}/bids`)).data, enabled: !!requestId });
}
export function useOrders() {
  return useQuery({ queryKey: ['orders'], queryFn: async () => (await api.get<Order[]>('/orders')).data });
}
export function useAuth() {
  return useQuery({ queryKey: ['me'], queryFn: async () => (await api.get<User>('/me')).data });
}
export function useChat(chatId: string) {
  return useQuery({ queryKey: ['chat', chatId], queryFn: async () => (await api.get(`/chats/${chatId}`)).data, enabled: !!chatId });
}


