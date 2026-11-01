import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../db';
import { AuthRequest } from '../middleware/auth';
import { Order, OrderItem, LedgerTransaction } from '../types';

export const getOrders = (req: AuthRequest, res: Response): void => {
  try {
    let orders = db.getOrders();
    const { sellerId, companyId, status, paymentStatus } = req.query;

    if (sellerId && typeof sellerId === 'string') {
      orders = orders.filter(o => o.sellerId === sellerId);
    }
    if (companyId && typeof companyId === 'string') {
      orders = orders.filter(o => o.companyId === companyId);
    }
    if (status && typeof status === 'string') {
      orders = orders.filter(o => o.status === status);
    }
    if (paymentStatus && typeof paymentStatus === 'string') {
      orders = orders.filter(o => o.paymentStatus === paymentStatus);
    }

    res.json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getOrderById = (req: AuthRequest, res: Response): void => {
  const id = req.params.id as string;
  const order = db.findOrderById(id);
  if (!order) {
    res.status(404).json({ success: false, message: 'Order not found' });
    return;
  }
  res.json({ success: true, order });
};

export const createOrder = (req: AuthRequest, res: Response): void => {
  try {
    const {
      items,
      paymentMethod,
      paidAmountInput,
      shippingAddress,
      notes,
      companyId: explicitCompanyId
    } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      res.status(400).json({ success: false, message: 'Cart items cannot be empty' });
      return;
    }

    // Determine seller
    const seller = req.user || db.getUsers().find(u => u.role === 'seller');
    const sellerId = seller ? seller.id : 'usr_seller_1';
    const sellerName = seller ? seller.name : 'Al-Haj Rafiqul Islam';
    const sellerShop = seller?.shopName || 'Rafiq Electric & Hardware';
    const sellerPhone = seller?.phone || '+8801812345678';

    // Compute totals and group/resolve company
    let totalAmount = 0;
    let resolvedCompanyId = explicitCompanyId;
    let resolvedCompanyName = 'VoltMart Partner';

    const orderItems: OrderItem[] = items.map((item: any) => {
      const prod = db.findProductById(item.productId);
      const wholesalePrice = prod ? prod.wholesalePrice : Number(item.wholesalePrice || item.price);
      const qty = Number(item.quantity);
      totalAmount += wholesalePrice * qty;

      if (prod) {
        resolvedCompanyId = prod.companyId;
        resolvedCompanyName = prod.companyName;
        // Deduct inventory
        db.updateProduct(prod.id, { stock: Math.max(0, prod.stock - qty) });
      }

      return {
        productId: item.productId,
        title: item.title,
        image: item.image || item.images?.[0] || '',
        quantity: qty,
        unitPrice: item.unitPrice || wholesalePrice * 1.2,
        wholesalePrice,
        unitType: item.unitType || 'piece'
      };
    });

    const discountAmount = 0;
    let paidAmount = 0;
    let dueAmount = totalAmount;
    let paymentStatus: 'paid' | 'partial' | 'due' = 'due';

    if (paymentMethod === 'full' || paymentMethod === 'bkash' || paymentMethod === 'nagad') {
      paidAmount = totalAmount;
      dueAmount = 0;
      paymentStatus = 'paid';
    } else if (paymentMethod === 'partial') {
      paidAmount = Number(paidAmountInput) || Math.floor(totalAmount * 0.5);
      dueAmount = Math.max(0, totalAmount - paidAmount);
      paymentStatus = dueAmount === 0 ? 'paid' : (paidAmount > 0 ? 'partial' : 'due');
    } else {
      // credit / due (বাকি)
      paidAmount = 0;
      dueAmount = totalAmount;
      paymentStatus = 'due';
    }

    const orderNumber = `VM-2026-${Math.floor(100 + Math.random() * 900)}`;

    const newOrder: Order = {
      id: `ord_${uuidv4().substring(0, 8)}`,
      orderNumber,
      sellerId,
      sellerName,
      sellerShop,
      sellerPhone,
      companyId: resolvedCompanyId || 'comp_1',
      companyName: resolvedCompanyName,
      items: orderItems,
      totalAmount,
      discountAmount,
      paidAmount,
      dueAmount,
      paymentMethod: paymentMethod || 'credit',
      paymentStatus,
      status: 'placed',
      shippingAddress: shippingAddress || 'Nawabpur Road, Dhaka',
      notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    db.addOrder(newOrder);

    // Ledger record
    const prevTx = db.getTransactions().find(t => t.sellerId === sellerId && t.companyId === newOrder.companyId);
    const prevDue = prevTx ? prevTx.newDue : 0;

    const purchaseTx: LedgerTransaction = {
      id: `tx_${uuidv4().substring(0, 8)}`,
      sellerId,
      sellerName,
      sellerShop,
      companyId: newOrder.companyId,
      companyName: newOrder.companyName,
      orderId: newOrder.id,
      type: 'purchase',
      amount: totalAmount,
      previousDue: prevDue,
      newDue: prevDue + totalAmount,
      note: `Order #${orderNumber} wholesale purchase`,
      date: new Date().toISOString()
    };
    db.addTransaction(purchaseTx);

    // If paid upfront partial or full, add payment transaction
    if (paidAmount > 0) {
      const paymentTx: LedgerTransaction = {
        id: `tx_${uuidv4().substring(0, 8)}`,
        sellerId,
        sellerName,
        sellerShop,
        companyId: newOrder.companyId,
        companyName: newOrder.companyName,
        orderId: newOrder.id,
        type: 'payment',
        amount: paidAmount,
        previousDue: purchaseTx.newDue,
        newDue: purchaseTx.newDue - paidAmount,
        paymentMethod: paymentMethod === 'bkash' ? 'bKash Merchant' : (paymentMethod === 'nagad' ? 'Nagad' : 'Cash/Bank'),
        note: `Payment for Order #${orderNumber}`,
        date: new Date().toISOString()
      };
      db.addTransaction(paymentTx);
    }

    // Update company financial totals
    const company = db.findCompanyById(newOrder.companyId);
    if (company) {
      db.updateCompany(company.id, {
        totalOrders: company.totalOrders + 1,
        totalRevenue: company.totalRevenue + totalAmount,
        pendingDues: company.pendingDues + dueAmount
      });
    }

    // Send notification
    db.addNotification({
      id: `notif_${uuidv4().substring(0, 8)}`,
      userId: sellerId,
      title: 'Order Placed Successfully 🎉',
      body: `Your order #${orderNumber} for ৳${totalAmount.toLocaleString()} has been received by ${resolvedCompanyName}.`,
      type: 'order',
      isRead: false,
      createdAt: new Date().toISOString()
    });

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      order: newOrder
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateOrderStatus = (req: AuthRequest, res: Response): void => {
  const id = req.params.id as string;
  const { status } = req.body;

  const order = db.findOrderById(id);
  if (!order) {
    res.status(404).json({ success: false, message: 'Order not found' });
    return;
  }

  const updated = db.updateOrder(id, { status });

  // Notify seller of status update
  db.addNotification({
    id: `notif_${uuidv4().substring(0, 8)}`,
    userId: order.sellerId,
    title: `Order Status: ${status.toUpperCase()} 📦`,
    body: `Your order #${order.orderNumber} is now marked as ${status}.`,
    type: 'order',
    isRead: false,
    createdAt: new Date().toISOString()
  });

  res.json({
    success: true,
    message: `Order status updated to ${status}`,
    order: updated
  });
};

export const payOrderDue = (req: AuthRequest, res: Response): void => {
  try {
    const id = req.params.id as string;
    const { amount, paymentMethod, note } = req.body;

    const order = db.findOrderById(id);
    if (!order) {
      res.status(404).json({ success: false, message: 'Order not found' });
      return;
    }

    const payVal = Number(amount);
    if (!payVal || payVal <= 0) {
      res.status(400).json({ success: false, message: 'Valid payment amount required' });
      return;
    }

    const newPaid = order.paidAmount + payVal;
    const newDue = Math.max(0, order.dueAmount - payVal);
    const newPaymentStatus = newDue === 0 ? 'paid' : 'partial';

    const updatedOrder = db.updateOrder(id, {
      paidAmount: newPaid,
      dueAmount: newDue,
      paymentStatus: newPaymentStatus
    });

    // Ledger transaction
    const latestTx = db.getTransactions().find(t => t.sellerId === order.sellerId && t.companyId === order.companyId);
    const prevDue = latestTx ? latestTx.newDue : order.dueAmount;

    const paymentTx: LedgerTransaction = {
      id: `tx_${uuidv4().substring(0, 8)}`,
      sellerId: order.sellerId,
      sellerName: order.sellerName,
      sellerShop: order.sellerShop,
      companyId: order.companyId,
      companyName: order.companyName,
      orderId: order.id,
      type: 'payment',
      amount: payVal,
      previousDue: prevDue,
      newDue: Math.max(0, prevDue - payVal),
      paymentMethod: paymentMethod || 'bKash / Nagad / Bank',
      note: note || `Due payment installment for Order #${order.orderNumber}`,
      date: new Date().toISOString()
    };
    db.addTransaction(paymentTx);

    // Update company pending dues
    const comp = db.findCompanyById(order.companyId);
    if (comp) {
      db.updateCompany(comp.id, {
        pendingDues: Math.max(0, comp.pendingDues - payVal)
      });
    }

    res.json({
      success: true,
      message: `Payment of ৳${payVal.toLocaleString()} recorded successfully`,
      order: updatedOrder,
      transaction: paymentTx
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};
