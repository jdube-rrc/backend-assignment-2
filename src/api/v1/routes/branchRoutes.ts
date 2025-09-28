import express, { Router } from 'express';
import * as branchController from '../controllers/branchController';

const router: Router = express.Router();

router.get('/', branchController.getAllBranches);
router.get('/:id', branchController.getBranchById);
router.post('/', branchController.createBranch);
router.put('/:id', branchController.updateBranch);
router.delete('/:id', branchController.deleteBranch);

export default router;