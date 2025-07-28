export type Product = {
  title: string;
  imageUrl: string;
  price: number;
  stock:{
    S:number;
    M:number;
    L:number;
    XL:number;
  }
   sizes: string[]; 
  _id:string;
};

