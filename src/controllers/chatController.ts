import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../db';
import { AuthRequest } from '../middleware/auth';
import { ChatMessage } from '../types';

export const getMessages = (req: AuthRequest, res: Response): void => {
  const conversationId = req.params.conversationId as string;
  const messages = db.getMessages(conversationId);
  res.json({ success: true, count: messages.length, messages });
};

export const sendMessage = (req: AuthRequest, res: Response): void => {
  try {
    const { conversationId, text, senderId, senderName, senderRole } = req.body;

    if (!text || !conversationId) {
      res.status(400).json({ success: false, message: 'text and conversationId required' });
      return;
    }

    const newMsg: ChatMessage = {
      id: `msg_${uuidv4().substring(0, 8)}`,
      conversationId,
      senderId: req.user?.id || senderId || 'usr_seller_1',
      senderName: req.user?.name || senderName || 'User',
      senderRole: req.user?.role || senderRole || 'seller',
      text,
      timestamp: new Date().toISOString()
    };

    db.addMessage(newMsg);

    res.status(201).json({ success: true, message: newMsg });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};
