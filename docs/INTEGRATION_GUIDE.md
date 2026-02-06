# Binary Options Trading Simulator - Frontend Components Guide

## Component Overview

Your trading simulator frontend includes these components with a cyberpunk aesthetic:

1. **TradingDashboard** - Main trading interface with real-time price updates
2. **SettingsPanel** - Customizable user preferences and trading settings
3. **UserProfile** - Stats, achievements, and user progression system
4. **AdvancedChart** - Technical analysis with multiple indicators (SMA, EMA, RSI)
5. **NotificationSystem** - Real-time toast notifications for trades and alerts
6. **TradingApp** - Integrated main app that brings everything together

---

## Installation

### Required dependencies

```bash
npm install framer-motion
```

> Note: This repo is a Vite + React + TypeScript app located in `frontend/`.
> Run installs from the `frontend/` directory.

---

## Quick start

### Option 1: Use the integrated app

Wire `TradingApp` into `App.tsx`:

```tsx
import TradingApp from './TradingApp'

function App() {
  return <TradingApp />
}

export default App
```

### Option 2: Use individual components

```tsx
import { useState } from 'react'
import TradingDashboard from './TradingDashboard'
import SettingsPanel from './SettingsPanel'
import UserProfile, { type UserData } from './UserProfile'
import AdvancedChart from './AdvancedChart'
import NotificationSystem, { useNotifications } from './NotificationSystem'

export default function CustomApp() {
  const [showSettings, setShowSettings] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const { notifications, addNotification, dismissNotification } = useNotifications()

  const userData: UserData = {
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
    achievements: [],
  }

  return (
    <div>
      <TradingDashboard />
      <AdvancedChart currentPrice={50000} priceHistory={[]} />

      <button onClick={() => setShowSettings(true)}>Settings</button>
      <button
        onClick={() => {
          addNotification('info', 'Hello', 'This is a notification', { duration: 3000 })
        }}
      >
        Test notification
      </button>
      <button onClick={() => setShowProfile(true)}>Profile</button>

      <SettingsPanel isOpen={showSettings} onClose={() => setShowSettings(false)} />
      <UserProfile isOpen={showProfile} onClose={() => setShowProfile(false)} userData={userData} />

      <NotificationSystem notifications={notifications} onDismiss={dismissNotification} position="top-right" />
    </div>
  )
}
```

---

## Component details (high level)

### TradingDashboard

- **Props**: none (self-contained with internal state)
- **Usage**:

```tsx
<TradingDashboard />
```

### SettingsPanel

- **Props**:

```ts
interface SettingsPanelProps {
  isOpen: boolean
  onClose: () => void
  onSettingsChange?: (settings: UserSettings) => void
}
```

### UserProfile

- **Props**:

```ts
interface UserProfileProps {
  isOpen: boolean
  onClose: () => void
  userData: UserData
}
```

### AdvancedChart

- **Props**:

```ts
interface AdvancedChartProps {
  currentPrice: number
  priceHistory: number[]
}
```

### NotificationSystem

- **Props**:

```ts
interface NotificationSystemProps {
  notifications: Notification[]
  onDismiss: (id: string) => void
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
}
```

---

## File structure (current)

```text
frontend/
  index.html
  package.json
  src/
    App.tsx
    main.tsx
    TradingApp.tsx
    TradingDashboard.tsx
    TradingDashboard.css
    SettingsPanel.tsx
    SettingsPanel.css
    UserProfile.tsx
    AdvancedChart.tsx
    AdvancedChart.css
    NotificationSystem.tsx
    NotificationSystem.css
    vite-env.d.ts
```

---

## Troubleshooting

### Animations not working

Make sure `framer-motion` is installed in `frontend/`:

```bash
cd frontend
npm install
```

### TypeScript errors like `react/jsx-runtime` not found

That typically means dependencies aren't installed (missing `node_modules`). Install from `frontend/` as above.
