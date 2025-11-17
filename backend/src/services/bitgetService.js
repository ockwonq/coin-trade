const axios = require('axios');
const bitgetConfig = require('../config/bitget');

class BitgetService {
  constructor(customApiKey = null, customSecretKey = null, customPassphrase = null) {
    this.apiKey = customApiKey || bitgetConfig.apiKey;
    this.secretKey = customSecretKey || bitgetConfig.secretKey;
    this.passphrase = customPassphrase || bitgetConfig.passphrase;
    this.baseUrl = bitgetConfig.baseUrl;
  }

  // Private API 요청
  async privateRequest(method, endpoint, data = {}) {
    const requestPath = endpoint;
    const body = method === 'GET' ? '' : JSON.stringify(data);

    const headers = bitgetConfig.getHeaders(method, requestPath, body);

    const config = {
      method,
      url: `${this.baseUrl}${endpoint}`,
      headers,
      data: method !== 'GET' ? data : undefined,
      params: method === 'GET' ? data : undefined
    };

    try {
      const response = await axios(config);
      return response.data;
    } catch (error) {
      console.error('Bitget API Error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.msg || 'Bitget API request failed');
    }
  }

  // Public API 요청
  async publicRequest(method, endpoint, params = {}) {
    try {
      const response = await axios({
        method,
        url: `${this.baseUrl}${endpoint}`,
        params: method === 'GET' ? params : undefined,
        data: method !== 'GET' ? params : undefined
      });
      return response.data;
    } catch (error) {
      console.error('Bitget Public API Error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.msg || 'Bitget API request failed');
    }
  }

  // 현재가 조회 (Spot)
  async getSpotTicker(symbol) {
    const response = await this.publicRequest('GET', '/api/spot/v1/market/ticker', { symbol });
    return response;
  }

  // 현재가 조회 (Futures)
  async getFuturesTicker(symbol, productType = 'umcbl') {
    const response = await this.publicRequest('GET', '/api/mix/v1/market/ticker', {
      symbol,
      productType
    });
    return response;
  }

  // K-line/캔들스틱 데이터 조회
  async getKline(symbol, interval = '15m', limit = 100) {
    const response = await this.publicRequest('GET', '/api/spot/v1/market/candles', {
      symbol,
      period: interval,
      limit
    });
    return response;
  }

  // 계정 잔고 조회 (Spot)
  async getSpotBalance() {
    const response = await this.privateRequest('GET', '/api/spot/v1/account/assets');
    return response;
  }

  // 계정 잔고 조회 (Futures)
  async getFuturesBalance(productType = 'umcbl') {
    const response = await this.privateRequest('GET', '/api/mix/v1/account/accounts', {
      productType
    });
    return response;
  }

  // Spot 주문 생성
  async placeSpotOrder(orderData) {
    const {
      symbol,
      side, // 'buy' or 'sell'
      orderType = 'market', // 'limit' or 'market'
      force = 'normal',
      price,
      quantity
    } = orderData;

    const data = {
      symbol,
      side,
      orderType,
      force,
      price: orderType === 'limit' ? price : undefined,
      quantity
    };

    const response = await this.privateRequest('POST', '/api/spot/v1/trade/orders', data);
    return response;
  }

  // Futures 주문 생성
  async placeFuturesOrder(orderData) {
    const {
      symbol,
      productType = 'umcbl',
      marginCoin = 'USDT',
      size,
      side, // 'open_long', 'open_short', 'close_long', 'close_short'
      orderType = 'market',
      price
    } = orderData;

    const data = {
      symbol,
      productType,
      marginCoin,
      size,
      side,
      orderType,
      price: orderType === 'limit' ? price : undefined
    };

    const response = await this.privateRequest('POST', '/api/mix/v1/order/placeOrder', data);
    return response;
  }

  // 주문 취소
  async cancelSpotOrder(symbol, orderId) {
    const response = await this.privateRequest('POST', '/api/spot/v1/trade/cancel-order', {
      symbol,
      orderId
    });
    return response;
  }

  // 주문 내역 조회
  async getSpotOrders(symbol, status = 'all') {
    const response = await this.privateRequest('GET', '/api/spot/v1/trade/orders', {
      symbol,
      status
    });
    return response;
  }

  // 거래 내역 조회
  async getSpotFills(symbol, limit = 100) {
    const response = await this.privateRequest('GET', '/api/spot/v1/trade/fills', {
      symbol,
      limit
    });
    return response;
  }

  // 시장 심도 조회 (Order Book)
  async getOrderBook(symbol, limit = 100) {
    const response = await this.publicRequest('GET', '/api/spot/v1/market/depth', {
      symbol,
      limit,
      type: 'step0'
    });
    return response;
  }

  // 최근 거래 내역
  async getRecentTrades(symbol, limit = 100) {
    const response = await this.publicRequest('GET', '/api/spot/v1/market/fills', {
      symbol,
      limit
    });
    return response;
  }

  // 서버 시간
  async getServerTime() {
    const response = await this.publicRequest('GET', '/api/spot/v1/public/time');
    return response;
  }

  // 거래 가능한 심볼 목록
  async getSymbols() {
    const response = await this.publicRequest('GET', '/api/spot/v1/public/products');
    return response;
  }
}

module.exports = BitgetService;
