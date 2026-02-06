import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import './styles/TradingDashboard.css'

type Trade = {
  id: string
  amount: number
  direction: 'call' | 'put'
  timestamp: Date
  result?: 'win' | 'loss'
  profit?: number
}

export default function TradingDashboard() {
  const [balance, setBalance] = useState(10000)
  const [tradeAmount, setTradeAmount] = useState(100)
  const [direction, setDirection] = useState<'call' | 'put'>('call')
  const [activeTab, setActiveTab] = useState<'trade' | 'history'>('trade')
  const [trades, setTrades] = useState<Trade[]>([])
  const [isTrading, setIsTrading] = useState(false)
  const [currentPrice, setCurrentPrice] = useState(50000)
  const [priceHistory, setPriceHistory] = useState<number[]>([])

  // Keep latest price available inside timeouts.
  const currentPriceRef = useRef(currentPrice)
  useEffect(() => {
    currentPriceRef.current = currentPrice
  }, [currentPrice])

  // Simulate price fluctuation
  useEffect(() => {
    const interval = window.setInterval(() => {
      setCurrentPrice((prev) => {
        const change = (Math.random() - 0.5) * 200
        const newPrice = Math.max(45000, Math.min(55000, prev + change))
        setPriceHistory((prevHist) => [...prevHist.slice(-50), newPrice])
        return newPrice
      })
    }, 1000)

    return () => window.clearInterval(interval)
  }, [])

  const executeTrade = () => {
    if (tradeAmount > balance || tradeAmount <= 0) return

    setIsTrading(true)
    const startPrice = currentPriceRef.current

    // Simulate 60-second trade (shortened for demo)
    window.setTimeout(() => {
      const endPrice = currentPriceRef.current
      const won = direction === 'call' ? endPrice > startPrice : endPrice < startPrice
      const profit = won ? tradeAmount * 0.85 : -tradeAmount

      const newTrade: Trade = {
        id: Date.now().toString(),
        amount: tradeAmount,
        direction,
        timestamp: new Date(),
        result: won ? 'win' : 'loss',
        profit,
      }

      setTrades((prev) => [newTrade, ...prev])
      setBalance((prev) => prev + profit)
      setIsTrading(false)
    }, 3000)
  }

  return (
    <div className="trading-dashboard">
      <div className="dashboard-content">
        <motion.div
          className="header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="logo">BINARY_ZERO</div>
          <div className="balance-display">
            <div className="balance-label">Portfolio Balance</div>
            <div className="balance-amount">
              $
              {balance.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
          </div>
        </motion.div>

        <div className="main-grid">
          {/* Price Chart Card */}
          <motion.div
            className="card"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h2 className="card-title">Market Price</h2>
            <div className="price-display">
              <div className="current-price">${currentPrice.toLocaleString('en-US', { maximumFractionDigits: 0 })}</div>
              <div className="price-label">BTC/USD</div>
            </div>
            <div className="chart-container">
              <svg className="price-line" viewBox="0 0 500 200" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="rgba(0, 255, 255, 0.5)" />
                    <stop offset="100%" stopColor="rgba(0, 255, 255, 0)" />
                  </linearGradient>
                </defs>
                {priceHistory.length > 1 ? (
                  <>
                    <polyline
                      fill="none"
                      stroke="var(--neon-cyan)"
                      strokeWidth="2"
                      points={priceHistory
                        .map((price, i) => {
                          const x = (i / (priceHistory.length - 1)) * 500
                          const y = 200 - ((price - 45000) / 10000) * 200
                          return `${x},${y}`
                        })
                        .join(' ')}
                    />
                    <polygon
                      fill="url(#gradient)"
                      points={`0,200 ${priceHistory
                        .map((price, i) => {
                          const x = (i / (priceHistory.length - 1)) * 500
                          const y = 200 - ((price - 45000) / 10000) * 200
                          return `${x},${y}`
                        })
                        .join(' ')} 500,200`}
                    />
                  </>
                ) : null}
              </svg>
            </div>
          </motion.div>

          {/* Trading Controls / History Card */}
          <motion.div
            className="card"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="tab-selector" role="tablist" aria-label="Trading tabs">
              <button
                type="button"
                className={`tab-btn ${activeTab === 'trade' ? 'active' : ''}`}
                onClick={() => setActiveTab('trade')}
                disabled={isTrading}
              >
                Trade
              </button>
              <button
                type="button"
                className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
                onClick={() => setActiveTab('history')}
              >
                History
              </button>
            </div>

            {activeTab === 'trade' ? (
              <>
                <h2 className="card-title">Execute Trade</h2>
                <div className="trading-controls">
                  <div className="input-group">
                    <label className="input-label" htmlFor="tradeAmount">
                      Trade Amount ($)
                    </label>
                    <input
                      id="tradeAmount"
                      type="number"
                      className="input-field"
                      value={tradeAmount}
                      onChange={(e) => setTradeAmount(Number(e.target.value))}
                      min={1}
                      max={balance}
                      disabled={isTrading}
                    />
                  </div>

                  <div className="input-group">
                    <div className="input-label">Direction</div>
                    <div className="direction-selector">
                      <button
                        type="button"
                        className={`direction-btn call ${direction === 'call' ? 'active' : ''}`}
                        onClick={() => setDirection('call')}
                        disabled={isTrading}
                      >
                        ↑ Call
                      </button>
                      <button
                        type="button"
                        className={`direction-btn put ${direction === 'put' ? 'active' : ''}`}
                        onClick={() => setDirection('put')}
                        disabled={isTrading}
                      >
                        ↓ Put
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    className={`execute-btn ${isTrading ? 'trading' : ''}`}
                    onClick={executeTrade}
                    disabled={isTrading || tradeAmount > balance || tradeAmount <= 0}
                  >
                    {isTrading ? 'TRADING...' : 'EXECUTE'}
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="card-title">Trade History</h2>
                <div className="history-container">
                  <AnimatePresence initial={false}>
                    {trades.length === 0 ? (
                      <div className="empty-state">No trades executed yet. Start trading to see your history.</div>
                    ) : (
                      trades.map((trade) => (
                        <motion.div
                          key={trade.id}
                          className={`trade-item ${trade.result ?? ''}`}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                        >
                          <div className="trade-details">
                            <span className={`trade-direction ${trade.direction}`}>
                              {trade.direction === 'call' ? '↑' : '↓'} {trade.direction.toUpperCase()}
                            </span>
                            <span className="trade-amount">
                              ${trade.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </span>
                            <span className="trade-amount">{trade.timestamp.toLocaleTimeString()}</span>
                          </div>
                          <div className={`trade-profit ${(trade.profit ?? 0) >= 0 ? 'positive' : 'negative'}`}>
                            {(trade.profit ?? 0) >= 0 ? '+' : ''}$
                            {Math.abs(trade.profit ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </div>
                        </motion.div>
                      ))
                    )}
                  </AnimatePresence>
                </div>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
