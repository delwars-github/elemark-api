import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../db';
import { AuthRequest } from '../middleware/auth';
import { LedgerTransaction } from '../types';

export const getLedgerSummary = (req: AuthRequest, res: Response): void => {
  try {
    const { sellerId, companyId } = req.query;
    let orders = db.getOrders();

    if (sellerId && typeof sellerId === 'string') {
      orders = orders.filter(o => o.sellerId === sellerId);
    }
    if (companyId && typeof companyId === 'string') {
      orders = orders.filter(o => o.companyId === companyId);
    }

    const totalPurchases = orders.reduce((sum, o) => sum + o.totalAmount, 0);
    const totalPaid = orders.reduce((sum, o) => sum + o.paidAmount, 0);
    const totalDue = orders.reduce((sum, o) => sum + o.dueAmount, 0);

    res.json({
      success: true,
      summary: {
        totalPurchases,
        totalPaid,
        totalDue,
        totalOrders: orders.length,
        paidPercentage: totalPurchases > 0 ? Math.round((totalPaid / totalPurchases) * 100) : 100,
        duePercentage: totalPurchases > 0 ? Math.round((totalDue / totalPurchases) * 100) : 0
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getCompanyLedgers = (req: AuthRequest, res: Response): void => {
  try {
    const { sellerId } = req.query;
    const companies = db.getCompanies();
    let orders = db.getOrders();

    if (sellerId && typeof sellerId === 'string') {
      orders = orders.filter(o => o.sellerId === sellerId);
    }

    const ledgers = companies.map(comp => {
      const compOrders = orders.filter(o => o.companyId === comp.id);
      const totalPurchased = compOrders.reduce((sum, o) => sum + o.totalAmount, 0);
      const totalPaid = compOrders.reduce((sum, o) => sum + o.paidAmount, 0);
      const totalDue = compOrders.reduce((sum, o) => sum + o.dueAmount, 0);
      const lastOrder = compOrders[0];

      return {
        companyId: comp.id,
        companyName: comp.name,
        companyLogo: comp.logo,
        totalPurchased,
        totalPaid,
        totalDue,
        orderCount: compOrders.length,
        lastTransactionDate: lastOrder ? lastOrder.createdAt : comp.createdAt
      };
    });

    res.json({ success: true, ledgers });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getSellerLedgers = (req: AuthRequest, res: Response): void => {
  try {
    const { companyId } = req.query;
    const sellers = db.getUsers().filter(u => u.role === 'seller');
    let orders = db.getOrders();

    if (companyId && typeof companyId === 'string') {
      orders = orders.filter(o => o.companyId === companyId);
    }

    const ledgers = sellers.map(seller => {
      const sellerOrders = orders.filter(o => o.sellerId === seller.id);
      const totalPurchased = sellerOrders.reduce((sum, o) => sum + o.totalAmount, 0);
      const totalPaid = sellerOrders.reduce((sum, o) => sum + o.paidAmount, 0);
      const totalDue = sellerOrders.reduce((sum, o) => sum + o.dueAmount, 0);
      const lastOrder = sellerOrders[0];

      return {
        sellerId: seller.id,
        sellerName: seller.name,
        sellerShop: seller.shopName || seller.name,
        sellerPhone: seller.phone,
        totalPurchased,
        totalPaid,
        totalDue,
        orderCount: sellerOrders.length,
        lastTransactionDate: lastOrder ? lastOrder.createdAt : seller.createdAt
      };
    });

    res.json({ success: true, ledgers });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getTransactions = (req: AuthRequest, res: Response): void => {
  try {
    let transactions = db.getTransactions();
    const { sellerId, companyId, type } = req.query;

    if (sellerId && typeof sellerId === 'string') {
      transactions = transactions.filter(t => t.sellerId === sellerId);
    }
    if (companyId && typeof companyId === 'string') {
      transactions = transactions.filter(t => t.companyId === companyId);
    }
    if (type && typeof type === 'string') {
      transactions = transactions.filter(t => t.type === type);
    }

    res.json({
      success: true,
      count: transactions.length,
      transactions
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const recordManualPayment = (req: AuthRequest, res: Response): void => {
  try {
    const { sellerId, companyId, amount, paymentMethod, note, receiptUrl } = req.body;

    if (!sellerId || !companyId || !amount) {
      res.status(400).json({ success: false, message: 'sellerId, companyId and amount are required' });
      return;
    }

    const seller = db.findUserById(sellerId);
    const company = db.findCompanyById(companyId);

    if (!seller || !company) {
      res.status(404).json({ success: false, message: 'Seller or Company not found' });
      return;
    }

    const payVal = Number(amount);
    const latestTx = db.getTransactions().find(t => t.sellerId === sellerId && t.companyId === companyId);
    const prevDue = latestTx ? latestTx.newDue : company.pendingDues;
    const newDue = Math.max(0, prevDue - payVal);

    const tx: LedgerTransaction = {
      id: `tx_${uuidv4().substring(0, 8)}`,
      sellerId,
      sellerName: seller.name,
      sellerShop: seller.shopName || seller.name,
      companyId,
      companyName: company.name,
      type: 'payment',
      amount: payVal,
      previousDue: prevDue,
      newDue,
      paymentMethod: paymentMethod || 'Cash Payment',
      note: note || 'Direct payment recorded',
      date: new Date().toISOString()
    };

    db.addTransaction(tx);
    db.updateCompany(companyId, { pendingDues: newDue });

    res.status(201).json({
      success: true,
      message: 'Payment recorded successfully',
      transaction: tx
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

