const express = require('express');
const { isAuthenticated, allowRoles } = require('../middlewares/auth');
const { createCompany, getAllCompanies, getCompanyById, updateCompany, deleteCompany, createRecruiter, getAllRecruiters } = require('../controllers/adminController');
const companyRouter = express.Router();
companyRouter.use(isAuthenticated);
companyRouter.use(allowRoles(['admin']));
companyRouter.post('/', createCompany);
companyRouter.get('/', getAllCompanies);
companyRouter.get('/:id', getCompanyById);
companyRouter.put('/:id', updateCompany);
companyRouter.delete('/:id', deleteCompany);
companyRouter.post('/:id', createRecruiter);
companyRouter.get('/:id/recruiters', getAllRecruiters);

module.exports = companyRouter;