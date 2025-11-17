const mongoose = require('mongoose');

const strategySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  symbol: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['rsi', 'macd', 'bollinger', 'custom'],
    required: true
  },
  parameters: {
    // RSI 전략
    rsiPeriod: Number,
    rsiOverbought: Number,
    rsiOversold: Number,

    // MACD 전략
    macdFast: Number,
    macdSlow: Number,
    macdSignal: Number,

    // Bollinger Bands
    bbPeriod: Number,
    bbStdDev: Number,

    // 공통
    interval: {
      type: String,
      enum: ['1m', '5m', '15m', '30m', '1h', '4h', '1d'],
      default: '15m'
    },
    stopLoss: Number,
    takeProfit: Number,
    maxInvestment: Number
  },
  isActive: {
    type: Boolean,
    default: false
  },
  statistics: {
    totalTrades: {
      type: Number,
      default: 0
    },
    winningTrades: {
      type: Number,
      default: 0
    },
    losingTrades: {
      type: Number,
      default: 0
    },
    totalProfit: {
      type: Number,
      default: 0
    },
    winRate: {
      type: Number,
      default: 0
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

strategySchema.pre('save', function(next) {
  this.updatedAt = Date.now();

  // 승률 계산
  if (this.statistics.totalTrades > 0) {
    this.statistics.winRate = (this.statistics.winningTrades / this.statistics.totalTrades) * 100;
  }

  next();
});

module.exports = mongoose.model('Strategy', strategySchema);
