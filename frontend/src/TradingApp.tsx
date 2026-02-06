import React, { useEffect, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import TradingDashboard from './TradingDashboard'
import SettingsPanel from './SettingsPanel'
import UserProfile, { type UserData } from './UserProfile'
import AdvancedChart from './AdvancedChart'
import NotificationSystem, { useNotifications } from './NotificationSystem'

// Main integrated app component
export const TradingApp: React.FC = () => {
  const [showSettings, setShowSettings] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [currentPrice, setCurrentPrice] = useState(50000)
  const [priceHistory, setPriceHistory] = useState<number[]>([])
  const { notifications, addNotification, dismissNotification } = useNotifications()

  // Mock user data
  const [userData] = useState<UserData>({
    username: 'TraderPro',
    email: 'trader@example.com',
    memberSince: new Date(2024, 0, 1),
    totalTrades: 247,
    winRate: 64.5,
    totalProfit: 12450,
    currentStreak: 7,
    bestStreak: 15,
    tradingLevel: 12,
    experience: 7500,
    nextLevelXP: 10000,
    achievements: [
      {
        id: '1',
        title: 'First Trade',
        description: 'Execute your first binary option',
        icon: '🎯',
        unlocked: true,
        unlockedAt: new Date(2024, 0, 1),
      },
      {
        id: '2',
        title: 'Hot Streak',
        description: 'Win 5 trades in a row',
        icon: '🔥',
        unlocked: true,
        unlockedAt: new Date(2024, 0, 15),
      },
      {
        id: '3',
        title: 'High Roller',
        description: 'Trade with $1000+',
        icon: '💎',
        unlocked: true,
        unlockedAt: new Date(2024, 1, 1),
      },
      {
        id: '4',
        title: 'Perfect Week',
        description: 'Win all trades in a week',
        icon: '👑',
        unlocked: false,
      },
      {
        id: '5',
        title: 'Market Master',
        description: 'Reach 100 total trades',
        icon: '🏆',
        unlocked: true,
        unlockedAt: new Date(2024, 1, 20),
      },
      {
        id: '6',
        title: 'Profit King',
        description: 'Earn $10,000 profit',
        icon: '💰',
        unlocked: true,
        unlockedAt: new Date(2024, 2, 1),
      },
      {
        id: '7',
        title: 'Night Owl',
        description: 'Trade at 3 AM',
        icon: '🦉',
        unlocked: false,
      },
      {
        id: '8',
        title: 'Risk Taker',
        description: 'Win a trade with max bet',
        icon: '⚡',
        unlocked: false,
      },
    ],
  })

  // Simulate price changes
  useEffect(() => {
    const interval = window.setInterval(() => {
      setCurrentPrice((prev) => {
        const change = (Math.random() - 0.5) * 200
        const newPrice = Math.max(45000, Math.min(55000, prev + change))
        setPriceHistory((prevHistory) => [...prevHistory.slice(-100), newPrice])
        return newPrice
      })
    }, 1000)

    return () => window.clearInterval(interval)
  }, [])

  // Demo notifications
  useEffect(() => {
    const demoTimer = window.setTimeout(() => {
      addNotification('info', 'Welcome to Binary Trading', 'Start trading to see real-time updates and notifications', {
        duration: 8000,
      })
    }, 2000)

    return () => window.clearTimeout(demoTimer)
  }, [addNotification])

  return (
    <>
      <style>{`
        :root {
          --text-primary: rgba(255, 255, 255, 0.92);
          --text-secondary: rgba(255, 255, 255, 0.65);
          --border-color: rgba(255, 255, 255, 0.12);

          --neon-cyan: #00ffff;
          --neon-pink: #ff2bd6;
          --neon-purple: #7c3aed;
        }

        .app-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #0a0a0f 0%, #1a0a1f 100%);
          color: var(--text-primary);
          font-family: 'Rajdhani', 'Inter', system-ui, sans-serif;
          position: relative;
        }

        .top-nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 70px;
          background: rgba(18, 18, 26, 0.9);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--border-color);
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 2rem;
        }

        .nav-logo {
          font-family: 'Orbitron', 'JetBrains Mono', monospace;
          font-size: 1.5rem;
          font-weight: 900;
          letter-spacing: 2px;
          background: linear-gradient(135deg, var(--neon-cyan), var(--neon-pink));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .nav-actions {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .nav-btn {
          padding: 0.6rem 1.2rem;
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid var(--border-color);
          color: var(--text-primary);
          font-family: 'Rajdhani', 'Inter', system-ui, sans-serif;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          border-radius: 8px;
          transition: all 0.3s ease;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .nav-btn:hover {
          border-color: var(--neon-cyan);
          background: rgba(0, 255, 255, 0.1);
          transform: translateY(-2px);
        }

        .nav-btn.profile {
          background: linear-gradient(135deg, var(--neon-cyan), var(--neon-purple));
          border: none;
          color: white;
        }

        .main-content {
          padding-top: 90px;
          padding-bottom: 2rem;
        }

        .layout-grid {
          max-width: 1600px;
          margin: 0 auto;
          padding: 0 2rem;
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 2rem;
        }

        @media (max-width: 1200px) {
          .layout-grid {
            grid-template-columns: 1fr;
          }
        }

        .sidebar-widgets {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .widget-card {
          background: rgba(18, 18, 26, 0.8);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          padding: 1.5rem;
          backdrop-filter: blur(20px);
        }

        .widget-title {
          font-family: 'Orbitron', 'JetBrains Mono', monospace;
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--neon-cyan);
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 1rem;
        }

        .quick-stats {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .quick-stat {
          text-align: center;
          padding: 1rem;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 8px;
        }

        .quick-stat-value {
          font-family: 'Orbitron', 'JetBrains Mono', monospace;
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--neon-cyan);
          margin-bottom: 0.25rem;
        }

        .quick-stat-label {
          font-size: 0.85rem;
          color: var(--text-secondary);
          text-transform: uppercase;
        }

        .market-status {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem;
          background: rgba(0, 255, 136, 0.1);
          border: 1px solid #00ff88;
          border-radius: 8px;
          margin-top: 1rem;
        }

        .status-indicator {
          width: 10px;
          height: 10px;
          background: #00ff88;
          border-radius: 50%;
          animation: pulse-status 2s infinite;
        }

        @keyframes pulse-status {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .status-text {
          font-weight: 600;
          color: #00ff88;
        }
      `}</style>

      <div className="app-container">
        {/* Top Navigation */}
        <nav className="top-nav">
          <div className="nav-logo">BINARY_ZERO</div>
          <div className="nav-actions">
            <button className="nav-btn" onClick={() => setShowSettings(true)}>
              ⚙️ Settings
            </button>
            <button className="nav-btn profile" onClick={() => setShowProfile(true)}>
              👤 Profile
            </button>
          </div>
        </nav>

        {/* Main Content */}
        <main className="main-content">
          <div className="layout-grid">
            {/* Left Column - Main Trading Area */}
            <div>
              <TradingDashboard />

              <div style={{ marginTop: '2rem' }}>
                <AdvancedChart currentPrice={currentPrice} priceHistory={priceHistory} />
              </div>
            </div>

            {/* Right Column - Sidebar Widgets */}
            <div className="sidebar-widgets">
              <div className="widget-card">
                <h3 className="widget-title">Quick Stats</h3>
                <div className="quick-stats">
                  <div className="quick-stat">
                    <div className="quick-stat-value">{userData.totalTrades}</div>
                    <div className="quick-stat-label">Trades</div>
                  </div>
                  <div className="quick-stat">
                    <div className="quick-stat-value">{userData.winRate}%</div>
                    <div className="quick-stat-label">Win Rate</div>
                  </div>
                  <div className="quick-stat">
                    <div className="quick-stat-value">{userData.currentStreak}</div>
                    <div className="quick-stat-label">Streak</div>
                  </div>
                  <div className="quick-stat">
                    <div className="quick-stat-value">LVL {userData.tradingLevel}</div>
                    <div className="quick-stat-label">Level</div>
                  </div>
                </div>
                <div className="market-status">
                  <div className="status-indicator"></div>
                  <div className="status-text">Market Open</div>
                </div>
              </div>

              <div className="widget-card">
                <h3 className="widget-title">Recent Achievements</h3>
                {userData.achievements
                  .filter((a) => a.unlocked)
                  .slice(0, 3)
                  .map((achievement) => (
                    <div
                      key={achievement.id}
                      style={{
                        padding: '0.75rem',
                        background: 'rgba(0, 255, 255, 0.05)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '8px',
                        marginBottom: '0.5rem',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{ fontSize: '2rem' }}>{achievement.icon}</span>
                        <div>
                          <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{achievement.title}</div>
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                            {achievement.description}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </main>

        {/* Modals */}
        <AnimatePresence>
          {showSettings && (
            <SettingsPanel
              isOpen={showSettings}
              onClose={() => setShowSettings(false)}
              onSettingsChange={(settings) => {
                console.log('Settings updated:', settings)
                addNotification('success', 'Settings Saved', 'Your preferences have been updated successfully')
              }}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showProfile && <UserProfile isOpen={showProfile} onClose={() => setShowProfile(false)} userData={userData} />}
        </AnimatePresence>

        {/* Notification System */}
        <NotificationSystem notifications={notifications} onDismiss={dismissNotification} position="top-right" />
      </div>
    </>
  )
}

export default TradingApp

