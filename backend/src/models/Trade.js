const mongoose = require('mongoose');

const tradeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  symbol: {
    type: String,
    required: true
  },
  side: {
    type: String,
    enum: ['buy', 'sell'],
    required: true
  },
  orderType: {
    type: String,
    enum: ['market', 'limit', 'stop'],
    default: 'market'
  },
  price: {
    type: Number,
    required: function() {
      return this.orderType === 'limit';
    }
  },
  quantity: {
    type: Number,
    required: true
  },
  filledQuantity: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['pending', 'filled', 'partially_filled', 'cancelled', 'failed'],
    default: 'pending'
  },
  orderId: {
    type: String,
    unique: true,
    sparse: true
  },
  bitgetOrderId: {
    type: String
  },
  totalCost: {
    type: Number
  },
  fees: {
    type: Number,
    default: 0
  },
  profit: {
    type: Number
  },
  strategyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Strategy'
  },
  error: {
    type: String
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

tradeSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Trade', tradeSchema);
