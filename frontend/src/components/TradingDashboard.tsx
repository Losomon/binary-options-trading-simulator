import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import './TradingDashboard.css'

type TradeDir = 'CALL' | 'PUT'

type Trade = {
  id: string
  dir: TradeDir
  entry: number
  result?: 'WIN' | 'LOSS'
}

function fmt(n: number) {
  return n.toFixed(2)
}

export default function TradingDashboard() {
  const [price, setPrice] = useState(100)
  const [series, setSeries] = useState<number[]>(() => Array.from({ length: 60 }, (_, i) => 100 + Math.sin(i / 5) * 2 + Math.random()))
  const [trades, setTrades] = useState<Trade[]>([])
  const [executing, setExecuting] = useState(false)

  // Simulate price updates
  useEffect(() => {
    const id = setInterval(() => {
      setPrice((p) => {
        const move = (Math.random() - 0.5) * 0.8
        const next = Math.max(0, p + move)
        setSeries((s) => [...s.slice(-59), next])
        return next
      })
    }, 1000)
    return () => clearInterval(id)
  }, [])

  const polyPoints = useMemo(() => {
    if (series.length === 0) return ''
    const w = 600
    const h = 120
    const min = Math.min(...series)
    const max = Math.max(...series)
    return series
      .map((v, i) => {
        const x = (i / (series.length - 1)) * w
        const y = h - ((v - min) / (max - min || 1)) * h
        return `${x},${y}`
      })
      .join(' ')
  }, [series])

  function placeTrade(dir: TradeDir) {
    if (executing) return
    const id = Math.random().toString(36).slice(2, 9)
    const entry = price
    const newTrade: Trade = { id, dir, entry }
    setTrades((t) => [newTrade, ...t].slice(0, 20))
    setExecuting(true)

    // Simulate 3s execution and random result
    setTimeout(() => {
      const pnL = Math.random() > 0.5 ? 'WIN' : 'LOSS'
      setTrades((t) => t.map((tr) => (tr.id === id ? { ...tr, result: pnL } : tr)))
      setExecuting(false)
    }, 3000)
  }

  return (
    <div className="cp-dashboard">
      <header className="cp-header">
        <div className="cp-logo glitch">CYBER OPTIONS</div>
        <div className="cp-sub">Binary Options Simulator</div>
      </header>

      <main className="cp-main">
        <section className="cp-left">
          <div className="cp-chart-card">
            <div className="cp-chart-header">
              <div className="cp-price">{fmt(price)}</div>
              <div className="cp-actions">
                <motion.button
                  className="btn call"
                  whileTap={{ scale: 0.96 }}
                  onClick={() => placeTrade('CALL')}
                  disabled={executing}
                >
                  CALL
                </motion.button>
                <motion.button
                  className="btn put"
                  whileTap={{ scale: 0.96 }}
                  onClick={() => placeTrade('PUT')}
                  disabled={executing}
                >
                  PUT
                </motion.button>
              </div>
            </div>

            <svg className="cp-chart" viewBox="0 0 600 120" preserveAspectRatio="none">
              <defs>
                <linearGradient id="g1" x1="0" x2="1">
                  <stop offset="0%" stopColor="#00ffd5" stopOpacity="0.12" />
                  <stop offset="100%" stopColor="#ff31b8" stopOpacity="0.08" />
                </linearGradient>
              </defs>
              <polyline points={polyPoints} fill="none" stroke="#00ffd5" strokeWidth={1.6} strokeLinejoin="round" strokeLinecap="round" />
              <rect x={0} y={0} width="100%" height="100%" fill="url(#g1)" opacity={0.06} />
            </svg>

            <div className="cp-footer-note">Real-time price feed (simulated)</div>
          </div>
        </section>

        <aside className="cp-right">
          <div className="cp-panel">
            <div className="panel-title">Trade History</div>
            <div className="panel-list">
              {trades.map((t) => (
                <motion.div key={t.id} className={`trade-row ${t.result ? t.result.toLowerCase() : ''}`} layout initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}>
                  <div className="trade-dir">{t.dir}</div>
                  <div className="trade-entry">{fmt(t.entry)}</div>
                  <div className="trade-result">{t.result ?? '...'}</div>
                </motion.div>
              ))}
              {trades.length === 0 && <div className="empty">No trades yet — try CALL or PUT</div>}
            </div>
          </div>

          <div className="cp-panel small">
            <div className="panel-title">Quick Stats</div>
            <div className="stats">
              <div>Open: <strong>{trades.filter((t) => !t.result).length}</strong></div>
              <div>Recent Wins: <strong>{trades.filter((t) => t.result === 'WIN').length}</strong></div>
              <div>Recent Losses: <strong>{trades.filter((t) => t.result === 'LOSS').length}</strong></div>
            </div>
          </div>
        </aside>
      </main>
    </div>
  )
}