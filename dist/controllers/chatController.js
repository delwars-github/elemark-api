"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessage = exports.getMessages = void 0;
const uuid_1 = require("uuid");
const db_1 = require("../db");
const getMessages = (req, res) => {
    const conversationId = req.params.conversationId;
    const messages = db_1.db.getMessages(conversationId);
    res.json({ success: true, count: messages.length, messages });
};
exports.getMessages = getMessages;
const sendMessage = (req, res) => {
    try {
        const { conversationId, text, senderId, senderName, senderRole } = req.body;
        if (!text || !conversationId) {
            res.status(400).json({ success: false, message: 'text and conversationId required' });
            return;
        }
        const newMsg = {
            id: `msg_${(0, uuid_1.v4)().substring(0, 8)}`,
            conversationId,
            senderId: req.user?.id || senderId || 'usr_seller_1',
            senderName: req.user?.name || senderName || 'User',
            senderRole: req.user?.role || senderRole || 'seller',
            text,
            timestamp: new Date().toISOString()
        };
        db_1.db.addMessage(newMsg);
        res.status(201).json({ success: true, message: newMsg });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
exports.sendMessage = sendMessage;
