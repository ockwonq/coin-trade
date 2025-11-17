const WebSocket = require('ws');
const bitgetConfig = require('../config/bitget');

class WebSocketService {
  constructor() {
    this.ws = null;
    this.subscribers = new Map();
    this.reconnectTimeout = null;
    this.heartbeatInterval = null;
    this.isAuthenticated = false;
  }

  // WebSocket 연결
  connect() {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      console.log('WebSocket already connected');
      return;
    }

    this.ws = new WebSocket(bitgetConfig.wsUrl);

    this.ws.on('open', () => {
      console.log('WebSocket connected to Bitget');
      this.authenticate();
      this.startHeartbeat();
    });

    this.ws.on('message', (data) => {
      this.handleMessage(data);
    });

    this.ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });

    this.ws.on('close', () => {
      console.log('WebSocket disconnected');
      this.stopHeartbeat();
      this.reconnect();
    });
  }

  // 인증
  authenticate() {
    const authMessage = bitgetConfig.getWsAuthMessage();
    this.send(authMessage);
  }

  // 메시지 전송
  send(message) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    }
  }

  // 메시지 처리
  handleMessage(data) {
    try {
      const message = JSON.parse(data);

      // Pong 응답
      if (message.pong) {
        return;
      }

      // 로그인 응답
      if (message.event === 'login') {
        this.isAuthenticated = true;
        console.log('WebSocket authenticated');
        return;
      }

      // 구독 데이터
      if (message.action === 'snapshot' || message.action === 'update') {
        const { arg, data: updateData } = message;
        if (arg && arg.channel) {
          this.notifySubscribers(arg.channel, updateData);
        }
      }
    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
    }
  }

  // Heartbeat
  startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      this.send({ op: 'ping' });
    }, 30000); // 30초마다
  }

  stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  // 재연결
  reconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }

    this.reconnectTimeout = setTimeout(() => {
      console.log('Reconnecting WebSocket...');
      this.connect();
    }, 5000);
  }

  // 채널 구독
  subscribe(channel, instId, callback) {
    const subscriptionKey = `${channel}:${instId}`;

    if (!this.subscribers.has(subscriptionKey)) {
      this.subscribers.set(subscriptionKey, new Set());

      // Bitget에 구독 요청
      this.send({
        op: 'subscribe',
        args: [{
          instType: 'sp',
          channel: channel,
          instId: instId
        }]
      });
    }

    this.subscribers.get(subscriptionKey).add(callback);
  }

  // 구독 취소
  unsubscribe(channel, instId, callback) {
    const subscriptionKey = `${channel}:${instId}`;
    const callbacks = this.subscribers.get(subscriptionKey);

    if (callbacks) {
      callbacks.delete(callback);

      if (callbacks.size === 0) {
        this.subscribers.delete(subscriptionKey);

        // Bitget에 구독 취소 요청
        this.send({
          op: 'unsubscribe',
          args: [{
            instType: 'sp',
            channel: channel,
            instId: instId
          }]
        });
      }
    }
  }

  // 구독자에게 알림
  notifySubscribers(channel, data) {
    this.subscribers.forEach((callbacks, key) => {
      if (key.startsWith(channel)) {
        callbacks.forEach(callback => {
          try {
            callback(data);
          } catch (error) {
            console.error('Error in subscriber callback:', error);
          }
        });
      }
    });
  }

  // 연결 종료
  disconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }

    this.stopHeartbeat();

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }

    this.subscribers.clear();
  }
}

// 싱글톤 인스턴스
const websocketService = new WebSocketService();
module.exports = websocketService;
