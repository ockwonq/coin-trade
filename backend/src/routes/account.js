const express = require('express');
const router = express.Router();
const {
  getSpotBalance,
  getFuturesBalance
} = require('../controllers/accountController');
const { protect } = require('../middleware/auth');

router.get('/balance', protect, getSpotBalance);
router.get('/futures-balance', protect, getFuturesBalance);

module.exports = router;
