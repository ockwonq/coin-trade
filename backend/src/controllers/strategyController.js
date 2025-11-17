const Strategy = require('../models/Strategy');
const strategyService = require('../services/strategyService');

// @desc    전략 생성
// @route   POST /api/strategy
// @access  Private
exports.createStrategy = async (req, res) => {
  try {
    const strategyData = {
      ...req.body,
      user: req.user.id
    };

    const strategy = await Strategy.create(strategyData);

    res.status(201).json({
      success: true,
      data: strategy
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    전략 목록 조회
// @route   GET /api/strategy
// @access  Private
exports.getStrategies = async (req, res) => {
  try {
    const strategies = await Strategy.find({ user: req.user.id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: strategies.length,
      data: strategies
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    전략 상세 조회
// @route   GET /api/strategy/:id
// @access  Private
exports.getStrategy = async (req, res) => {
  try {
    const strategy = await Strategy.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!strategy) {
      return res.status(404).json({
        success: false,
        error: 'Strategy not found'
      });
    }

    res.status(200).json({
      success: true,
      data: strategy
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    전략 업데이트
// @route   PUT /api/strategy/:id
// @access  Private
exports.updateStrategy = async (req, res) => {
  try {
    let strategy = await Strategy.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!strategy) {
      return res.status(404).json({
        success: false,
        error: 'Strategy not found'
      });
    }

    if (strategy.isActive) {
      return res.status(400).json({
        success: false,
        error: 'Cannot update active strategy. Please stop it first.'
      });
    }

    strategy = await Strategy.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: strategy
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    전략 삭제
// @route   DELETE /api/strategy/:id
// @access  Private
exports.deleteStrategy = async (req, res) => {
  try {
    const strategy = await Strategy.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!strategy) {
      return res.status(404).json({
        success: false,
        error: 'Strategy not found'
      });
    }

    if (strategy.isActive) {
      return res.status(400).json({
        success: false,
        error: 'Cannot delete active strategy. Please stop it first.'
      });
    }

    await strategy.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    전략 시작
// @route   POST /api/strategy/:id/start
// @access  Private
exports.startStrategy = async (req, res) => {
  try {
    const strategy = await strategyService.startStrategy(req.params.id, req.user.id);

    res.status(200).json({
      success: true,
      message: 'Strategy started successfully',
      data: strategy
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    전략 중지
// @route   POST /api/strategy/:id/stop
// @access  Private
exports.stopStrategy = async (req, res) => {
  try {
    const strategy = await strategyService.stopStrategy(req.params.id, req.user.id);

    res.status(200).json({
      success: true,
      message: 'Strategy stopped successfully',
      data: strategy
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    전략 통계 조회
// @route   GET /api/strategy/:id/statistics
// @access  Private
exports.getStrategyStatistics = async (req, res) => {
  try {
    const strategy = await Strategy.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!strategy) {
      return res.status(404).json({
        success: false,
        error: 'Strategy not found'
      });
    }

    res.status(200).json({
      success: true,
      data: strategy.statistics
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};
