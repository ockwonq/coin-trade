import { useState, useEffect } from 'react'
import api from '../services/api'
import { Plus, Play, Square, Trash2 } from 'lucide-react'

const Strategy = () => {
  const [strategies, setStrategies] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    symbol: 'BTCUSDT',
    type: 'rsi',
    parameters: {
      interval: '15m',
      maxInvestment: 100,
      stopLoss: 5,
      takeProfit: 10,
      rsiPeriod: 14,
      rsiOverbought: 70,
      rsiOversold: 30
    }
  })

  useEffect(() => {
    fetchStrategies()
  }, [])

  const fetchStrategies = async () => {
    try {
      const response = await api.get('/strategy')
      setStrategies(response.data.data)
    } catch (error) {
      console.error('Failed to fetch strategies:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await api.post('/strategy', formData)
      setShowModal(false)
      fetchStrategies()
      resetForm()
    } catch (error) {
      console.error('Failed to create strategy:', error)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      symbol: 'BTCUSDT',
      type: 'rsi',
      parameters: {
        interval: '15m',
        maxInvestment: 100,
        stopLoss: 5,
        takeProfit: 10,
        rsiPeriod: 14,
        rsiOverbought: 70,
        rsiOversold: 30
      }
    })
  }

  const toggleStrategy = async (strategyId, isActive) => {
    try {
      if (isActive) {
        await api.post(`/strategy/${strategyId}/stop`)
      } else {
        await api.post(`/strategy/${strategyId}/start`)
      }
      fetchStrategies()
    } catch (error) {
      console.error('Failed to toggle strategy:', error)
    }
  }

  const deleteStrategy = async (strategyId) => {
    if (!confirm('정말로 이 전략을 삭제하시겠습니까?')) return

    try {
      await api.delete(`/strategy/${strategyId}`)
      fetchStrategies()
    } catch (error) {
      console.error('Failed to delete strategy:', error)
    }
  }

  const strategyTypeLabels = {
    rsi: 'RSI',
    macd: 'MACD',
    bollinger: 'Bollinger Bands',
    custom: '커스텀'
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">자동매매 전략</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 active:bg-primary-800 rounded-lg text-white font-semibold transition min-h-[44px]"
        >
          <Plus size={20} />
          <span>새 전략 만들기</span>
        </button>
      </div>

      {/* Strategies List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {strategies.map((strategy) => (
          <div
            key={strategy._id}
            className="bg-slate-800 rounded-lg p-4 sm:p-6 border border-slate-700"
          >
            <div className="flex justify-between items-start mb-3 sm:mb-4">
              <div className="flex-1 min-w-0">
                <h3 className="text-base sm:text-lg font-bold text-white truncate">{strategy.name}</h3>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  {strategyTypeLabels[strategy.type]}
                </p>
              </div>
              <span
                className={`px-2 py-1 rounded text-xs font-semibold whitespace-nowrap ml-2 ${
                  strategy.isActive
                    ? 'bg-green-500/10 text-green-500'
                    : 'bg-slate-700 text-slate-400'
                }`}
              >
                {strategy.isActive ? '실행 중' : '중지됨'}
              </span>
            </div>

            <p className="text-slate-300 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">{strategy.description}</p>

            <div className="space-y-2 mb-3 sm:mb-4">
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-slate-400">심볼</span>
                <span className="text-white">{strategy.symbol}</span>
              </div>
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-slate-400">총 거래</span>
                <span className="text-white">{strategy.statistics.totalTrades}</span>
              </div>
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-slate-400">승률</span>
                <span className="text-white">{strategy.statistics.winRate.toFixed(2)}%</span>
              </div>
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-slate-400">총 수익</span>
                <span className={strategy.statistics.totalProfit >= 0 ? 'text-green-500' : 'text-red-500'}>
                  ${strategy.statistics.totalProfit.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => toggleStrategy(strategy._id, strategy.isActive)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-semibold transition min-h-[44px] text-sm sm:text-base ${
                  strategy.isActive
                    ? 'bg-red-600 hover:bg-red-700 active:bg-red-800 text-white'
                    : 'bg-green-600 hover:bg-green-700 active:bg-green-800 text-white'
                }`}
              >
                {strategy.isActive ? (
                  <>
                    <Square size={16} />
                    중지
                  </>
                ) : (
                  <>
                    <Play size={16} />
                    시작
                  </>
                )}
              </button>
              <button
                onClick={() => deleteStrategy(strategy._id)}
                disabled={strategy.isActive}
                className="px-3 sm:px-4 py-2.5 bg-slate-700 hover:bg-slate-600 active:bg-slate-500 rounded-lg text-white transition disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}

        {strategies.length === 0 && (
          <div className="col-span-full text-center py-12 text-slate-400">
            아직 생성된 전략이 없습니다. 새 전략을 만들어보세요!
          </div>
        )}
      </div>

      {/* Create Strategy Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-slate-800 rounded-lg p-4 sm:p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto my-8">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">새 전략 만들기</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  전략 이름
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 text-base min-h-[44px]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  설명
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 text-base"
                  rows="3"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    심볼
                  </label>
                  <select
                    value={formData.symbol}
                    onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 text-base min-h-[44px]"
                  >
                    <option value="BTCUSDT">BTC/USDT</option>
                    <option value="ETHUSDT">ETH/USDT</option>
                    <option value="BNBUSDT">BNB/USDT</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    전략 유형
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 text-base min-h-[44px]"
                  >
                    <option value="rsi">RSI</option>
                    <option value="macd">MACD</option>
                    <option value="bollinger">Bollinger Bands</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    인터벌
                  </label>
                  <select
                    value={formData.parameters.interval}
                    onChange={(e) => setFormData({
                      ...formData,
                      parameters: { ...formData.parameters, interval: e.target.value }
                    })}
                    className="w-full px-3 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 text-base min-h-[44px]"
                  >
                    <option value="1m">1분</option>
                    <option value="5m">5분</option>
                    <option value="15m">15분</option>
                    <option value="30m">30분</option>
                    <option value="1h">1시간</option>
                    <option value="4h">4시간</option>
                    <option value="1d">1일</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    최대 투자금 (USDT)
                  </label>
                  <input
                    type="number"
                    value={formData.parameters.maxInvestment}
                    onChange={(e) => setFormData({
                      ...formData,
                      parameters: { ...formData.parameters, maxInvestment: parseFloat(e.target.value) }
                    })}
                    className="w-full px-3 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 text-base min-h-[44px]"
                    required
                  />
                </div>
              </div>

              {formData.type === 'rsi' && (
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      RSI 기간
                    </label>
                    <input
                      type="number"
                      value={formData.parameters.rsiPeriod}
                      onChange={(e) => setFormData({
                        ...formData,
                        parameters: { ...formData.parameters, rsiPeriod: parseInt(e.target.value) }
                      })}
                      className="w-full px-3 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 text-base min-h-[44px]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      과매수 (%)
                    </label>
                    <input
                      type="number"
                      value={formData.parameters.rsiOverbought}
                      onChange={(e) => setFormData({
                        ...formData,
                        parameters: { ...formData.parameters, rsiOverbought: parseInt(e.target.value) }
                      })}
                      className="w-full px-3 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 text-base min-h-[44px]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      과매도 (%)
                    </label>
                    <input
                      type="number"
                      value={formData.parameters.rsiOversold}
                      onChange={(e) => setFormData({
                        ...formData,
                        parameters: { ...formData.parameters, rsiOversold: parseInt(e.target.value) }
                      })}
                      className="w-full px-3 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 text-base min-h-[44px]"
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-3 sm:gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 sm:py-2 bg-slate-700 hover:bg-slate-600 active:bg-slate-500 rounded-lg text-white font-semibold transition min-h-[44px]"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2.5 sm:py-2 bg-primary-600 hover:bg-primary-700 active:bg-primary-800 rounded-lg text-white font-semibold transition disabled:opacity-50 min-h-[44px]"
                >
                  {loading ? '생성 중...' : '전략 생성'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Strategy
