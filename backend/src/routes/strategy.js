const express = require('express');
const router = express.Router();
const {
  createStrategy,
  getStrategies,
  getStrategy,
  updateStrategy,
  deleteStrategy,
  startStrategy,
  stopStrategy,
  getStrategyStatistics
} = require('../controllers/strategyController');
const { protect } = require('../middleware/auth');

router.post('/', protect, createStrategy);
router.get('/', protect, getStrategies);
router.get('/:id', protect, getStrategy);
router.put('/:id', protect, updateStrategy);
router.delete('/:id', protect, deleteStrategy);
router.post('/:id/start', protect, startStrategy);
router.post('/:id/stop', protect, stopStrategy);
router.get('/:id/statistics', protect, getStrategyStatistics);

module.exports = router;
