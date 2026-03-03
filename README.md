<![CDATA[# 🧠 Deepfy — Another Thought With Deepfy

> **Your mind + React + Dify + DeepSeek**

Deepfy is a personal emotional wellness app that helps you track, understand, and improve your emotional health. Powered by **Dify AI workflows** and the **DeepSeek** language model, it transforms your daily thoughts into meaningful insights — a score, a feeling, a quote, and advice — all stored locally in your browser.

---

## ✨ Features

### 🎭 Mood Tracker (Dashboard)
- **Daily emotion check-in** — Tap once, describe how you feel, and get an AI-generated emotional analysis
- **Weekly emotion overview** — Visual calendar of your mood across the week with emoji indicators
- **Emotion trends chart** — Interactive area chart showing your emotional score over time (7 / 14 / 30 days / all time)
- **Score distribution** — Bar chart breakdown of your mood frequency by tier (Very Low → Very High)
- **Today's emotion card** — At-a-glance view of your current day's feeling, quote, and advice

### 💓 Health Insights
- **Wellness Score Ring** — Animated SVG gauge showing your overall weighted wellness score (1–10)
- **8 Insight Stat Cards** — Mood trend, current streak, weekly comparison, 7-day average, positive days ratio, mood stability, total check-ins, and all-time average
- **Emotion Highlights** — Highest, average, and lowest recorded moods with emoji badges and most common emotion
- **Day-of-Week Analysis** — Bar chart revealing which days of the week you feel best/worst
- **Mood Calendar** — GitHub-style heatmap of the last 12 weeks with tooltip details per day
- **Personalized Recommendations** — Dynamically generated insights based on your patterns (trends, streaks, stability, etc.)
- **Recent AI Advice** — The latest advice snippets from your check-in history

### 🎯 Personal Goals
- Goal tracking cards with progress bars (in development)

---

## 🛠 Tech Stack

| Layer            | Technology                                                 |
| ---------------- | ---------------------------------------------------------- |
| **Framework**    | [React 19](https://react.dev) + [TypeScript 5.9](https://www.typescriptlang.org) |
| **Build Tool**   | [Vite 7](https://vite.dev)                                |
| **Styling**      | [Tailwind CSS 4](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com) |
| **State**        | [Redux Toolkit](https://redux-toolkit.js.org)              |
| **Routing**      | [React Router 7](https://reactrouter.com)                  |
| **Charts**       | [Recharts 2](https://recharts.org)                         |
| **Icons**        | [Lucide React](https://lucide.dev)                         |
| **Date**         | [Day.js](https://day.js.org)                               |
| **Database**     | [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) via [idb](https://github.com/nicholasgriffintn/idb) |
| **AI Backend**   | [Dify](https://dify.ai) workflow API + [DeepSeek](https://deepseek.com) LLM |
| **Fonts**        | Inter Variable, Montserrat Variable                        |
| **Runtime**      | [Bun](https://bun.sh) / Node.js                           |
| **Container**    | Docker + Nginx (production)                                |

---

## 📁 Project Structure

```
src/
├── assets/               # SVGs, images, stylesheets
│   └── svgs/             # Emotion emoji SVGs (11 emotions)
├── components/
│   ├── common/           # Sidebar navigation (AppSidebar)
│   ├── dashboard/        # Mood Tracker components
│   │   ├── ChartEmotions/    # Area chart, bar chart, legend, header
│   │   ├── EmotionCheckIn/   # Check-in dialog, form, result display
│   │   ├── WeeklyEmotion/    # Weekly calendar with day cards
│   │   ├── TodayBlock.tsx    # Today's date display
│   │   └── hooks/            # useEmotionHistory hook
│   ├── health-insights/  # Health Insights page components
│   │   ├── useHealthInsights.ts      # Core analytics hook
│   │   ├── WellnessScoreRing.tsx     # Animated SVG gauge
│   │   ├── InsightStatsGrid.tsx      # 8 stat cards grid
│   │   ├── DayOfWeekChart.tsx        # Weekday bar chart
│   │   ├── MoodCalendar.tsx          # 12-week heatmap
│   │   ├── EmotionHighlights.tsx     # High/avg/low badges
│   │   ├── RecommendationsPanel.tsx  # AI-powered recommendations
│   │   └── EmptyInsights.tsx         # Empty state CTA
│   ├── layouts/          # Default layout wrapper
│   └── ui/               # shadcn/ui primitives (button, card, chart, etc.)
├── constants/
│   └── emojis.ts         # Score-to-emoji mapping (1–10)
├── hooks/                # Shared React hooks
├── lib/
│   ├── db.ts             # IndexedDB setup via idb
│   └── utils.ts          # cn() utility
├── pages/
│   ├── Dashboard.tsx     # Mood Tracker page
│   ├── HealthInsightsPage.tsx  # Health Insights page
│   ├── PersonalGoalsPage.tsx   # Personal Goals page
│   ├── HomePage.tsx
│   └── AboutPage.tsx
├── services/
│   ├── dify.ts           # Dify API client (runWorkflow)
│   └── history.ts        # IndexedDB CRUD for workflow runs
├── store/
│   ├── index.ts          # Redux store configuration
│   ├── hooks.ts          # Typed useAppDispatch / useAppSelector
│   └── slices/
│       └── difySlice.ts  # Async thunk for Dify workflow execution
├── utils/
│   ├── common.ts         # parseTextResult (JSON from AI response)
│   ├── date.ts           # Day.js helpers (isToday, isThisWeek, etc.)
│   └── emotion.ts        # Score → color mapping functions
├── App.tsx               # Route definitions
├── main.tsx              # Entry point
└── index.css             # Theme tokens, color system, dark mode
```

---

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh) (recommended) or [Node.js](https://nodejs.org) ≥ 18
- A [Dify](https://dify.ai) account with a configured workflow
- A Dify API key

### 1. Clone the repository

```bash
git clone https://github.com/heydayle/another-thought-with-deepfy.git
cd another-thought-with-deepfy
```

### 2. Install dependencies

```bash
bun install
# or
npm install
```

### 3. Configure environment variables

Copy the example environment file and fill in your credentials:

```bash
cp example.env .env
```

Edit `.env`:

```env
NODE_ENV=development
VITE_DIFY_BASE_URL=https://api.dify.ai/v1
VITE_DIFY_API_KEY=app-your-api-key-here
```

### 4. Start the development server

```bash
bun dev
# or
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🐳 Docker

### Development

```bash
docker-compose up
```

This mounts the source code with hot-reload on port `5173`.

### Production

```bash
docker build --target builder -t deepfy .
docker build -t deepfy-prod .
docker run -p 80:80 deepfy-prod
```

The production build is served by **Nginx** on port `80`.

---

## 📝 Available Scripts

| Command          | Description                        |
| ---------------- | ---------------------------------- |
| `bun dev`        | Start Vite dev server              |
| `bun run build`  | TypeScript check + production build|
| `bun run lint`   | Run ESLint                         |
| `bun run preview`| Preview the production build       |

---

## 🎨 Design System

### Color Palette

The app uses a custom **brand indigo** palette with warm neutral grays, plus an **emotion color scale**:

| Score Range | Color          | CSS Variable                      |
| ----------- | -------------- | --------------------------------- |
| 1–2         | 🔴 Red         | `--color-emotion-very-low`        |
| 3–4         | 🟡 Yellow      | `--color-emotion-low`             |
| 5–6         | 🟢 Green       | `--color-emotion-neutral`         |
| 7–8         | 🩵 Teal        | `--color-emotion-high`            |
| 9–10        | 🌿 Dark Green  | `--color-emotion-very-high`       |

### Emotion Emojis (Score 1–10)

| Score | Emoji            | Meaning                |
| ----- | ---------------- | ---------------------- |
| 1     | 😭 Loudly Crying  | Very devastated        |
| 2     | 😢 Crying         | Very sad               |
| 3     | 🥺 Pleading       | Sad / upset            |
| 4     | 😳 Flushed        | Anxious / overwhelmed  |
| 5     | 😐 Neutral        | Indifferent            |
| 6     | 🌼 Empty Daisy    | Calm / okay            |
| 7     | 🙂 Slightly Smiling | Mildly happy         |
| 8     | 😊 Smiling        | Happy                  |
| 9     | 😁 Beaming        | Very happy             |
| 10    | 🤩 Star Struck    | Ecstatic / amazing     |

### Theme Support

- ☀️ **Light mode** — Clean white cards on neutral-100 background
- 🌙 **Dark mode** — Deep zinc/black with adjusted brand colors

---

## 🔄 Data Flow

```
User Input ("How are you feeling?")
       │
       ▼
  Redux Thunk (executeWorkflow)
       │
       ▼
  Dify API (/workflows/run)
       │  └── DeepSeek LLM processes the input
       ▼
  AI Response: { score, your_feeling, your_quote, advice }
       │
       ├──▶ Redux Store (real-time UI update)
       │
       └──▶ IndexedDB (persistent history via idb)
                │
                ▼
        useEmotionHistory() hook
                │
                ├──▶ Dashboard Charts & Weekly View
                │
                └──▶ Health Insights (useHealthInsights hook)
                        │
                        ├── Wellness Score (weighted average)
                        ├── Mood Trend (first half vs second half)
                        ├── Streak Tracking (consecutive days)
                        ├── Week Comparison (this vs last week)
                        ├── Day-of-Week Stats (avg per weekday)
                        ├── Mood Stability (std deviation-based)
                        ├── Positive Ratio (score ≥ 7)
                        └── Personalized Recommendations
```

---

## 🧩 Key Architecture Decisions

- **Client-side only** — All data lives in IndexedDB; no backend database needed
- **Dify as AI orchestrator** — Workflows are configured in Dify's visual editor, keeping AI logic out of the frontend code
- **Score-based emotion system** — A simple 1–10 scale maps cleanly to colors, emojis, and tiers
- **Component composition** — Each dashboard section is a self-contained component with its own hook and local state
- **Weighted wellness score** — Recent entries carry more weight than older ones for a more relevant overall score

---

## 📄 License

[MIT License](./LICENSE) © 2026 [Thinh Le](https://github.com/heydayle)
]]>
