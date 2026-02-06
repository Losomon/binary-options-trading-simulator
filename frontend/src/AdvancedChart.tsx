import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import './styles/AdvancedChart.css'

type Props = {
  currentPrice: number
  priceHistory: number[]
}

type TimeFrame = '1m' | '5m' | '15m' | '1h' | '4h' | '1d'
type ChartType = 'line' | 'candle' | 'area'
type Indicator = 'sma' | 'ema' | 'rsi' | 'macd' | 'bollinger'

type CandleData = {
  timestamp: number
  open: number
  high: number
  low: number
  close: number
  volume: number
}

function calculateSMA(data: number[], period = 10) {
  const sma: number[] = []
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      sma.push(Number.NaN)
    } else {
      const sum = data.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0)
      sma.push(sum / period)
    }
  }
  return sma
}

function calculateEMA(data: number[], period = 10) {
  const ema: number[] = []
  const multiplier = 2 / (period + 1)

  let sum = 0
  for (let i = 0; i < period && i < data.length; i++) {
    sum += data[i]
  }
  if (data.length >= period) {
    ema[period - 1] = sum / period
  }

  for (let i = period; i < data.length; i++) {
    const prev = ema[i - 1] ?? data[i - 1]
    ema[i] = (data[i] - prev) * multiplier + prev
  }

  return ema
}

function calculateRSI(data: number[], period = 14) {
  const rsi: number[] = []
  const changes: number[] = []

  for (let i = 1; i < data.length; i++) {
    changes.push(data[i] - data[i - 1])
  }

  for (let i = period; i < changes.length; i++) {
    const window = changes.slice(i - period, i)
    const gains = window.filter((x) => x > 0)
    const losses = window.filter((x) => x < 0).map((x) => Math.abs(x))

    const avgGain = gains.reduce((a, b) => a + b, 0) / period
    const avgLoss = losses.reduce((a, b) => a + b, 0) / period

    const rs = avgGain / (avgLoss || 1)
    rsi.push(100 - 100 / (1 + rs))
  }

  return rsi
}

