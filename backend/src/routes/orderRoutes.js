const express = require('express');
const router = express.Router();
const {
  addOrderItems,
  getOrderById,
  getMyOrders,
  getOrders,
  updateOrderStatus,
  getStatsSummary,
  deleteOrder,
  requestOrderReturn,
  processReturnAdmin,
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

const staffOrAdmin = (req, res, next) => {
  if (req.user && ['admin', 'delivery', 'sales'].includes(req.user.role)) {
    return next();
  }
  return res.status(403).json({ message: 'Access denied: Staff or Admin privileges required' });
};

router.route('/')
  .post(protect, addOrderItems)
  .get(protect, staffOrAdmin, getOrders);

router.get('/myorders', protect, getMyOrders);
router.get('/stats/summary', protect, staffOrAdmin, getStatsSummary);
router.route('/:id')
  .get(protect, getOrderById)
  .delete(protect, admin, deleteOrder);
router.put('/:id/status', protect, staffOrAdmin, updateOrderStatus);
router.post('/:id/return', protect, requestOrderReturn);
router.put('/:id/return-process', protect, staffOrAdmin, processReturnAdmin);

module.exports = router;
