const crypto = require('crypto');

class BitgetConfig {
  constructor() {
    this.apiKey = process.env.BITGET_API_KEY;
    this.secretKey = process.env.BITGET_SECRET_KEY;
    this.passphrase = process.env.BITGET_PASSPHRASE;
    this.baseUrl = process.env.BITGET_API_URL || 'https://api.bitget.com';
    this.wsUrl = process.env.BITGET_WS_URL || 'wss://ws.bitget.com/mix/v1/stream';
  }

  // Bitget API 서명 생성
  generateSignature(timestamp, method, requestPath, body = '') {
    const message = timestamp + method.toUpperCase() + requestPath + body;
    return crypto
      .createHmac('sha256', this.secretKey)
      .update(message)
      .digest('base64');
  }

  // API 요청 헤더 생성
  getHeaders(method, requestPath, body = '') {
    const timestamp = Date.now().toString();
    const signature = this.generateSignature(timestamp, method, requestPath, body);

    return {
      'ACCESS-KEY': this.apiKey,
      'ACCESS-SIGN': signature,
      'ACCESS-TIMESTAMP': timestamp,
      'ACCESS-PASSPHRASE': this.passphrase,
      'Content-Type': 'application/json',
      'locale': 'en-US'
    };
  }

  // WebSocket 인증 메시지 생성
  getWsAuthMessage() {
    const timestamp = Date.now().toString();
    const sign = crypto
      .createHmac('sha256', this.secretKey)
      .update(timestamp + 'GET' + '/user/verify')
      .digest('base64');

    return {
      op: 'login',
      args: [{
        apiKey: this.apiKey,
        passphrase: this.passphrase,
        timestamp: timestamp,
        sign: sign
      }]
    };
  }
}

module.exports = new BitgetConfig();
