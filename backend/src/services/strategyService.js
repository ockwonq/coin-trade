const Strategy = require('../models/Strategy');
const Trade = require('../models/Trade');
const BitgetService = require('./bitgetService');

class StrategyService {
  constructor() {
    this.activeStrategies = new Map();
    this.intervals = new Map();
  }

  // RSI 계산
  calculateRSI(prices, period = 14) {
    if (prices.length < period + 1) {
      return null;
    }

    let gains = 0;
    let losses = 0;

    // 첫 번째 평균 계산
    for (let i = 1; i <= period; i++) {
      const difference = prices[i] - prices[i - 1];
      if (difference >= 0) {
        gains += difference;
      } else {
        losses -= difference;
      }
    }

    let avgGain = gains / period;
    let avgLoss = losses / period;

    // 이후 평균 계산 (Wilder's smoothing)
    for (let i = period + 1; i < prices.length; i++) {
      const difference = prices[i] - prices[i - 1];

      if (difference >= 0) {
        avgGain = (avgGain * (period - 1) + difference) / period;
        avgLoss = (avgLoss * (period - 1)) / period;
      } else {
        avgGain = (avgGain * (period - 1)) / period;
        avgLoss = (avgLoss * (period - 1) - difference) / period;
      }
    }

    const rs = avgGain / avgLoss;
    const rsi = 100 - (100 / (1 + rs));

    return rsi;
  }

  // EMA 계산
  calculateEMA(prices, period) {
    const multiplier = 2 / (period + 1);
    let ema = prices[0];

    for (let i = 1; i < prices.length; i++) {
      ema = (prices[i] - ema) * multiplier + ema;
    }

    return ema;
  }

  // MACD 계산
  calculateMACD(prices, fastPeriod = 12, slowPeriod = 26, signalPeriod = 9) {
    const emaFast = this.calculateEMA(prices, fastPeriod);
    const emaSlow = this.calculateEMA(prices, slowPeriod);
    const macdLine = emaFast - emaSlow;

    // Signal line (MACD의 EMA)
    const macdHistory = [];
    for (let i = 0; i < prices.length; i++) {
      const fast = this.calculateEMA(prices.slice(0, i + 1), fastPeriod);
      const slow = this.calculateEMA(prices.slice(0, i + 1), slowPeriod);
      macdHistory.push(fast - slow);
    }

    const signalLine = this.calculateEMA(macdHistory.slice(-signalPeriod), signalPeriod);
    const histogram = macdLine - signalLine;

    return { macdLine, signalLine, histogram };
  }

  // Bollinger Bands 계산
  calculateBollingerBands(prices, period = 20, stdDev = 2) {
    const sma = prices.slice(-period).reduce((a, b) => a + b, 0) / period;

    const squaredDifferences = prices.slice(-period).map(price => Math.pow(price - sma, 2));
    const variance = squaredDifferences.reduce((a, b) => a + b, 0) / period;
    const standardDeviation = Math.sqrt(variance);

    return {
      upper: sma + (standardDeviation * stdDev),
      middle: sma,
      lower: sma - (standardDeviation * stdDev)
    };
  }

  // RSI 전략 실행
  async executeRSIStrategy(strategy, bitgetService) {
    const { symbol, parameters } = strategy;
    const { rsiPeriod = 14, rsiOverbought = 70, rsiOversold = 30, interval = '15m' } = parameters;

    try {
      // K-line 데이터 가져오기
      const klineData = await bitgetService.getKline(symbol, interval, rsiPeriod + 10);

      if (!klineData.data || klineData.data.length < rsiPeriod + 1) {
        console.log('Insufficient data for RSI calculation');
        return;
      }

      const closePrices = klineData.data.map(candle => parseFloat(candle[4])); // close price
      const rsi = this.calculateRSI(closePrices, rsiPeriod);

      console.log(`${symbol} RSI: ${rsi?.toFixed(2)}`);

      if (rsi === null) return;

      // 매수 신호 (과매도)
      if (rsi < rsiOversold) {
        await this.executeTrade(strategy, bitgetService, 'buy', 'RSI oversold');
      }
      // 매도 신호 (과매수)
      else if (rsi > rsiOverbought) {
        await this.executeTrade(strategy, bitgetService, 'sell', 'RSI overbought');
      }
    } catch (error) {
      console.error('Error executing RSI strategy:', error);
    }
  }

  // MACD 전략 실행
  async executeMACDStrategy(strategy, bitgetService) {
    const { symbol, parameters } = strategy;
    const { macdFast = 12, macdSlow = 26, macdSignal = 9, interval = '15m' } = parameters;

    try {
      const klineData = await bitgetService.getKline(symbol, interval, macdSlow + 20);

      if (!klineData.data || klineData.data.length < macdSlow + 1) {
        console.log('Insufficient data for MACD calculation');
        return;
      }

      const closePrices = klineData.data.map(candle => parseFloat(candle[4]));
      const macd = this.calculateMACD(closePrices, macdFast, macdSlow, macdSignal);

      console.log(`${symbol} MACD: ${macd.histogram.toFixed(2)}`);

      // 골든 크로스 (매수 신호)
      if (macd.histogram > 0 && macd.macdLine > macd.signalLine) {
        await this.executeTrade(strategy, bitgetService, 'buy', 'MACD golden cross');
      }
      // 데드 크로스 (매도 신호)
      else if (macd.histogram < 0 && macd.macdLine < macd.signalLine) {
        await this.executeTrade(strategy, bitgetService, 'sell', 'MACD dead cross');
      }
    } catch (error) {
      console.error('Error executing MACD strategy:', error);
    }
  }

