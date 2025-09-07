
export type Size = "S" | "M" | "L" | "XL" | "XXL" | "ONE_SIZE";

export interface CartItem {

  productId?: string;

  name: string;

  size?: Size | null;

  quantity: number;

  price?: number;
}


export interface CustomerDetails {
  fullname: string;
  phone: string;
  city: string;
  street: string;
  houseNumber: string;
  zip: string;
  email?: string | null;
}


export interface OrderPayload {
  customerDetails: CustomerDetails;
  cart: CartItem[];
}


export interface OrderResponse {
  message: string;
  orderId?: string;
}
