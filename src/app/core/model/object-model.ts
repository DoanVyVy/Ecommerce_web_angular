export class User {
  name!: string;
  password!: string;
  role!: string;
  mobNumber!: string;
  address!: Address;
  gender!: string;
  email!: string;
  dob!: string;
  agreetc!: boolean;
  age!: number;
  aboutYou!: string;
}

export class Address {
  id!: number;
  addLine1!: string;
  addLine2!: string;
}

export class Product {
  id!: number;
  name!: string;
  uploadPhoto!: string;
  productDesc!: string;
  mrp!: number; // Maximum Retail Price
  dp!: number; // Discounted Price
  status!: boolean;
}

export class Order {
  userId!: number;
  products!: Product[]; // Updated to hold multiple products
  deliveryAddress!: Address;
  contact!: string;
  dateTime!: string;
  totalAmount!: number; // Added totalAmount to store the total price of the order
}

export class Cart {
  id!: number;
  userId!: number;
  items!: CartItem[];
  totalAmount!: number; // Total amount for the cart
}

export class CartItem {
  productId!: number;
  product!: Product;
  quantity!: number;
}
