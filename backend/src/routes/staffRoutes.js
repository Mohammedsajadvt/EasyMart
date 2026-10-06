const express = require('express');
const router = express.Router();
const {
  getDeliveryFleet,
  createDeliveryPartner,
  updateDeliveryLocation,
  getSalesTeam,
  createSalesRepresentative,
  assignOrderDelivery,
  assignOrderSales,
  getDriverTrips,
  getSalesRepDashboard,
  createSalesLeadOrder,
  deleteStaff,
} = require('../controllers/staffController');
const { protect, admin } = require('../middleware/authMiddleware');

// Delivery Fleet Routes
router.route('/delivery')
  .get(protect, admin, getDeliveryFleet)
  .post(protect, admin, createDeliveryPartner);

router.route('/delivery/my-trips')
  .get(protect, getDriverTrips);

router.route('/delivery/:id/location')
  .put(protect, updateDeliveryLocation);

// Sales Team Routes
router.route('/sales')
  .get(protect, admin, getSalesTeam)
  .post(protect, admin, createSalesRepresentative);

router.route('/sales/my-dashboard')
  .get(protect, getSalesRepDashboard);

router.route('/sales/create-lead-order')
  .post(protect, createSalesLeadOrder);

// Order Assignment Routes
router.route('/assign-delivery/:id')
  .put(protect, admin, assignOrderDelivery);

router.route('/assign-sales/:id')
  .put(protect, admin, assignOrderSales);

// Staff Deletion
router.route('/:id')
  .delete(protect, admin, deleteStaff);

module.exports = router;
