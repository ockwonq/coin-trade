const User = require('../models/User');
const { sendTokenResponse } = require('../utils/jwt');
const CryptoJS = require('crypto-js');

// @desc    회원가입
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { username, email, password, bitgetApiKey, bitgetSecretKey, bitgetPassphrase } = req.body;

    // API 키 암호화 (선택사항)
    let encryptedApiKey, encryptedSecretKey, encryptedPassphrase;

    if (bitgetApiKey && bitgetSecretKey && bitgetPassphrase) {
      const encryptionKey = process.env.JWT_SECRET;
      encryptedApiKey = CryptoJS.AES.encrypt(bitgetApiKey, encryptionKey).toString();
      encryptedSecretKey = CryptoJS.AES.encrypt(bitgetSecretKey, encryptionKey).toString();
      encryptedPassphrase = CryptoJS.AES.encrypt(bitgetPassphrase, encryptionKey).toString();
    }

    const user = await User.create({
      username,
      email,
      password,
      bitgetApiKey: encryptedApiKey,
      bitgetSecretKey: encryptedSecretKey,
      bitgetPassphrase: encryptedPassphrase
    });

    sendTokenResponse(user, 201, res);
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    로그인
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide an email and password'
      });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    현재 로그인한 사용자 정보
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Bitget API 키 업데이트
// @route   PUT /api/auth/bitget-keys
// @access  Private
exports.updateBitgetKeys = async (req, res, next) => {
  try {
    const { bitgetApiKey, bitgetSecretKey, bitgetPassphrase } = req.body;

    const encryptionKey = process.env.JWT_SECRET;
    const encryptedApiKey = CryptoJS.AES.encrypt(bitgetApiKey, encryptionKey).toString();
    const encryptedSecretKey = CryptoJS.AES.encrypt(bitgetSecretKey, encryptionKey).toString();
    const encryptedPassphrase = CryptoJS.AES.encrypt(bitgetPassphrase, encryptionKey).toString();

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        bitgetApiKey: encryptedApiKey,
        bitgetSecretKey: encryptedSecretKey,
        bitgetPassphrase: encryptedPassphrase
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Bitget API keys updated successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};
