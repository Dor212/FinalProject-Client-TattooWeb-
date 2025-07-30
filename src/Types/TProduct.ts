export type Product = {
  title: string;
  imageUrl: string;
  price: number;
  stock: {
    small: {
      current: number;
      initial: number;
    };
    medium: {
      current: number;
      initial: number;
    };
    large: {
      current: number;
      initial: number;
    };
  };
  _id: string;
};
