"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProductById = exports.getProducts = void 0;
const uuid_1 = require("uuid");
const db_1 = require("../db");
const getProducts = (req, res) => {
    try {
        let products = db_1.db.getProducts();
        const { category, companyId, search, sort, inStockOnly } = req.query;
        if (category && typeof category === 'string' && category !== 'All') {
            products = products.filter(p => p.category.toLowerCase() === category.toLowerCase());
        }
        if (companyId && typeof companyId === 'string') {
            products = products.filter(p => p.companyId === companyId);
        }
        if (search && typeof search === 'string') {
            const q = search.toLowerCase();
            products = products.filter(p => p.title.toLowerCase().includes(q) ||
                p.brand.toLowerCase().includes(q) ||
                p.category.toLowerCase().includes(q) ||
                p.tags.some(t => t.toLowerCase().includes(q)));
        }
        if (inStockOnly === 'true') {
            products = products.filter(p => p.stock > 0);
        }
        // Sorting
        if (sort === 'price_asc') {
            products.sort((a, b) => a.wholesalePrice - b.wholesalePrice);
        }
        else if (sort === 'price_desc') {
            products.sort((a, b) => b.wholesalePrice - a.wholesalePrice);
        }
        else if (sort === 'rating') {
            products.sort((a, b) => b.rating - a.rating);
        }
        else {
            // Default: newest first
            products.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        }
        res.json({
            success: true,
            count: products.length,
            products
        });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
exports.getProducts = getProducts;
const getProductById = (req, res) => {
    const id = req.params.id;
    const product = db_1.db.findProductById(id);
    if (!product) {
        res.status(404).json({ success: false, message: 'Product not found' });
        return;
    }
    res.json({ success: true, product });
};
exports.getProductById = getProductById;
const createProduct = (req, res) => {
    try {
        const { title, brand, category, description, features, unitPrice, wholesalePrice, moq, stock, unitType, warranty, discountPercent, images, tags, companyId: reqCompanyId } = req.body;
        if (!title || !wholesalePrice || !moq || !stock) {
            res.status(400).json({ success: false, message: 'Missing required product parameters' });
            return;
        }
        // Determine company
        let resolvedCompanyId = reqCompanyId;
        let resolvedCompanyName = 'VoltMart Partner';
        if (req.user?.role === 'company') {
            const company = db_1.db.findCompanyByUserId(req.user.id);
            if (company) {
                resolvedCompanyId = company.id;
                resolvedCompanyName = company.name;
            }
        }
        else if (reqCompanyId) {
            const company = db_1.db.findCompanyById(reqCompanyId);
            if (company) {
                resolvedCompanyName = company.name;
            }
        }
        const newProduct = {
            id: `prod_${(0, uuid_1.v4)().substring(0, 8)}`,
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
        db_1.db.addProduct(newProduct);
        // Update company stats
        const comp = db_1.db.findCompanyById(newProduct.companyId);
        if (comp) {
            db_1.db.updateCompany(comp.id, { totalProducts: comp.totalProducts + 1 });
        }
        res.status(201).json({
            success: true,
            message: 'Product listed successfully',
            product: newProduct
        });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
exports.createProduct = createProduct;
const updateProduct = (req, res) => {
    const id = req.params.id;
    const existing = db_1.db.findProductById(id);
    if (!existing) {
        res.status(404).json({ success: false, message: 'Product not found' });
        return;
    }
    const updated = db_1.db.updateProduct(id, req.body);
    res.json({
        success: true,
        message: 'Product updated successfully',
        product: updated
    });
};
exports.updateProduct = updateProduct;
const deleteProduct = (req, res) => {
    const id = req.params.id;
    const success = db_1.db.deleteProduct(id);
    if (!success) {
        res.status(404).json({ success: false, message: 'Product not found' });
        return;
    }
    res.json({ success: true, message: 'Product deleted successfully' });
};
exports.deleteProduct = deleteProduct;