  // Bollinger Bands 전략 실행
  async executeBollingerStrategy(strategy, bitgetService) {
    const { symbol, parameters } = strategy;
    const { bbPeriod = 20, bbStdDev = 2, interval = '15m' } = parameters;

    try {
      const klineData = await bitgetService.getKline(symbol, interval, bbPeriod + 10);

      if (!klineData.data || klineData.data.length < bbPeriod) {
        console.log('Insufficient data for Bollinger Bands calculation');
        return;
      }

      const closePrices = klineData.data.map(candle => parseFloat(candle[4]));
      const currentPrice = closePrices[closePrices.length - 1];
      const bb = this.calculateBollingerBands(closePrices, bbPeriod, bbStdDev);

      console.log(`${symbol} Price: ${currentPrice.toFixed(2)}, BB Lower: ${bb.lower.toFixed(2)}, BB Upper: ${bb.upper.toFixed(2)}`);

      // 하단 밴드 터치 (매수 신호)
      if (currentPrice <= bb.lower) {
        await this.executeTrade(strategy, bitgetService, 'buy', 'Price at lower Bollinger Band');
      }
      // 상단 밴드 터치 (매도 신호)
      else if (currentPrice >= bb.upper) {
        await this.executeTrade(strategy, bitgetService, 'sell', 'Price at upper Bollinger Band');
      }
    } catch (error) {
      console.error('Error executing Bollinger strategy:', error);
    }
  }

  // 거래 실행
  async executeTrade(strategy, bitgetService, side, reason) {
    try {
      const { symbol, parameters, user } = strategy;
      const { maxInvestment = 100 } = parameters;

      // 현재가 가져오기
      const ticker = await bitgetService.getSpotTicker(symbol);
      const currentPrice = parseFloat(ticker.data.close);

      // 거래량 계산
      const quantity = (maxInvestment / currentPrice).toFixed(8);

      console.log(`Executing ${side} order: ${symbol} @ ${currentPrice}, Quantity: ${quantity}, Reason: ${reason}`);

      // 주문 생성
      const orderResponse = await bitgetService.placeSpotOrder({
        symbol,
        side,
        orderType: 'market',
        quantity
      });

      // DB에 거래 기록
      const trade = await Trade.create({
        user: strategy.user,
        symbol,
        side,
        orderType: 'market',
        price: currentPrice,
        quantity,
        strategyId: strategy._id,
        bitgetOrderId: orderResponse.data?.orderId,
        status: 'pending'
      });

      // 전략 통계 업데이트
      strategy.statistics.totalTrades += 1;
      await strategy.save();

      return trade;
    } catch (error) {
      console.error('Error executing trade:', error);
      throw error;
    }
  }

  // 전략 시작
  async startStrategy(strategyId, userId) {
    const strategy = await Strategy.findOne({ _id: strategyId, user: userId });

    if (!strategy) {
      throw new Error('Strategy not found');
    }

    if (this.activeStrategies.has(strategyId.toString())) {
      throw new Error('Strategy already running');
    }

    // Bitget 서비스 초기화 (사용자별 API 키 필요)
    const bitgetService = new BitgetService();

    // 전략 타입에 따라 실행
    const executeStrategy = async () => {
      switch (strategy.type) {
        case 'rsi':
          await this.executeRSIStrategy(strategy, bitgetService);
          break;
        case 'macd':
          await this.executeMACDStrategy(strategy, bitgetService);
          break;
        case 'bollinger':
          await this.executeBollingerStrategy(strategy, bitgetService);
          break;
        default:
          console.log('Unknown strategy type');
      }
    };

    // 인터벌 설정에 따라 주기적 실행
    const intervalMs = this.getIntervalMs(strategy.parameters.interval);
    const interval = setInterval(executeStrategy, intervalMs);

    this.intervals.set(strategyId.toString(), interval);
    this.activeStrategies.set(strategyId.toString(), strategy);

    // 즉시 한 번 실행
    executeStrategy();

    strategy.isActive = true;
    await strategy.save();

    return strategy;
  }

  // 전략 중지
  async stopStrategy(strategyId, userId) {
    const strategy = await Strategy.findOne({ _id: strategyId, user: userId });

    if (!strategy) {
      throw new Error('Strategy not found');
    }

    const interval = this.intervals.get(strategyId.toString());

    if (interval) {
      clearInterval(interval);
      this.intervals.delete(strategyId.toString());
      this.activeStrategies.delete(strategyId.toString());
    }

    strategy.isActive = false;
    await strategy.save();

    return strategy;
  }

  // 인터벌 문자열을 밀리초로 변환
  getIntervalMs(interval) {
    const map = {
      '1m': 60 * 1000,
      '5m': 5 * 60 * 1000,
      '15m': 15 * 60 * 1000,
      '30m': 30 * 60 * 1000,
      '1h': 60 * 60 * 1000,
      '4h': 4 * 60 * 60 * 1000,
      '1d': 24 * 60 * 60 * 1000
    };
    return map[interval] || 15 * 60 * 1000;
  }
}

module.exports = new StrategyService();
