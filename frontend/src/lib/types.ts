export type Category =
  | "dress"
  | "skirt"
  | "blouse"
  | "tshirt"
  | "top"
  | "pants"
  | "coat"
  | "bodycon"
  | "accessory";

export type Color = "red" | "blue" | "green" | "black" | "white";

export type Size = "32" | "34" | "36" | "38" | "40" | "42" | "44" | "46" | "48" | "50";

export type OrderStatus = "pending" | "shipped" | "delivered" | "canceled";

export interface ProductImage {
  id: number;
  url: string;
}

export interface ProductVariant {
  id: number;
  size: Size;
  stock: number;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  sale_price: number;
  discount_percentage: number;
  is_on_sale: boolean;
  new_collection: boolean;
  category: Category;
  color: Color | null;
  total_stock: number | null;
  images: ProductImage[];
  variants: ProductVariant[];
  created_at: string;
}

export interface CartItem {
  id: number;
  quantity: number;
  size: Size;
  available_stock: number | null;
  product: Product;
  line_total: number;
}

export interface WishlistItem {
  id: number;
  product: Product;
}

export interface Address {
  id: number;
  country: string;
  city: string;
  postal_code: string;
  street_address: string;
}

export interface OrderItem {
  id: number;
  quantity: number;
  size: Size;
  unit_price: number;
  product: Product;
}

export interface Order {
  id: number;
  status: OrderStatus;
  total_price: number;
  created_at: string;
  address: Address | null;
  customer?: { id: number; name: string; email: string; phone: string | null };
  items: OrderItem[];
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  roles: string[];
  is_admin: boolean;
}

export interface Paginated<T> {
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
  };
  links: {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
  };
}

export interface Meta {
  categories: Category[];
  colors: Color[];
  sizes: Size[];
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}
