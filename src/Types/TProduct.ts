
export type TSizeStock = {
  initial: number;
  current: number;
};


export type SizeKey = "l" | "xl" | "xxl";


export type TProductStock = Partial<Record<SizeKey, TSizeStock>>;


export type Product = {
  _id: string;
  title: string;
  price: number;
  imageUrl: string;
  stock?: TProductStock; 
  createdAt?: string;
  updatedAt?: string;
};
