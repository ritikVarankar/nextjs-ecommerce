

export interface UploadFileInfo {
  uploadInfo: {
    asset_id: string;
    public_id: string;
    secure_url: string;
    path: string;
    thumbnail_url: string;
  };
}

export interface MediaDataType {
  _id: string
  title: string
  asset_id: string
  path: string
  secure_url: string
  thumbnail_url: string
  deletedAt: any
  alt: string
  __v: number
  createdAt: string
  updatedAt: string

  url?: string
}

export interface FeaturedProductResponse {
  success: boolean
  statusCode: number
  message: string
  data: FeaturedProductDataType[]
}

export interface FeaturedProductDataType {
  _id: string
  name: string
  slug: string
  category: string
  mrp: number
  sellingPrice: number
  discountPercentage: number
  media: Medum[]
  description: string
  deletedAt: any
  createdAt: string
  updatedAt: string
  __v: number
}

export interface Medum {
  _id: string
  secure_url: string
}

export interface CategoryData {
  _id: string
  name: string
  slug: string
  deletedAt: any
  createdAt: string
  updatedAt: string
  __v: number
}

export interface ShopProductResponse {
  success: boolean
  statusCode: number
  message: string
  data: ShopProductData
}

export interface ShopProductData {
  products: ShopProduct[]
  nextPage: number;
}

export interface ShopProduct {
  _id: string
  name: string
  slug: string
  mrp: number
  sellingPrice: number
  discountPercentage: number
  media: Medum[]
}


export interface ProductDetailReponse {
  success: boolean
  statusCode: number
  message: string
  data: ProductDetail
}

export interface ProductDetail {
  products: Products
  variant: Variant
  colors: string[]
  sizes: string[]
  reviewCount: number
}

export interface Products {
  _id: string
  name: string
  slug: string
  category: string
  mrp: number
  sellingPrice: number
  discountPercentage: number
  media: Medum[]
  description: string
  deletedAt: any
  createdAt: string
  updatedAt: string
  __v: number
}

export interface Variant {
  _id: string
  product: string
  color: string
  size: string
  mrp: number
  sellingPrice: number
  discountPercentage: number
  sku: string
  media: Medum[]
  deletedAt: any
  createdAt: string
  updatedAt: string
  __v: number
}


export interface Review {
  _id: string
  rating: number
  title: string
  review: string
  createdAt: string
  reviewedBy: string
  avatar:{
    url:string,
    public_id:string
  }
}


export interface OrderDetailsResponse {
  success: boolean
  statusCode: number
  message: string
  data: OrderData
}

export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'unverified'

export interface OrderData {
  _id: string
  user: string
  name: string
  email: string
  phone: string
  country: string
  state: string
  city: string
  pincode: string
  landmark: string
  ordernote: string
  products: Product[]
  subtotal: number
  discount: number
  couponDiscount: number
  totalAmount: number
  orderstatus: OrderStatus
  payment_id: string
  order_id: string
  deletedAt: any
  createdAt: string
  updatedAt: string
  __v: number
}

export interface Product {
  productId: ProductId
  variantId: VariantId
  qty: string
  mrp: string
  sellingPrice: string
  name: string
  _id: string
}

export interface ProductId {
  _id: string
  name: string
  slug: string
}

export interface VariantId {
  _id: string
  product: string
  color: string
  size: string
  mrp: number
  sellingPrice: number
  discountPercentage: number
  sku: string
  media: Medias[]
  deletedAt: any
  createdAt: string
  updatedAt: string
  __v: number
}

export interface Medias {
  _id: string
  asset_id: string
  public_id: string
  path: string
  secure_url: string
  thumbnail_url: string
  deletedAt: any
  __v: number
  createdAt: string
  updatedAt: string
}


export interface RecentOrderResponse {
  recentOrders: RecentOrder[]
  totalOrders: number
}

export interface RecentOrder {
  _id: string
  user: string
  name: string
  email: string
  phone: string
  country: string
  state: string
  city: string
  pincode: string
  landmark: string
  ordernote: string
  products: Product[]
  subtotal: number
  discount: number
  couponDiscount: number
  totalAmount: number
  orderstatus: string
  payment_id: string
  order_id: string
  deletedAt: any
  createdAt: string
  updatedAt: string
  __v: number
}

export interface UserResponse {
  _id: string
  avatar:{
    url:string;
    public_id:string;
  }
  role: string
  name: string
  email: string
  isEmailVerified: boolean
  deletedAt: any
  createdAt: string
  updatedAt: string
  address: string
  phone: string
  __v: number
}









