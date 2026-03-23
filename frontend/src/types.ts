export type User = {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
};

export type Product = {
  _id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  image: string;
  rating: number;
  stock: number;
};

export type CartItem = {
  product: Product;
  quantity: number;
};

export type Order = {
  _id: string;
  items: Array<{
    title: string;
    price: number;
    quantity: number;
    image: string;
  }>;
  totalAmount: number;
  status: string;
  shippingAddress: string;
  createdAt: string;
};
