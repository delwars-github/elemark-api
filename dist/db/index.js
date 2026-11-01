"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const DATA_DIR = path_1.default.resolve(__dirname, '../../data');
const DB_FILE = path_1.default.join(DATA_DIR, 'voltmart_db.json');
const INITIAL_DATA = {
    users: [
        {
            id: 'usr_admin',
            name: 'System Admin',
            email: 'admin@voltmart.com',
            phone: '+8801700000000',
            passwordHash: '$2a$10$wT8K5q7vY9lBv5h5r2L3XeZ0j8J8w0xO0k6gX.hQkHh1g2F3e4A5G', // password123
            role: 'admin',
            address: 'Dhaka, Bangladesh',
            verified: true,
            createdAt: '2026-01-01T00:00:00.000Z'
        },
        {
            id: 'usr_comp_1',
            name: 'Engr. M. Rahman',
            email: 'brb@voltmart.com',
            phone: '+8801711223344',
            passwordHash: '$2a$10$wT8K5q7vY9lBv5h5r2L3XeZ0j8J8w0xO0k6gX.hQkHh1g2F3e4A5G', // password123
            role: 'company',
            companyName: 'BRB Cable Industries Ltd',
            address: 'BSCIC Industrial Estate, Kushtia, Bangladesh',
            tradeLicense: 'TRAD/KUS/2026/092',
            verified: true,
            createdAt: '2026-01-10T10:00:00.000Z'
        },
        {
            id: 'usr_comp_2',
            name: 'Walton Electricals',
            email: 'walton@voltmart.com',
            phone: '+8801755667788',
            passwordHash: '$2a$10$wT8K5q7vY9lBv5h5r2L3XeZ0j8J8w0xO0k6gX.hQkHh1g2F3e4A5G',
            role: 'company',
            companyName: 'Walton Hi-Tech Industries PLC',
            address: 'Plot-1088, Block-I, Sabrina Sobhan Road, Dhaka',
            tradeLicense: 'TRAD/DHK/2026/883',
            verified: true,
            createdAt: '2026-01-12T11:00:00.000Z'
        },
        {
            id: 'usr_comp_3',
            name: 'Super Star Group',
            email: 'superstar@voltmart.com',
            phone: '+8801799001122',
            passwordHash: '$2a$10$wT8K5q7vY9lBv5h5r2L3XeZ0j8J8w0xO0k6gX.hQkHh1g2F3e4A5G',
            role: 'company',
            companyName: 'Super Star Group (SSG)',
            address: 'SSG House, 94 Motijheel C/A, Dhaka',
            tradeLicense: 'TRAD/DHK/2026/411',
            verified: true,
            createdAt: '2026-01-15T09:30:00.000Z'
        },
        {
            id: 'usr_seller_1',
            name: 'Al-Haj Rafiqul Islam',
            email: 'seller@voltmart.com',
            phone: '+8801812345678',
            passwordHash: '$2a$10$wT8K5q7vY9lBv5h5r2L3XeZ0j8J8w0xO0k6gX.hQkHh1g2F3e4A5G', // password123
            role: 'seller',
            shopName: 'Rafiq Electric & Hardware',
            address: 'Shop 14, Nawabpur Road Electrical Market, Dhaka',
            tradeLicense: 'TRAD/DSCC/092831',
            verified: true,
            creditLimit: 500000,
            createdAt: '2026-01-20T14:00:00.000Z'
        },
        {
            id: 'usr_seller_2',
            name: 'Kabir Hossain',
            email: 'kabir@electromart.com',
            phone: '+8801898765432',
            passwordHash: '$2a$10$wT8K5q7vY9lBv5h5r2L3XeZ0j8J8w0xO0k6gX.hQkHh1g2F3e4A5G',
            role: 'seller',
            shopName: 'Bismillah Light & Cable',
            address: 'New Market Electrical Goli, Chattogram',
            verified: true,
            creditLimit: 300000,
            createdAt: '2026-02-01T16:00:00.000Z'
        }
    ],
    companies: [
        {
            id: 'comp_1',
            userId: 'usr_comp_1',
            name: 'BRB Cable Industries Ltd',
            logo: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=200&auto=format&fit=crop',
            banner: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop',
            rating: 4.9,
            reviewCount: 428,
            verified: true,
            tradeLicense: 'TRAD/KUS/2026/092',
            phone: '+8801711223344',
            email: 'brb@voltmart.com',
            address: 'BSCIC Industrial Estate, Kushtia',
            totalProducts: 4,
            totalOrders: 184,
            totalRevenue: 2450000,
            pendingDues: 320000,
            createdAt: '2026-01-10T10:00:00.000Z'
        },
        {
            id: 'comp_2',
            userId: 'usr_comp_2',
            name: 'Walton Electricals',
            logo: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=200&auto=format&fit=crop',
            rating: 4.8,
            reviewCount: 312,
            verified: true,
            tradeLicense: 'TRAD/DHK/2026/883',
            phone: '+8801755667788',
            email: 'walton@voltmart.com',
            address: 'Sabrina Sobhan Road, Dhaka',
            totalProducts: 3,
            totalOrders: 142,
            totalRevenue: 1890000,
            pendingDues: 180000,
            createdAt: '2026-01-12T11:00:00.000Z'
        },
        {
            id: 'comp_3',
            userId: 'usr_comp_3',
            name: 'Super Star Group (SSG)',
            logo: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=200&auto=format&fit=crop',
            rating: 4.7,
            reviewCount: 260,
            verified: true,
            tradeLicense: 'TRAD/DHK/2026/411',
            phone: '+8801799001122',
            email: 'superstar@voltmart.com',
            address: 'Motijheel C/A, Dhaka',
            totalProducts: 3,
            totalOrders: 98,
            totalRevenue: 950000,
            pendingDues: 85000,
            createdAt: '2026-01-15T09:30:00.000Z'
        }
    ],
    products: [
        {
            id: 'prod_1',
            companyId: 'comp_1',
            companyName: 'BRB Cable Industries Ltd',
            title: 'BRB Single Core Copper Cable (BYA 2.5 RM) - 100M Coil',
            brand: 'BRB Cables',
            category: 'Cables & Wires',
            description: 'High conductivity pure electrolytic copper cable with flame-retardant PVC insulation. Ideal for commercial, residential and industrial conduit wiring.',
            features: [
                '99.99% Pure Annealed Copper Conductor',
                'Flame Retardant Grade PVC Insulation',
                'Voltage Grade: 450/750V',
                'Standard: BDS 900 / IEC 60227'
            ],
            unitPrice: 4850,
            wholesalePrice: 4200,
            moq: 5,
            stock: 450,
            unitType: 'coil',
            warranty: '10 Years Replacement Guarantee',
            discountPercent: 13,
            images: [
                'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?w=600&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop'
            ],
            tags: ['cables', 'brb', 'copper', '2.5rm', 'bestseller'],
            rating: 4.9,
            reviewCount: 184,
            isApproved: true,
            createdAt: '2026-01-15T12:00:00.000Z'
        },
        {
            id: 'prod_2',
            companyId: 'comp_1',
            companyName: 'BRB Cable Industries Ltd',
            title: 'BRB 4.0 RM Multi-strand House Wiring Cable - 100M Coil',
            brand: 'BRB Cables',
            category: 'Cables & Wires',
            description: 'Heavy duty copper wire suitable for air conditioners, water pumps and high-draw industrial distribution circuits.',
            features: ['High Temperature Resistance', 'Extra Low Voltage Drop', 'Double PVC Insulation'],
            unitPrice: 7200,
            wholesalePrice: 6350,
            moq: 3,
            stock: 280,
            unitType: 'coil',
            warranty: '10 Years Guarantee',
            discountPercent: 12,
            images: ['https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop'],
            tags: ['cables', 'heavy-duty', 'brb'],
            rating: 4.8,
            reviewCount: 96,
            isApproved: true,
            createdAt: '2026-01-16T10:00:00.000Z'
        },
        {
            id: 'prod_3',
            companyId: 'comp_2',
            companyName: 'Walton Electricals',
            title: 'Walton Piano Switch & Socket Master Series (Box of 20)',
            brand: 'Walton',
            category: 'Switches & Sockets',
            description: 'Ergonomic smooth click piano switches built with silver alloy contacts and fireproof polycarbonate casing.',
            features: ['Silver-Nickel Alloy Contacts', '40,000+ Click Lifespan', 'UV & Heat Resistant PC Body'],
            unitPrice: 2800,
            wholesalePrice: 2250,
            moq: 4,
            stock: 620,
            unitType: 'box',
            warranty: '5 Years Replacement Warranty',
            discountPercent: 20,
            images: ['https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop'],
            tags: ['switches', 'walton', 'piano-switch', 'bulk-box'],
            rating: 4.7,
            reviewCount: 142,
            isApproved: true,
            createdAt: '2026-01-18T14:30:00.000Z'
        },
        {
            id: 'prod_4',
            companyId: 'comp_3',
            companyName: 'Super Star Group (SSG)',
            title: 'Super Star 18W High Lumen LED T-Bulb (Carton of 40)',
            brand: 'Super Star',
            category: 'Lighting & LED',
            description: 'Commercial grade energy efficient LED T-Bulb offering 1600 Lumens with surge protection up to 3.5kV.',
            features: ['Up to 88% Energy Saving', 'Built-in 3.5kV Surge Protector', 'No Flicker Constant Driver'],
            unitPrice: 9600,
            wholesalePrice: 7800,
            moq: 2,
            stock: 350,
            unitType: 'carton',
            warranty: '2 Years Full Replacement Warranty',
            discountPercent: 19,
            images: ['https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&auto=format&fit=crop'],
            tags: ['lighting', 'led', 'ssg', 't-bulb', 'carton'],
            rating: 4.9,
            reviewCount: 215,
            isApproved: true,
            createdAt: '2026-01-20T09:15:00.000Z'
        },
        {
            id: 'prod_5',
            companyId: 'comp_1',
            companyName: 'BRB Cable Industries Ltd',
            title: 'Schneider/BRB Certified Double Pole MCB 63A 10kA',
            brand: 'BRB Schneider',
            category: 'Circuit Breakers & Protection',
            description: 'Miniature Circuit Breaker designed for short circuit and overload protection with DIN-rail mount.',
            features: ['10kA Breaking Capacity', 'Thermal-Magnetic Tripping', 'IEC 60898-1 Certified'],
            unitPrice: 1450,
            wholesalePrice: 1180,
            moq: 10,
            stock: 500,
            unitType: 'piece',
            warranty: '3 Years Warranty',
            discountPercent: 18,
            images: ['https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop'],
            tags: ['breaker', 'mcb', 'protection', '63A'],
            rating: 4.8,
            reviewCount: 78,
            isApproved: true,
            createdAt: '2026-01-22T11:45:00.000Z'
        }
    ],
    orders: [
        {
            id: 'ord_101',
            orderNumber: 'VM-2026-881',
            sellerId: 'usr_seller_1',
            sellerName: 'Al-Haj Rafiqul Islam',
            sellerShop: 'Rafiq Electric & Hardware',
            sellerPhone: '+8801812345678',
            companyId: 'comp_1',
            companyName: 'BRB Cable Industries Ltd',
            items: [
                {
                    productId: 'prod_1',
                    title: 'BRB Single Core Copper Cable (BYA 2.5 RM) - 100M Coil',
                    image: 'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?w=600&auto=format&fit=crop',
                    quantity: 10,
                    unitPrice: 4850,
                    wholesalePrice: 4200,
                    unitType: 'coil'
                }
            ],
            totalAmount: 42000,
            discountAmount: 2000,
            paidAmount: 25000,
            dueAmount: 15000,
            paymentMethod: 'partial',
            paymentStatus: 'partial',
            status: 'shipped',
            shippingAddress: 'Shop 14, Nawabpur Road Electrical Market, Dhaka',
            notes: 'Please dispatch via Sundarban Courier Nawabpur Branch',
            createdAt: '2026-02-15T11:30:00.000Z',
            updatedAt: '2026-02-16T14:00:00.000Z'
        },
        {
            id: 'ord_102',
            orderNumber: 'VM-2026-882',
            sellerId: 'usr_seller_1',
            sellerName: 'Al-Haj Rafiqul Islam',
            sellerShop: 'Rafiq Electric & Hardware',
            sellerPhone: '+8801812345678',
            companyId: 'comp_2',
            companyName: 'Walton Electricals',
            items: [
                {
                    productId: 'prod_3',
                    title: 'Walton Piano Switch & Socket Master Series (Box of 20)',
                    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop',
                    quantity: 8,
                    unitPrice: 2800,
                    wholesalePrice: 2250,
                    unitType: 'box'
                }
            ],
            totalAmount: 18000,
            discountAmount: 0,
            paidAmount: 0,
            dueAmount: 18000,
            paymentMethod: 'credit',
            paymentStatus: 'due',
            status: 'confirmed',
            shippingAddress: 'Shop 14, Nawabpur Road, Dhaka',
            createdAt: '2026-02-18T16:20:00.000Z',
            updatedAt: '2026-02-18T17:00:00.000Z'
        },
        {
            id: 'ord_103',
            orderNumber: 'VM-2026-883',
            sellerId: 'usr_seller_2',
            sellerName: 'Kabir Hossain',
            sellerShop: 'Bismillah Light & Cable',
            sellerPhone: '+8801898765432',
            companyId: 'comp_3',
            companyName: 'Super Star Group (SSG)',
            items: [
                {
                    productId: 'prod_4',
                    title: 'Super Star 18W High Lumen LED T-Bulb (Carton of 40)',
                    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&auto=format&fit=crop',
                    quantity: 4,
                    unitPrice: 9600,
                    wholesalePrice: 7800,
                    unitType: 'carton'
                }
            ],
            totalAmount: 31200,
            discountAmount: 1200,
            paidAmount: 30000,
            dueAmount: 0,
            paymentMethod: 'full',
            paymentStatus: 'paid',
            status: 'delivered',
            shippingAddress: 'New Market Electrical Goli, Chattogram',
            createdAt: '2026-02-10T10:15:00.000Z',
            updatedAt: '2026-02-14T12:00:00.000Z'
        }
    ],
    transactions: [
        {
            id: 'tx_1',
            sellerId: 'usr_seller_1',
            sellerName: 'Al-Haj Rafiqul Islam',
            sellerShop: 'Rafiq Electric & Hardware',
            companyId: 'comp_1',
            companyName: 'BRB Cable Industries Ltd',
            orderId: 'ord_101',
            type: 'purchase',
            amount: 40000,
            previousDue: 0,
            newDue: 40000,
            note: 'Order #VM-2026-881 purchase',
            date: '2026-02-15T11:30:00.000Z'
        },
        {
            id: 'tx_2',
            sellerId: 'usr_seller_1',
            sellerName: 'Al-Haj Rafiqul Islam',
            sellerShop: 'Rafiq Electric & Hardware',
            companyId: 'comp_1',
            companyName: 'BRB Cable Industries Ltd',
            orderId: 'ord_101',
            type: 'payment',
            amount: 25000,
            previousDue: 40000,
            newDue: 15000,
            paymentMethod: 'bKash Merchant (TrxID: 9X82LL7Q)',
            note: 'Advance payment for Order #VM-2026-881',
            date: '2026-02-15T11:35:00.000Z'
        },
        {
            id: 'tx_3',
            sellerId: 'usr_seller_1',
            sellerName: 'Al-Haj Rafiqul Islam',
            sellerShop: 'Rafiq Electric & Hardware',
            companyId: 'comp_2',
            companyName: 'Walton Electricals',
            orderId: 'ord_102',
            type: 'purchase',
            amount: 18000,
            previousDue: 0,
            newDue: 18000,
            paymentMethod: 'Credit (বাকি)',
            note: 'Order #VM-2026-882 credit purchase (15-day term)',
            date: '2026-02-18T16:20:00.000Z'
        }
    ],
    messages: [
        {
            id: 'msg_1',
            conversationId: 'conv_usr_seller_1_comp_1',
            senderId: 'usr_seller_1',
            senderName: 'Al-Haj Rafiqul Islam',
            senderRole: 'seller',
            text: 'Salam brother, I need 10 coils of BYA 2.5 RM today. Is ready stock available?',
            timestamp: '2026-02-15T10:10:00.000Z'
        },
        {
            id: 'msg_2',
            conversationId: 'conv_usr_seller_1_comp_1',
            senderId: 'usr_comp_1',
            senderName: 'Engr. M. Rahman (BRB)',
            senderRole: 'company',
            text: 'Wa alaikum assalam Rafiq bhai. Yes, 450 coils in factory stock. You can place the order now and we will dispatch by 2 PM.',
            timestamp: '2026-02-15T10:15:00.000Z'
        }
    ],
    notifications: [
        {
            id: 'notif_1',
            userId: 'usr_seller_1',
            title: 'Order Dispatched 🚚',
            body: 'Your order #VM-2026-881 has been packed and handed over to Sundarban Courier.',
            type: 'order',
            isRead: false,
            createdAt: '2026-02-16T14:00:00.000Z'
        },
        {
            id: 'notif_2',
            userId: 'usr_seller_1',
            title: 'Payment Received 💰',
            body: 'BRB Cable Industries Ltd has acknowledged your ৳25,000 payment for #VM-2026-881.',
            type: 'payment',
            isRead: true,
            createdAt: '2026-02-15T12:00:00.000Z'
        }
    ]
};
class Database {
    data;
    saveTimeout = null;
    constructor() {
        this.data = this.loadData();
    }
    loadData() {
        try {
            if (!fs_1.default.existsSync(DATA_DIR)) {
                fs_1.default.mkdirSync(DATA_DIR, { recursive: true });
            }
            if (fs_1.default.existsSync(DB_FILE)) {
                const raw = fs_1.default.readFileSync(DB_FILE, 'utf-8');
                return JSON.parse(raw);
            }
        }
        catch (err) {
            console.warn('Could not read existing database file, initializing fresh database:', err);
        }
        // Write initial database
        this.saveDataDirect(INITIAL_DATA);
        return INITIAL_DATA;
    }
    saveDataDirect(data) {
        if (!fs_1.default.existsSync(DATA_DIR)) {
            fs_1.default.mkdirSync(DATA_DIR, { recursive: true });
        }
        fs_1.default.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    }
    scheduleSave() {
        if (this.saveTimeout) {
            clearTimeout(this.saveTimeout);
        }
        this.saveTimeout = setTimeout(() => {
            this.saveDataDirect(this.data);
            this.saveTimeout = null;
        }, 150);
    }
    getRawData() {
        return this.data;
    }
    // Users
    getUsers() {
        return this.data.users;
    }
    findUserById(id) {
        return this.data.users.find(u => u.id === id);
    }
    findUserByEmail(email) {
        return this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    }
    findUserByPhone(phone) {
        return this.data.users.find(u => u.phone === phone);
    }
    addUser(user) {
        this.data.users.push(user);
        this.scheduleSave();
        return user;
    }
    updateUser(id, updates) {
        const idx = this.data.users.findIndex(u => u.id === id);
        if (idx === -1)
            return null;
        this.data.users[idx] = { ...this.data.users[idx], ...updates };
        this.scheduleSave();
        return this.data.users[idx];
    }
    // Companies
    getCompanies() {
        return this.data.companies;
    }
    findCompanyById(id) {
        return this.data.companies.find(c => c.id === id);
    }
    findCompanyByUserId(userId) {
        return this.data.companies.find(c => c.userId === userId);
    }
    addCompany(company) {
        this.data.companies.push(company);
        this.scheduleSave();
        return company;
    }
    updateCompany(id, updates) {
        const idx = this.data.companies.findIndex(c => c.id === id);
        if (idx === -1)
            return null;
        this.data.companies[idx] = { ...this.data.companies[idx], ...updates };
        this.scheduleSave();
        return this.data.companies[idx];
    }
    // Products
    getProducts() {
        return this.data.products;
    }
    findProductById(id) {
        return this.data.products.find(p => p.id === id);
    }
    addProduct(product) {
        this.data.products.unshift(product);
        this.scheduleSave();
        return product;
    }
    updateProduct(id, updates) {
        const idx = this.data.products.findIndex(p => p.id === id);
        if (idx === -1)
            return null;
        this.data.products[idx] = { ...this.data.products[idx], ...updates };
        this.scheduleSave();
        return this.data.products[idx];
    }
    deleteProduct(id) {
        const lenBefore = this.data.products.length;
        this.data.products = this.data.products.filter(p => p.id !== id);
        if (this.data.products.length !== lenBefore) {
            this.scheduleSave();
            return true;
        }
        return false;
    }
    // Orders
    getOrders() {
        return this.data.orders;
    }
    findOrderById(id) {
        return this.data.orders.find(o => o.id === id);
    }
    addOrder(order) {
        this.data.orders.unshift(order);
        this.scheduleSave();
        return order;
    }
    updateOrder(id, updates) {
        const idx = this.data.orders.findIndex(o => o.id === id);
        if (idx === -1)
            return null;
        this.data.orders[idx] = { ...this.data.orders[idx], ...updates, updatedAt: new Date().toISOString() };
        this.scheduleSave();
        return this.data.orders[idx];
    }
    // Ledger / Transactions
    getTransactions() {
        return this.data.transactions || [];
    }
    addTransaction(tx) {
        if (!this.data.transactions)
            this.data.transactions = [];
        this.data.transactions.unshift(tx);
        this.scheduleSave();
        return tx;
    }
    // Messages
    getMessages(conversationId) {
        if (conversationId) {
            return this.data.messages.filter(m => m.conversationId === conversationId);
        }
        return this.data.messages;
    }
    addMessage(msg) {
        this.data.messages.push(msg);
        this.scheduleSave();
        return msg;
    }
    // Notifications
    getNotifications(userId) {
        if (userId) {
            return this.data.notifications.filter(n => n.userId === userId);
        }
        return this.data.notifications;
    }
    addNotification(notif) {
        this.data.notifications.unshift(notif);
        this.scheduleSave();
        return notif;
    }
    markNotificationAsRead(id) {
        const notif = this.data.notifications.find(n => n.id === id);
        if (notif) {
            notif.isRead = true;
            this.scheduleSave();
            return true;
        }
        return false;
    }
}
exports.db = new Database();
