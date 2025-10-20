import express, { Router } from 'express';
import * as branchController from '../controllers/branchController';
import { validateRequest } from '../../../middleware/validate';
import { branchSchemas } from '../validations/branchValidation';

const router: Router = express.Router();

router.get('/', branchController.getAllBranches);
router.get('/:id', validateRequest(branchSchemas.getById), branchController.getBranchById);
router.post('/', validateRequest(branchSchemas.create), branchController.createBranch);
router.put('/:id', validateRequest(branchSchemas.update), branchController.updateBranch);
router.delete('/:id', validateRequest(branchSchemas.delete), branchController.deleteBranch);

export default router;