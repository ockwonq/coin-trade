const BitgetService = require('../services/bitgetService');
const User = require('../models/User');
const CryptoJS = require('crypto-js');

// 사용자의 Bitget API 키를 복호화하여 서비스 인스턴스 생성
const getUserBitgetService = async (userId) => {
  const user = await User.findById(userId).select('+bitgetApiKey +bitgetSecretKey +bitgetPassphrase');

  if (!user.bitgetApiKey || !user.bitgetSecretKey || !user.bitgetPassphrase) {
    throw new Error('Bitget API keys not configured. Please add your API keys in settings.');
  }

  const encryptionKey = process.env.JWT_SECRET;
  const apiKey = CryptoJS.AES.decrypt(user.bitgetApiKey, encryptionKey).toString(CryptoJS.enc.Utf8);
  const secretKey = CryptoJS.AES.decrypt(user.bitgetSecretKey, encryptionKey).toString(CryptoJS.enc.Utf8);
  const passphrase = CryptoJS.AES.decrypt(user.bitgetPassphrase, encryptionKey).toString(CryptoJS.enc.Utf8);

  return new BitgetService(apiKey, secretKey, passphrase);
};

// @desc    Spot 잔고 조회
// @route   GET /api/account/balance
// @access  Private
exports.getSpotBalance = async (req, res) => {
  try {
    const bitgetService = await getUserBitgetService(req.user.id);
    const data = await bitgetService.getSpotBalance();

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

// @desc    Futures 잔고 조회
// @route   GET /api/account/futures-balance
// @access  Private
exports.getFuturesBalance = async (req, res) => {
  try {
    const { productType = 'umcbl' } = req.query;
    const bitgetService = await getUserBitgetService(req.user.id);
    const data = await bitgetService.getFuturesBalance(productType);

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