export default function AdvancedChart({ currentPrice, priceHistory }: Props) {
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('1m')
  const [chartType, setChartType] = useState<ChartType>('line')
  const [activeIndicators, setActiveIndicators] = useState<Indicator[]>(['sma'])
  const [candleData, setCandleData] = useState<CandleData[]>([])

  // Generate candle data from price history
  useEffect(() => {
    if (priceHistory.length <= 0) return

    const candles: CandleData[] = []
    const chunkSize = 5

    for (let i = 0; i < priceHistory.length; i += chunkSize) {
      const chunk = priceHistory.slice(i, i + chunkSize)
      if (!chunk.length) continue

      candles.push({
        timestamp: Date.now() - (priceHistory.length - i) * 1000,
        open: chunk[0],
        high: Math.max(...chunk),
        low: Math.min(...chunk),
        close: chunk[chunk.length - 1],
        volume: Math.random() * 1000 + 500,
      })
    }

    setCandleData(candles.slice(-20))
  }, [priceHistory])

  const smaData = useMemo(() => calculateSMA(priceHistory, 10), [priceHistory])
  const emaData = useMemo(() => calculateEMA(priceHistory, 10), [priceHistory])
  const rsiData = useMemo(() => calculateRSI(priceHistory, 14), [priceHistory])

  const toggleIndicator = (indicator: Indicator) => {
    setActiveIndicators((prev) =>
      prev.includes(indicator) ? prev.filter((i) => i !== indicator) : [...prev, indicator],
    )
  }

  const recent = priceHistory.slice(-50)

  return (
    <motion.div
      className="advanced-chart-container"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
    >
      <div className="chart-controls">
        <div className="control-group">
          <span className="control-label">Timeframe:</span>
          <div>
            {(['1m', '5m', '15m', '1h', '4h', '1d'] as TimeFrame[]).map((tf) => (
              <button
                key={tf}
                type="button"
                className={`timeframe-btn ${timeFrame === tf ? 'active' : ''}`}
                onClick={() => setTimeFrame(tf)}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>

        <div className="control-group">
          <span className="control-label">Type:</span>
          <div>
            {(['line', 'candle', 'area'] as ChartType[]).map((type) => (
              <button
                key={type}
                type="button"
                className={`chart-type-btn ${chartType === type ? 'active' : ''}`}
                onClick={() => setChartType(type)}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="control-group">
          <span className="control-label">Price:</span>
          <span className="price-readout">${currentPrice.toLocaleString('en-US', { maximumFractionDigits: 2 })}</span>
        </div>
      </div>

      <div className="indicator-pills">
        <span className="control-label">Indicators:</span>
        {(['sma', 'ema', 'rsi', 'macd', 'bollinger'] as Indicator[]).map((ind) => (
          <button
            key={ind}
            type="button"
            className={`indicator-pill ${activeIndicators.includes(ind) ? 'active' : ''}`}
            onClick={() => toggleIndicator(ind)}
          >
            {ind.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="chart-wrapper">
        <svg className="chart-svg" viewBox="0 0 800 300" preserveAspectRatio="none">
          <defs>
            <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(0, 255, 255, 0.4)" />
              <stop offset="100%" stopColor="rgba(0, 255, 255, 0)" />
            </linearGradient>

            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background grid */}
          <g opacity="0.1">
            {[0, 1, 2, 3, 4].map((i) => (
              <line
                key={`h-${i}`}
                x1="0"
                y1={i * 75}
                x2="800"
                y2={i * 75}
                stroke="var(--neon-cyan)"
                strokeWidth="1"
              />
            ))}
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
              <line
                key={`v-${i}`}
                x1={i * 100}
                y1="0"
                x2={i * 100}
                y2="300"
                stroke="var(--neon-cyan)"
                strokeWidth="1"
              />
            ))}
          </g>

          {/* Main price chart */}
          {chartType === 'line' && recent.length > 1 ? (
            <polyline
              fill="none"
              stroke="var(--neon-cyan)"
              strokeWidth="3"
              filter="url(#glow)"
              points={recent
                .map((price, i) => {
                  const x = (i / Math.max(1, recent.length - 1)) * 800
                  const y = 300 - ((price - 45000) / 10000) * 300
                  return `${x},${y}`
                })
                .join(' ')}
            />
          ) : null}

          {chartType === 'area' && recent.length > 1 ? (
            <>
              <polygon
                fill="url(#areaGradient)"
                points={`0,300 ${recent
                  .map((price, i) => {
                    const x = (i / Math.max(1, recent.length - 1)) * 800
                    const y = 300 - ((price - 45000) / 10000) * 300
                    return `${x},${y}`
                  })
                  .join(' ')} 800,300`}
              />
              <polyline
                fill="none"
                stroke="var(--neon-cyan)"
                strokeWidth="2"
                points={recent
                  .map((price, i) => {
                    const x = (i / Math.max(1, recent.length - 1)) * 800
                    const y = 300 - ((price - 45000) / 10000) * 300
                    return `${x},${y}`
                  })
                  .join(' ')}
              />
            </>
          ) : null}

          {chartType === 'candle' && candleData.length > 0 ? (
            <g>
              {candleData.map((candle, i) => {
                const denom = Math.max(1, candleData.length - 1)
                const x = (i / denom) * 800
                const isGreen = candle.close >= candle.open
                const color = isGreen ? '#00ff88' : 'var(--neon-pink)'

                const openY = 300 - ((candle.open - 45000) / 10000) * 300
                const closeY = 300 - ((candle.close - 45000) / 10000) * 300
                const highY = 300 - ((candle.high - 45000) / 10000) * 300
                const lowY = 300 - ((candle.low - 45000) / 10000) * 300

                const bodyHeight = Math.abs(closeY - openY)
                const bodyY = Math.min(openY, closeY)

                return (
                  <g key={candle.timestamp} className="candle-stick">
                    {/* Wick */}
                    <line x1={x} y1={highY} x2={x} y2={lowY} stroke={color} strokeWidth="1" />
                    {/* Body */}
                    <rect
                      x={x - 8}
                      y={bodyY}
                      width="16"
                      height={bodyHeight || 1}
                      fill={isGreen ? 'none' : color}
                      stroke={color}
                      strokeWidth="2"
                    />
                  </g>
                )
              })}
            </g>
          ) : null}

          {/* SMA indicator */}
          {activeIndicators.includes('sma') && smaData.length > 1 ? (
            <polyline
              fill="none"
              stroke="#ffaa00"
              strokeWidth="2"
              strokeDasharray="4 2"
              opacity="0.7"
              points={smaData
                .slice(-50)
                .map((price, i) => {
                  if (Number.isNaN(price)) return null
                  const x = (i / 49) * 800
                  const y = 300 - ((price - 45000) / 10000) * 300
                  return `${x},${y}`
                })
                .filter((p): p is string => Boolean(p))
                .join(' ')}
            />
          ) : null}

          {/* EMA indicator */}
          {activeIndicators.includes('ema') && emaData.length > 1 ? (
            <polyline
              fill="none"
              stroke="var(--neon-purple)"
              strokeWidth="2"
              strokeDasharray="4 2"
              opacity="0.7"
              points={emaData
                .slice(-50)
                .map((price, i) => {
                  if (Number.isNaN(price)) return null
                  const x = (i / 49) * 800
                  const y = 300 - ((price - 45000) / 10000) * 300
                  return `${x},${y}`
                })
                .filter((p): p is string => Boolean(p))
                .join(' ')}
            />
          ) : null}
        </svg>

        <div className="price-axis">
          {[55000, 52500, 50000, 47500, 45000].map((price) => (
            <div key={price} className="price-tick">
              ${(price / 1000).toFixed(0)}k
            </div>
          ))}
        </div>
      </div>

      <div className="time-axis">
        {['-50m', '-40m', '-30m', '-20m', '-10m', 'Now'].map((time) => (
          <div key={time} className="time-tick">
            {time}
          </div>
        ))}
      </div>

      {activeIndicators.includes('sma') || activeIndicators.includes('ema') ? (
        <div className="chart-legend">
          <div className="legend-item">
            <div className="legend-color" style={{ background: 'var(--neon-cyan)' }} />
            <span className="legend-label">Price</span>
          </div>
          {activeIndicators.includes('sma') ? (
            <div className="legend-item">
              <div className="legend-color" style={{ background: '#ffaa00' }} />
              <span className="legend-label">SMA (10)</span>
            </div>
          ) : null}
          {activeIndicators.includes('ema') ? (
            <div className="legend-item">
              <div className="legend-color" style={{ background: 'var(--neon-purple)' }} />
              <span className="legend-label">EMA (10)</span>
            </div>
          ) : null}
        </div>
      ) : null}

      {/* RSI Indicator */}
      {activeIndicators.includes('rsi') && rsiData.length > 0 ? (
        <div className="rsi-indicator">
          <div className="rsi-title">RSI (14)</div>
          <div className="rsi-zones">
            <div className="rsi-zone" style={{ top: '0%' }}>
              70
            </div>
            <div className="rsi-zone" style={{ top: '50%' }}>
              50
            </div>
            <div className="rsi-zone" style={{ top: '100%' }}>
              30
            </div>
          </div>
          <svg style={{ width: '100%', height: '100%' }} viewBox="0 0 800 60" preserveAspectRatio="none">
            <rect x="0" y="0" width="800" height="15" fill="rgba(255, 0, 110, 0.1)" />
            <rect x="0" y="45" width="800" height="15" fill="rgba(0, 255, 136, 0.1)" />

            <polyline
              fill="none"
              stroke="var(--neon-purple)"
              strokeWidth="2"
              points={rsiData
                .slice(-50)
                .map((rsi, i) => {
                  const x = (i / 49) * 800
                  const y = 60 - (rsi / 100) * 60
                  return `${x},${y}`
                })
                .join(' ')}
            />
          </svg>
        </div>
      ) : null}
    </motion.div>
  )
}

