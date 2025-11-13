import express from 'express';
import { 
  getCustomers, 
  getCustomer, 
  addCustomer, 
  updateCustomer, 
  deleteCustomer 
} from '../controllers/customerController.js';

const router = express.Router();

router.get('/', getCustomers);
router.get('/:id', getCustomer);
router.post('/', addCustomer);
router.put('/:id', updateCustomer);
router.delete('/:id', deleteCustomer);

export default router;