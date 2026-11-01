export type UserRole = 'company' | 'seller' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  passwordHash: string;
  role: UserRole;
  companyName?: string;
  shopName?: string;
  address: string;
  tradeLicense?: string;
  avatar?: string;
  verified: boolean;
  creditLimit?: number;
  createdAt: string;
}

export interface Company {
  id: string;
  userId: string;
  name: string;
  logo: string;
  banner?: string;
  rating: number;
  reviewCount: number;
  verified: boolean;
  tradeLicense?: string;
  phone: string;
  email: string;
  address: string;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  pendingDues: number;
  createdAt: string;
}

export interface Product {
  id: string;
  companyId: string;
  companyName: string;
  title: string;
  brand: string;
  category: string;
  description: string;
  features: string[];
  unitPrice: number;
  wholesalePrice: number;
  moq: number;
  stock: number;
  unitType: 'piece' | 'box' | 'carton' | 'coil';
  warranty: string;
  discountPercent: number;
  images: string[];
  tags: string[];
  rating: number;
  reviewCount: number;
  isApproved: boolean;
  createdAt: string;
}

export interface OrderItem {
  productId: string;
  title: string;
  image: string;
  quantity: number;
  unitPrice: number;
  wholesalePrice: number;
  unitType: string;
}

export type OrderStatus = 'placed' | 'confirmed' | 'packed' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'paid' | 'partial' | 'due';
export type PaymentMethod = 'full' | 'partial' | 'credit' | 'cod' | 'bkash' | 'nagad' | 'rocket' | 'bank_transfer';

export interface Order {
  id: string;
  orderNumber: string;
  sellerId: string;
  sellerName: string;
  sellerShop: string;
  sellerPhone: string;
  companyId: string;
  companyName: string;
  items: OrderItem[];
  totalAmount: number;
  discountAmount: number;
  paidAmount: number;
  dueAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  shippingAddress: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LedgerTransaction {
  id: string;
  sellerId: string;
  sellerName: string;
  sellerShop: string;
  companyId: string;
  companyName: string;
  orderId?: string;
  type: 'purchase' | 'payment' | 'adjustment';
  amount: number;
  previousDue: number;
  newDue: number;
  paymentMethod?: string;
  note?: string;
  date: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  text: string;
  timestamp: string;
}

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  body: string;
  type: 'order' | 'payment' | 'due' | 'system';
  isRead: boolean;
  createdAt: string;
}

export interface DatabaseSchema {
  users: User[];
  companies: Company[];
  products: Product[];
  orders: Order[];
  transactions: LedgerTransaction[];
  messages: ChatMessage[];
  notifications: AppNotification[];
}

