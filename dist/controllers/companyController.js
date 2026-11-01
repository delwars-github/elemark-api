"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyCompany = exports.getCompanyById = exports.getCompanies = void 0;
const db_1 = require("../db");
const getCompanies = (req, res) => {
    const companies = db_1.db.getCompanies();
    res.json({ success: true, count: companies.length, companies });
};
exports.getCompanies = getCompanies;
const getCompanyById = (req, res) => {
    const id = req.params.id;
    const company = db_1.db.findCompanyById(id);
    if (!company) {
        res.status(404).json({ success: false, message: 'Company not found' });
        return;
    }
    const products = db_1.db.getProducts().filter(p => p.companyId === id);
    res.json({ success: true, company, products });
};
exports.getCompanyById = getCompanyById;
const verifyCompany = (req, res) => {
    const id = req.params.id;
    const company = db_1.db.findCompanyById(id);
    if (!company) {
        res.status(404).json({ success: false, message: 'Company not found' });
        return;
    }
    const updated = db_1.db.updateCompany(id, { verified: true });
    res.json({ success: true, message: 'Company verified successfully', company: updated });
};
exports.verifyCompany = verifyCompany;
