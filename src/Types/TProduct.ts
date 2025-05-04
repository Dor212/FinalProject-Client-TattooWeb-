export type Product = {
  title: string;
  imageUrl: string;
  price: number;
  stock:{
    small:number;
    medium:number;
    large:number;
  }
  /* sizes: string[]; */
  _id:string;
};

