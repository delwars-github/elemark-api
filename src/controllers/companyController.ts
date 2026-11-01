import { Response } from 'express';
import { db } from '../db';
import { AuthRequest } from '../middleware/auth';

export const getCompanies = (req: AuthRequest, res: Response): void => {
  const companies = db.getCompanies();
  res.json({ success: true, count: companies.length, companies });
};

export const getCompanyById = (req: AuthRequest, res: Response): void => {
  const id = req.params.id as string;
  const company = db.findCompanyById(id);
  if (!company) {
    res.status(404).json({ success: false, message: 'Company not found' });
    return;
  }
  const products = db.getProducts().filter(p => p.companyId === id);
  res.json({ success: true, company, products });
};

export const verifyCompany = (req: AuthRequest, res: Response): void => {
  const id = req.params.id as string;
  const company = db.findCompanyById(id);
  if (!company) {
    res.status(404).json({ success: false, message: 'Company not found' });
    return;
  }
  const updated = db.updateCompany(id, { verified: true });
  res.json({ success: true, message: 'Company verified successfully', company: updated });
};
