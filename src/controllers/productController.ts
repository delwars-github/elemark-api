import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../db';
import { AuthRequest } from '../middleware/auth';
import { Product } from '../types';

export const getProducts = (req: AuthRequest, res: Response): void => {
  try {
    let products = db.getProducts();
    const { category, companyId, search, sort, inStockOnly } = req.query;

    if (category && typeof category === 'string' && category !== 'All') {
      products = products.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }

    if (companyId && typeof companyId === 'string') {
      products = products.filter(p => p.companyId === companyId);
    }

    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      products = products.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    if (inStockOnly === 'true') {
      products = products.filter(p => p.stock > 0);
    }

    // Sorting
    if (sort === 'price_asc') {
      products.sort((a, b) => a.wholesalePrice - b.wholesalePrice);
    } else if (sort === 'price_desc') {
      products.sort((a, b) => b.wholesalePrice - a.wholesalePrice);
    } else if (sort === 'rating') {
      products.sort((a, b) => b.rating - a.rating);
    } else {
      // Default: newest first
      products.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    res.json({
      success: true,
      count: products.length,
      products
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getProductById = (req: AuthRequest, res: Response): void => {
  const id = req.params.id as string;
  const product = db.findProductById(id);
  if (!product) {
    res.status(404).json({ success: false, message: 'Product not found' });
    return;
  }
  res.json({ success: true, product });
};

export const createProduct = (req: AuthRequest, res: Response): void => {
  try {
    const {
      title,
      brand,
      category,
      description,
      features,
      unitPrice,
      wholesalePrice,
      moq,
      stock,
      unitType,
      warranty,
      discountPercent,
      images,
      tags,
      companyId: reqCompanyId
    } = req.body;

    if (!title || !wholesalePrice || !moq || !stock) {
      res.status(400).json({ success: false, message: 'Missing required product parameters' });
      return;
    }

    // Determine company
    let resolvedCompanyId = reqCompanyId;
    let resolvedCompanyName = 'VoltMart Partner';

    if (req.user?.role === 'company') {
      const company = db.findCompanyByUserId(req.user.id);
      if (company) {
        resolvedCompanyId = company.id;
        resolvedCompanyName = company.name;
      }
    } else if (reqCompanyId) {
      const company = db.findCompanyById(reqCompanyId);
      if (company) {
        resolvedCompanyName = company.name;
      }
    }

    const newProduct: Product = {
      id: `prod_${uuidv4().substring(0, 8)}`,
      companyId: resolvedCompanyId || 'comp_1',
      companyName: resolvedCompanyName,
      title,
      brand: brand || resolvedCompanyName,
      category: category || 'Electrical Supplies',
      description: description || '',
      features: Array.isArray(features) ? features : [],
      unitPrice: Number(unitPrice) || Number(wholesalePrice) * 1.2,
      wholesalePrice: Number(wholesalePrice),
      moq: Number(moq) || 1,
      stock: Number(stock) || 0,
      unitType: unitType || 'piece',
      warranty: warranty || '1 Year Standard Warranty',
      discountPercent: Number(discountPercent) || 0,
      images: Array.isArray(images) && images.length > 0 ? images : [
        'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?w=600&auto=format&fit=crop'
      ],
      tags: Array.isArray(tags) ? tags : ['wholesale', 'electrical'],
      rating: 5.0,
      reviewCount: 0,
      isApproved: true,
      createdAt: new Date().toISOString()
    };

    db.addProduct(newProduct);

    // Update company stats
    const comp = db.findCompanyById(newProduct.companyId);
    if (comp) {
      db.updateCompany(comp.id, { totalProducts: comp.totalProducts + 1 });
    }

    res.status(201).json({
      success: true,
      message: 'Product listed successfully',
      product: newProduct
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateProduct = (req: AuthRequest, res: Response): void => {
  const id = req.params.id as string;
  const existing = db.findProductById(id);
  if (!existing) {
    res.status(404).json({ success: false, message: 'Product not found' });
    return;
  }

  const updated = db.updateProduct(id, req.body);
  res.json({
    success: true,
    message: 'Product updated successfully',
    product: updated
  });
};

export const deleteProduct = (req: AuthRequest, res: Response): void => {
  const id = req.params.id as string;
  const success = db.deleteProduct(id);
  if (!success) {
    res.status(404).json({ success: false, message: 'Product not found' });
    return;
  }
  res.json({ success: true, message: 'Product deleted successfully' });
};
