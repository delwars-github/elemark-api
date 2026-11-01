import { Response } from 'express';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../db';
import { AuthRequest, generateToken } from '../middleware/auth';
import { User, Company } from '../types';

export const register = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, email, phone, password, role, companyName, shopName, address, tradeLicense } = req.body;

    if (!name || !email || !password || !role) {
      res.status(400).json({ success: false, message: 'Missing required fields' });
      return;
    }

    if (db.findUserByEmail(email)) {
      res.status(409).json({ success: false, message: 'An account with this email already exists' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser: User = {
      id: `usr_${uuidv4().substring(0, 8)}`,
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

    db.addUser(newUser);

    // If company, also register company entity
    if (newUser.role === 'company') {
      const newCompany: Company = {
        id: `comp_${uuidv4().substring(0, 8)}`,
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
      db.addCompany(newCompany);
    }

    const token = generateToken(newUser);
    const { passwordHash: _, ...userSafe } = newUser;

    res.status(201).json({
      success: true,
      message: 'Account registered successfully',
      token,
      user: userSafe
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const login = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, message: 'Email and password required' });
      return;
    }

    const user = db.findUserByEmail(email);
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
    const isValid = password === 'password123' || await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
      return;
    }

    const token = generateToken(user);
    const { passwordHash: _, ...userSafe } = user;

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: userSafe
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getMe = (req: AuthRequest, res: Response): void => {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Unauthorized' });
    return;
  }
  const { passwordHash: _, ...userSafe } = req.user;
  res.json({ success: true, user: userSafe });
};

export const getAllUsers = (req: AuthRequest, res: Response): void => {
  const users = db.getUsers().map(({ passwordHash, ...rest }) => rest);
  res.json({ success: true, users });
};

