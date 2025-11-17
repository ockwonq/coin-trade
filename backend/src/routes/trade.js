const express = require('express');
const router = express.Router();
const {
  placeSpotOrder,
  cancelOrder,
  getOrders,
  getOrderDetail,
  getStatistics
} = require('../controllers/tradeController');
const { protect } = require('../middleware/auth');

router.post('/spot/order', protect, placeSpotOrder);
router.delete('/order/:orderId', protect, cancelOrder);
router.get('/orders', protect, getOrders);
router.get('/order/:id', protect, getOrderDetail);
router.get('/statistics', protect, getStatistics);

module.exports = router;
