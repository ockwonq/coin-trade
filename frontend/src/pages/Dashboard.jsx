import { useState, useEffect } from 'react'
import api from '../services/api'
import { TrendingUp, TrendingDown, Wallet, DollarSign } from 'lucide-react'

const Dashboard = () => {
  const [balance, setBalance] = useState(null)
  const [ticker, setTicker] = useState(null)
  const [loading, setLoading] = useState(true)
  const [symbol, setSymbol] = useState('BTCUSDT')

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 10000) // 10초마다 갱신
    return () => clearInterval(interval)
  }, [symbol])

  const fetchData = async () => {
    try {
      const [balanceRes, tickerRes] = await Promise.all([
        api.get('/account/balance').catch(() => ({ data: { data: null } })),
        api.get(`/market/ticker/${symbol}`)
      ])

      setBalance(balanceRes.data.data)
      setTicker(tickerRes.data.data)
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
    }
  }

  const StatCard = ({ title, value, icon: Icon, change, positive }) => (
    <div className="bg-slate-800 rounded-lg p-4 sm:p-6 border border-slate-700">
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-slate-400 text-xs sm:text-sm truncate">{title}</p>
          <p className="text-xl sm:text-2xl font-bold text-white mt-1 sm:mt-2">{value}</p>
          {change && (
            <div className={`flex items-center mt-1 sm:mt-2 ${positive ? 'text-green-500' : 'text-red-500'}`}>
              {positive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              <span className="ml-1 text-xs sm:text-sm">{change}%</span>
            </div>
          )}
        </div>
        <div className={`p-2 sm:p-3 rounded-full ${positive ? 'bg-green-500/10' : 'bg-primary-500/10'} flex-shrink-0`}>
          <Icon className={positive ? 'text-green-500' : 'text-primary-400'} size={20} />
        </div>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-400">로딩 중...</div>
      </div>
    )
  }

  const price = ticker?.data?.close || '0'
  const priceChange = ticker?.data?.changeUtc || '0'
  const isPositive = parseFloat(priceChange) >= 0

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">대시보드</h1>
        <select
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          className="px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 text-base"
        >
          <option value="BTCUSDT">BTC/USDT</option>
          <option value="ETHUSDT">ETH/USDT</option>
          <option value="BNBUSDT">BNB/USDT</option>
          <option value="SOLUSDT">SOL/USDT</option>
        </select>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title={`${symbol.replace('USDT', '')} 가격`}
          value={`$${parseFloat(price).toFixed(2)}`}
          icon={DollarSign}
          change={parseFloat(priceChange).toFixed(2)}
          positive={isPositive}
        />
        <StatCard
          title="총 자산"
          value="$0.00"
          icon={Wallet}
        />
        <StatCard
          title="오늘 수익"
          value="$0.00"
          icon={TrendingUp}
          change="0.00"
          positive={true}
        />
        <StatCard
          title="총 수익"
          value="$0.00"
          icon={TrendingUp}
          change="0.00"
          positive={true}
        />
      </div>

      {/* Market Info */}
      <div className="bg-slate-800 rounded-lg p-4 sm:p-6 border border-slate-700">
        <h2 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">{symbol} 시장 정보</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <div>
            <p className="text-slate-400 text-xs sm:text-sm">24h 고가</p>
            <p className="text-white font-semibold mt-1 text-sm sm:text-base">
              ${parseFloat(ticker?.data?.high24h || 0).toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-slate-400 text-xs sm:text-sm">24h 저가</p>
            <p className="text-white font-semibold mt-1 text-sm sm:text-base">
              ${parseFloat(ticker?.data?.low24h || 0).toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-slate-400 text-xs sm:text-sm">24h 거래량</p>
            <p className="text-white font-semibold mt-1 text-sm sm:text-base">
              {parseFloat(ticker?.data?.baseVol || 0).toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-slate-400 text-xs sm:text-sm">24h 변동률</p>
            <p className={`font-semibold mt-1 text-sm sm:text-base ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
              {priceChange}%
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-slate-800 rounded-lg p-4 sm:p-6 border border-slate-700">
        <h2 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">빠른 실행</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <button className="px-4 py-3 sm:py-3 bg-green-600 hover:bg-green-700 active:bg-green-800 rounded-lg text-white font-semibold transition text-sm sm:text-base min-h-[44px]">
            매수
          </button>
          <button className="px-4 py-3 sm:py-3 bg-red-600 hover:bg-red-700 active:bg-red-800 rounded-lg text-white font-semibold transition text-sm sm:text-base min-h-[44px]">
            매도
          </button>
          <button className="px-4 py-3 sm:py-3 bg-primary-600 hover:bg-primary-700 active:bg-primary-800 rounded-lg text-white font-semibold transition text-sm sm:text-base min-h-[44px]">
            자동매매 설정
          </button>
          <button className="px-4 py-3 sm:py-3 bg-slate-700 hover:bg-slate-600 active:bg-slate-500 rounded-lg text-white font-semibold transition text-sm sm:text-base min-h-[44px]">
            히스토리 보기
          </button>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
