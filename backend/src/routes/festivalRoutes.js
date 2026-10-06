const express = require('express');
const router = express.Router();
const {
  getFestivals,
  getActiveFestival,
  getCurrentDateFestival,
  autoDetectTodayFestival,
  toggleFestival,
  applyFestivalOfferToProducts,
  syncIndianCalendar,
  createFestival,
} = require('../controllers/festivalController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .get(getFestivals)
  .post(protect, admin, createFestival);

router.get('/active', getActiveFestival);
router.get('/current-date', getCurrentDateFestival);
router.post('/auto-detect-today', protect, admin, autoDetectTodayFestival);
router.post('/sync-calendar', protect, admin, syncIndianCalendar);
router.put('/:id/toggle', protect, admin, toggleFestival);
router.post('/:id/apply-offers', protect, admin, applyFestivalOfferToProducts);

module.exports = router;
