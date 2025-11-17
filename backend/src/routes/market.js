const express = require('express');
const router = express.Router();
const {
  getTicker,
  getKline,
  getOrderBook,
  getRecentTrades,
  getSymbols,
  getServerTime
} = require('../controllers/marketController');

router.get('/ticker/:symbol', getTicker);
router.get('/kline/:symbol', getKline);
router.get('/orderbook/:symbol', getOrderBook);
router.get('/trades/:symbol', getRecentTrades);
router.get('/symbols', getSymbols);
router.get('/time', getServerTime);

module.exports = router;
