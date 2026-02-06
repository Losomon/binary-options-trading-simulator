import React from 'react'
import { motion } from 'framer-motion'

export type Achievement = {
  id: string
  title: string
  description: string
  icon: string
  unlocked: boolean
  unlockedAt?: Date
}

export type UserData = {
  username: string
  email: string
  memberSince: Date
  totalTrades: number
  winRate: number
  totalProfit: number
  currentStreak: number
  bestStreak: number
  tradingLevel: number
  experience: number
  nextLevelXP: number
  achievements: Achievement[]
}

type Props = {
  isOpen: boolean
  onClose: () => void
  userData: UserData
}

export default function UserProfile({ isOpen, onClose, userData }: Props) {
  if (!isOpen) return null

  const xpPct =
    userData.nextLevelXP > 0 ? Math.max(0, Math.min(1, userData.experience / userData.nextLevelXP)) : 0

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 220,
        background: 'rgba(0,0,0,0.55)',
        backdropFilter: 'blur(6px)',
        display: 'grid',
        placeItems: 'center',
        padding: 16,
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 12, opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 12, opacity: 0, scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 260, damping: 26 }}
        style={{
          width: 'min(720px, 100%)',
          borderRadius: 14,
          border: '1px solid rgba(255,255,255,0.14)',
          background: 'rgba(18, 18, 26, 0.92)',
          color: 'rgba(255,255,255,0.9)',
          boxShadow: '0 24px 60px rgba(0,0,0,0.45)',
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            padding: 14,
            borderBottom: '1px solid rgba(255,255,255,0.10)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
          }}
        >
          <div>
            <div style={{ fontWeight: 900, letterSpacing: 0.6 }}>{userData.username}</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.68)' }}>{userData.email}</div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              cursor: 'pointer',
              borderRadius: 10,
              border: '1px solid rgba(255,255,255,0.14)',
              background: 'rgba(255,255,255,0.06)',
              color: 'rgba(255,255,255,0.92)',
              padding: '6px 10px',
            }}
          >
            Close
          </button>
        </div>

        <div style={{ padding: 14, display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 12 }}>
          <div style={{ border: '1px solid rgba(255,255,255,0.10)', borderRadius: 12, padding: 12 }}>
            <div style={{ fontWeight: 800, marginBottom: 10 }}>Progress</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.68)' }}>
              Level {userData.tradingLevel} — {userData.experience}/{userData.nextLevelXP} XP
            </div>
            <div
              style={{
                marginTop: 8,
                height: 10,
                borderRadius: 999,
                background: 'rgba(255,255,255,0.08)',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${Math.round(xpPct * 100)}%`,
                  background: 'linear-gradient(90deg, rgba(56,189,248,1), rgba(124,58,237,1))',
                }}
              />
            </div>

            <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
              <Stat label="Total trades" value={userData.totalTrades.toLocaleString()} />
              <Stat label="Win rate" value={`${userData.winRate}%`} />
              <Stat label="Profit" value={`$${userData.totalProfit.toLocaleString()}`} />
              <Stat label="Best streak" value={userData.bestStreak.toLocaleString()} />
            </div>
          </div>

          <div style={{ border: '1px solid rgba(255,255,255,0.10)', borderRadius: 12, padding: 12 }}>
            <div style={{ fontWeight: 800, marginBottom: 10 }}>Achievements</div>
            <div style={{ display: 'grid', gap: 8, maxHeight: 260, overflow: 'auto' }}>
              {userData.achievements.map((a) => (
                <div
                  key={a.id}
                  style={{
                    border: '1px solid rgba(255,255,255,0.10)',
                    borderRadius: 12,
                    padding: 10,
                    background: a.unlocked ? 'rgba(56,189,248,0.06)' : 'rgba(255,255,255,0.04)',
                    opacity: a.unlocked ? 1 : 0.6,
                  }}
                >
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <div style={{ fontSize: 22 }}>{a.icon}</div>
                    <div>
                      <div style={{ fontWeight: 800 }}>{a.title}</div>
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.68)' }}>{a.description}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ padding: 10, borderRadius: 12, background: 'rgba(255,255,255,0.04)' }}>
      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.62)' }}>{label}</div>
      <div style={{ fontWeight: 900, marginTop: 4 }}>{value}</div>
    </div>
  )
}

