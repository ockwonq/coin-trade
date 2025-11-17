import { useState, useEffect } from 'react'
import api from '../services/api'
import { TrendingUp, TrendingDown } from 'lucide-react'

const History = () => {
  const [orders, setOrders] = useState([])
  const [statistics, setStatistics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchData()
  }, [filter])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [ordersRes, statsRes] = await Promise.all([
        api.get('/trade/orders', {
          params: { status: filter === 'all' ? undefined : filter }
        }),
        api.get('/trade/statistics')
      ])

      setOrders(ordersRes.data.data)
      setStatistics(statsRes.data.data)
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
    }
  }

  const statusColors = {
    pending: 'bg-yellow-500/10 text-yellow-500',
    filled: 'bg-green-500/10 text-green-500',
    partially_filled: 'bg-blue-500/10 text-blue-500',
    cancelled: 'bg-gray-500/10 text-gray-500',
    failed: 'bg-red-500/10 text-red-500'
  }

  const statusLabels = {
    pending: '대기 중',
    filled: '체결됨',
    partially_filled: '부분 체결',
    cancelled: '취소됨',
    failed: '실패'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-400">로딩 중...</div>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-white">거래 히스토리</h1>

      {/* Statistics */}
      {statistics && (
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          <div className="bg-slate-800 rounded-lg p-4 sm:p-6 border border-slate-700">
            <p className="text-slate-400 text-xs sm:text-sm">총 거래</p>
            <p className="text-xl sm:text-2xl font-bold text-white mt-1 sm:mt-2">
              {statistics.totalTrades}
            </p>
          </div>
          <div className="bg-slate-800 rounded-lg p-4 sm:p-6 border border-slate-700">
            <p className="text-slate-400 text-xs sm:text-sm">승률</p>
            <p className="text-xl sm:text-2xl font-bold text-white mt-1 sm:mt-2">
              {statistics.winRate}%
            </p>
          </div>
          <div className="bg-slate-800 rounded-lg p-4 sm:p-6 border border-slate-700">
            <p className="text-slate-400 text-xs sm:text-sm">총 수익</p>
            <p className={`text-xl sm:text-2xl font-bold mt-1 sm:mt-2 ${
              statistics.totalProfit >= 0 ? 'text-green-500' : 'text-red-500'
            }`}>
              ${statistics.totalProfit.toFixed(2)}
            </p>
          </div>
          <div className="bg-slate-800 rounded-lg p-4 sm:p-6 border border-slate-700">
            <p className="text-slate-400 text-xs sm:text-sm">총 수수료</p>
            <p className="text-xl sm:text-2xl font-bold text-white mt-1 sm:mt-2">
              ${statistics.totalFees.toFixed(2)}
            </p>
          </div>
        </div>
      )}

      {/* Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {['all', 'pending', 'filled', 'cancelled'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2.5 rounded-lg font-semibold transition whitespace-nowrap min-h-[44px] ${
              filter === status
                ? 'bg-primary-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700 active:bg-slate-600'
            }`}
          >
            {status === 'all' ? '전체' : statusLabels[status]}
          </button>
        ))}
      </div>

      {/* Orders - Desktop Table */}
      <div className="hidden md:block bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  시간
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  심볼
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  유형
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  매수/매도
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  가격
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  수량
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  상태
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-slate-700/50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                    {new Date(order.createdAt).toLocaleString('ko-KR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                    {order.symbol}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                    {order.orderType === 'market' ? '시장가' : '지정가'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={order.side === 'buy' ? 'text-green-500' : 'text-red-500'}>
                      {order.side === 'buy' ? '매수' : '매도'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                    ${order.price ? order.price.toFixed(2) : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                    {order.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${statusColors[order.status]}`}>
                      {statusLabels[order.status]}
                    </span>
                  </td>
                </tr>
              ))}

              {orders.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-slate-400">
                    거래 내역이 없습니다
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Orders - Mobile Cards */}
      <div className="md:hidden space-y-3">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-slate-800 rounded-lg p-4 border border-slate-700"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-white font-semibold">{order.symbol}</h3>
                <p className="text-xs text-slate-400 mt-1">
                  {new Date(order.createdAt).toLocaleString('ko-KR', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              <span className={`px-2 py-1 rounded text-xs font-semibold ${statusColors[order.status]}`}>
                {statusLabels[order.status]}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-slate-400 text-xs">유형</p>
                <p className="text-white mt-0.5">
                  {order.orderType === 'market' ? '시장가' : '지정가'}
                </p>
              </div>
              <div>
                <p className="text-slate-400 text-xs">매수/매도</p>
                <p className={`mt-0.5 font-medium ${order.side === 'buy' ? 'text-green-500' : 'text-red-500'}`}>
                  {order.side === 'buy' ? '매수' : '매도'}
                </p>
              </div>
              <div>
                <p className="text-slate-400 text-xs">가격</p>
                <p className="text-white mt-0.5">
                  ${order.price ? order.price.toFixed(2) : '-'}
                </p>
              </div>
              <div>
                <p className="text-slate-400 text-xs">수량</p>
                <p className="text-white mt-0.5">{order.quantity}</p>
              </div>
            </div>
          </div>
        ))}

        {orders.length === 0 && (
          <div className="bg-slate-800 rounded-lg p-8 border border-slate-700 text-center text-slate-400">
            거래 내역이 없습니다
          </div>
        )}
      </div>
    </div>
  )
}

export default History
