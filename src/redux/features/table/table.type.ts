export interface TableItem {
    id: number;
    slug: string;
    tableNumber: string;
    notes: string;
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface GetTablesResponse {
    success: boolean;
    statusCode: number;
    message: string;
    pagination: Pagination;
    data: TableItem[];
}

export interface GetTablesQueryParams {
    page?: number;
    limit?: number;
    search?: string;
}

export interface AddTableBody {
    tableNumber: string;
    notes?: string;
    isActive?: boolean;
}

export interface AddTableResponse {
    success: boolean;
    statusCode: number;
    message: string;
    data: TableItem;
}

export interface UpdateTableBody {
    tableNumber?: string;
    notes?: string;
    isActive?: boolean;
}

export interface UpdateTableResponse {
    success: boolean;
    statusCode: number;
    message: string;
    data: TableItem;
}

export interface DeleteTableResponse {
    success: boolean;
    statusCode: number;
    message: string;
    data: TableItem;
}

export interface GetTableDetailsResponse {
    success: boolean;
    statusCode: number;
    message: string;
    data: TableItem & {
        orders: any[];
    };
}
