import { useState, useEffect } from 'react'
import api from '../services/api'
import { TrendingUp, TrendingDown } from 'lucide-react'

const Trade = () => {
  const [symbol, setSymbol] = useState('BTCUSDT')
  const [ticker, setTicker] = useState(null)
  const [orderType, setOrderType] = useState('market')
  const [side, setSide] = useState('buy')
  const [quantity, setQuantity] = useState('')
  const [price, setPrice] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  useEffect(() => {
    fetchTicker()
    const interval = setInterval(fetchTicker, 5000)
    return () => clearInterval(interval)
  }, [symbol])

  const fetchTicker = async () => {
    try {
      const response = await api.get(`/market/ticker/${symbol}`)
      setTicker(response.data.data)
      if (orderType === 'market' && response.data.data?.data?.close) {
        setPrice(response.data.data.data.close)
      }
    } catch (error) {
      console.error('Failed to fetch ticker:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ type: '', text: '' })

    try {
      const orderData = {
        symbol,
        side,
        orderType,
        quantity: parseFloat(quantity),
        price: orderType === 'limit' ? parseFloat(price) : undefined
      }

      await api.post('/trade/spot/order', orderData)

      setMessage({
        type: 'success',
        text: `${side === 'buy' ? '매수' : '매도'} 주문이 성공적으로 처리되었습니다!`
      })

      setQuantity('')
      setPrice('')
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.error || '주문 처리 중 오류가 발생했습니다'
      })
    } finally {
      setLoading(false)
    }
  }

  const currentPrice = ticker?.data?.close || '0'
  const priceChange = ticker?.data?.changeUtc || '0'
  const isPositive = parseFloat(priceChange) >= 0

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">거래</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Market Info */}
        <div className="lg:col-span-2 bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-6">
            <select
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="BTCUSDT">BTC/USDT</option>
              <option value="ETHUSDT">ETH/USDT</option>
              <option value="BNBUSDT">BNB/USDT</option>
              <option value="SOLUSDT">SOL/USDT</option>
            </select>
          </div>

          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">
                ${parseFloat(currentPrice).toFixed(2)}
              </h2>
              <div className={`flex items-center ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                {isPositive ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                <span className="ml-2">{priceChange}%</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-700">
              <div>
                <p className="text-slate-400 text-sm">24h 고가</p>
                <p className="text-white font-semibold mt-1">
                  ${parseFloat(ticker?.data?.high24h || 0).toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">24h 저가</p>
                <p className="text-white font-semibold mt-1">
                  ${parseFloat(ticker?.data?.low24h || 0).toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">24h 거래량</p>
                <p className="text-white font-semibold mt-1">
                  {parseFloat(ticker?.data?.baseVol || 0).toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">24h 거래대금</p>
                <p className="text-white font-semibold mt-1">
                  ${parseFloat(ticker?.data?.quoteVol || 0).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Trade Form */}
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h2 className="text-xl font-bold text-white mb-4">주문하기</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Buy/Sell Tabs */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setSide('buy')}
                className={`py-2 rounded-lg font-semibold transition ${
                  side === 'buy'
                    ? 'bg-green-600 text-white'
                    : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                }`}
              >
                매수
              </button>
              <button
                type="button"
                onClick={() => setSide('sell')}
                className={`py-2 rounded-lg font-semibold transition ${
                  side === 'sell'
                    ? 'bg-red-600 text-white'
                    : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                }`}
              >
                매도
              </button>
            </div>

            {/* Order Type */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                주문 유형
              </label>
              <select
                value={orderType}
                onChange={(e) => setOrderType(e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="market">시장가</option>
                <option value="limit">지정가</option>
              </select>
            </div>

            {/* Price (for limit orders) */}
            {orderType === 'limit' && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  가격 (USDT)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="가격 입력"
                  required
                />
              </div>
            )}

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                수량
              </label>
              <input
                type="number"
                step="0.00000001"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="수량 입력"
                required
              />
            </div>

            {/* Total */}
            <div className="pt-4 border-t border-slate-700">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">총액</span>
                <span className="text-white font-semibold">
                  {quantity && (orderType === 'limit' ? price : currentPrice)
                    ? `$${(parseFloat(quantity) * parseFloat(orderType === 'limit' ? price : currentPrice)).toFixed(2)}`
                    : '$0.00'}
                </span>
              </div>
            </div>

            {message.text && (
              <div className={`p-3 rounded-lg ${
                message.type === 'success'
                  ? 'bg-green-500/10 border border-green-500 text-green-500'
                  : 'bg-red-500/10 border border-red-500 text-red-500'
              }`}>
                {message.text}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg font-semibold transition ${
                side === 'buy'
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-red-600 hover:bg-red-700 text-white'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {loading
                ? '처리 중...'
                : `${side === 'buy' ? '매수' : '매도'} 주문`}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Trade
