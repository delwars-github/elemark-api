"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUsers = exports.getMe = exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const uuid_1 = require("uuid");
const db_1 = require("../db");
const auth_1 = require("../middleware/auth");
const register = async (req, res) => {
    try {
        const { name, email, phone, password, role, companyName, shopName, address, tradeLicense } = req.body;
        if (!name || !email || !password || !role) {
            res.status(400).json({ success: false, message: 'Missing required fields' });
            return;
        }
        if (db_1.db.findUserByEmail(email)) {
            res.status(409).json({ success: false, message: 'An account with this email already exists' });
            return;
        }
        const salt = await bcryptjs_1.default.genSalt(10);
        const passwordHash = await bcryptjs_1.default.hash(password, salt);
        const newUser = {
            id: `usr_${(0, uuid_1.v4)().substring(0, 8)}`,
            name,
            email: email.toLowerCase(),
            phone: phone || '',
            passwordHash,
            role: role === 'company' ? 'company' : 'seller',
            companyName: role === 'company' ? (companyName || name) : undefined,
            shopName: role === 'seller' ? (shopName || `${name}'s Shop`) : undefined,
            address: address || 'Dhaka, Bangladesh',
            tradeLicense: tradeLicense || '',
            verified: role === 'seller', // sellers pre-verified for demo, companies pending KYC
            creditLimit: role === 'seller' ? 250000 : undefined,
            createdAt: new Date().toISOString()
        };
        db_1.db.addUser(newUser);
        // If company, also register company entity
        if (newUser.role === 'company') {
            const newCompany = {
                id: `comp_${(0, uuid_1.v4)().substring(0, 8)}`,
                userId: newUser.id,
                name: newUser.companyName || name,
                logo: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=200&auto=format&fit=crop',
                rating: 5.0,
                reviewCount: 0,
                verified: false,
                tradeLicense: tradeLicense || '',
                phone: newUser.phone,
                email: newUser.email,
                address: newUser.address,
                totalProducts: 0,
                totalOrders: 0,
                totalRevenue: 0,
                pendingDues: 0,
                createdAt: new Date().toISOString()
            };
            db_1.db.addCompany(newCompany);
        }
        const token = (0, auth_1.generateToken)(newUser);
        const { passwordHash: _, ...userSafe } = newUser;
        res.status(201).json({
            success: true,
            message: 'Account registered successfully',
            token,
            user: userSafe
        });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        if (!email || !password) {
            res.status(400).json({ success: false, message: 'Email and password required' });
            return;
        }
        const user = db_1.db.findUserByEmail(email);
        if (!user) {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
            return;
        }
        // Role check if provided
        if (role && user.role !== role && user.role !== 'admin') {
            res.status(403).json({ success: false, message: `Account is registered as ${user.role}, not ${role}` });
            return;
        }
        // For demo convenience, accept "password123" directly or bcrypt match
        const isValid = password === 'password123' || await bcryptjs_1.default.compare(password, user.passwordHash);
        if (!isValid) {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
            return;
        }
        const token = (0, auth_1.generateToken)(user);
        const { passwordHash: _, ...userSafe } = user;
        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: userSafe
        });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
exports.login = login;
const getMe = (req, res) => {
    if (!req.user) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
    }
    const { passwordHash: _, ...userSafe } = req.user;
    res.json({ success: true, user: userSafe });
};
exports.getMe = getMe;
const getAllUsers = (req, res) => {
    const users = db_1.db.getUsers().map(({ passwordHash, ...rest }) => rest);
    res.json({ success: true, users });
};
exports.getAllUsers = getAllUsers;
