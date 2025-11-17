const BitgetService = require('../services/bitgetService');
const Trade = require('../models/Trade');
const User = require('../models/User');
const CryptoJS = require('crypto-js');

// 사용자의 Bitget API 키를 복호화하여 서비스 인스턴스 생성
const getUserBitgetService = async (userId) => {
  const user = await User.findById(userId).select('+bitgetApiKey +bitgetSecretKey +bitgetPassphrase');

  if (!user.bitgetApiKey || !user.bitgetSecretKey || !user.bitgetPassphrase) {
    throw new Error('Bitget API keys not configured');
  }

  const encryptionKey = process.env.JWT_SECRET;
  const apiKey = CryptoJS.AES.decrypt(user.bitgetApiKey, encryptionKey).toString(CryptoJS.enc.Utf8);
  const secretKey = CryptoJS.AES.decrypt(user.bitgetSecretKey, encryptionKey).toString(CryptoJS.enc.Utf8);
  const passphrase = CryptoJS.AES.decrypt(user.bitgetPassphrase, encryptionKey).toString(CryptoJS.enc.Utf8);

  return new BitgetService(apiKey, secretKey, passphrase);
};

// @desc    Spot 주문 생성
// @route   POST /api/trade/spot/order
// @access  Private
exports.placeSpotOrder = async (req, res) => {
  try {
    const { symbol, side, orderType, price, quantity } = req.body;

    const bitgetService = await getUserBitgetService(req.user.id);

    // Bitget API로 주문
    const bitgetResponse = await bitgetService.placeSpotOrder({
      symbol,
      side,
      orderType,
      price,
      quantity
    });

    // DB에 거래 기록 저장
    const trade = await Trade.create({
      user: req.user.id,
      symbol,
      side,
      orderType,
      price,
      quantity,
      bitgetOrderId: bitgetResponse.data?.orderId,
      status: 'pending',
      orderId: bitgetResponse.data?.orderId
    });

    res.status(201).json({
      success: true,
      data: {
        trade,
        bitgetResponse
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    주문 취소
// @route   DELETE /api/trade/order/:orderId
// @access  Private
exports.cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const trade = await Trade.findOne({ orderId, user: req.user.id });

    if (!trade) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    const bitgetService = await getUserBitgetService(req.user.id);
    const bitgetResponse = await bitgetService.cancelSpotOrder(trade.symbol, orderId);

    trade.status = 'cancelled';
    await trade.save();

    res.status(200).json({
      success: true,
      data: {
        trade,
        bitgetResponse
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    주문 내역 조회
// @route   GET /api/trade/orders
// @access  Private
exports.getOrders = async (req, res) => {
  try {
    const { symbol, status, limit = 50, page = 1 } = req.query;

    const query = { user: req.user.id };
    if (symbol) query.symbol = symbol;
    if (status) query.status = status;

    const trades = await Trade.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Trade.countDocuments(query);

    res.status(200).json({
      success: true,
      count: trades.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: trades
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    거래 상세 조회
// @route   GET /api/trade/order/:id
// @access  Private
exports.getOrderDetail = async (req, res) => {
  try {
    const trade = await Trade.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!trade) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    res.status(200).json({
      success: true,
      data: trade
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    거래 통계
// @route   GET /api/trade/statistics
// @access  Private
exports.getStatistics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const query = { user: req.user.id };
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const trades = await Trade.find(query);

    const stats = {
      totalTrades: trades.length,
      completedTrades: trades.filter(t => t.status === 'filled').length,
      pendingTrades: trades.filter(t => t.status === 'pending').length,
      cancelledTrades: trades.filter(t => t.status === 'cancelled').length,
      totalProfit: trades.reduce((sum, t) => sum + (t.profit || 0), 0),
      totalFees: trades.reduce((sum, t) => sum + (t.fees || 0), 0),
      winningTrades: trades.filter(t => t.profit > 0).length,
      losingTrades: trades.filter(t => t.profit < 0).length
    };

    stats.winRate = stats.totalTrades > 0
      ? (stats.winningTrades / stats.totalTrades * 100).toFixed(2)
      : 0;

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};
