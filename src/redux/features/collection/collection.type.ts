import { Order, Pagination } from "../order/order.type";
import { ProductionOrderStatus, ProductionSource } from "../production/production.type";

export interface CollectionOrder extends Omit<Order, "status" | "source"> {
  status: ProductionOrderStatus;
  source: ProductionSource;
}

export interface GetAllCollectionParams {
  page?: number;
  limit?: number;
  status?: string;
  source?: string;
  search?: string;
}

export interface GetAllCollectionResponse {
  success: boolean;
  statusCode: number;
  message: string;
  pagination: Pagination;
  data: CollectionOrder[];
}
