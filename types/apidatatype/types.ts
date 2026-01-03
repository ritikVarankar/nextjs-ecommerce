export interface ApiResponse<T={}> {
  success: boolean;
  statusCode: number;
  message: string;
  data?: T;
}

export interface AppError {
  code: number;
  message: string;
  keyPattern?: Record<string, unknown>;
  stack?: string;
}

export interface ApiErrorData {
  error?: AppError; // no any
}

export interface LoginRequest{
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string
  password: string
  email: string
}

export interface CloudinaryRequest{
  paramsToSign: {
    timestamp: number;   // <-- FIXED
    upload_preset: string;
    source: string;
  };
}


export interface OrdersCountResponse {
  _id: Id
  totalSales: number
}

export interface Id {
  year: number
  month: number
}

export interface OrderStatusResponse {
  _id: string
  count: number
}


export interface LatestReviewResponse {
  _id: string
  product: Product
  user: string
  rating: number
  title: string
  review: string
  deletedAt: any
  createdAt: string
  updatedAt: string
  __v: number
}

export interface Product {
  _id: string
  name: string
  media: Medum[]
}

export interface Medum {
  _id: string
  secure_url: string
}


