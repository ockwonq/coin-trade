const BitgetService = require('../services/bitgetService');

const bitgetService = new BitgetService();

// @desc    현재가 조회 (Spot)
// @route   GET /api/market/ticker/:symbol
// @access  Public
exports.getTicker = async (req, res) => {
  try {
    const { symbol } = req.params;
    const data = await bitgetService.getSpotTicker(symbol);

    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    K-line 데이터 조회
// @route   GET /api/market/kline/:symbol
// @access  Public
exports.getKline = async (req, res) => {
  try {
    const { symbol } = req.params;
    const { interval = '15m', limit = 100 } = req.query;

    const data = await bitgetService.getKline(symbol, interval, parseInt(limit));

    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Order Book 조회
// @route   GET /api/market/orderbook/:symbol
// @access  Public
exports.getOrderBook = async (req, res) => {
  try {
    const { symbol } = req.params;
    const { limit = 100 } = req.query;

    const data = await bitgetService.getOrderBook(symbol, parseInt(limit));

    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    최근 거래 내역
// @route   GET /api/market/trades/:symbol
// @access  Public
exports.getRecentTrades = async (req, res) => {
  try {
    const { symbol } = req.params;
    const { limit = 100 } = req.query;

    const data = await bitgetService.getRecentTrades(symbol, parseInt(limit));

    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    거래 가능한 심볼 목록
// @route   GET /api/market/symbols
// @access  Public
exports.getSymbols = async (req, res) => {
  try {
    const data = await bitgetService.getSymbols();

    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    서버 시간
// @route   GET /api/market/time
// @access  Public
exports.getServerTime = async (req, res) => {
  try {
    const data = await bitgetService.getServerTime();

    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};
