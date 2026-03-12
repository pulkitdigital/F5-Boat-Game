# 🚣 Rowing the Boat — F5 Live Score Game

A real-time live event score tracking game built for F5, powered by Firebase Realtime Database. Enter scores question-by-question on the admin panel and watch the boat move live on the projector screen.

---

## 🖥️ Pages

| Page | URL | Purpose |
|---|---|---|
| Display | `/` | Projector / big screen — shows boat, score, progress |
| Input | `/input` | Host device — enter scores one by one |

---

## ⚡ Tech Stack

- **React + Vite** — Frontend framework
- **TailwindCSS** — Styling utility
- **Firebase Realtime Database** — Live cross-device sync
- **React Router DOM** — Page routing
- **Noto Sans** — Typography (Google Fonts)

---

## 📁 Project Structure

```
src/
├── App.jsx                    # Router — / and /input
├── firebase/
│   └── firebaseConfig.js      # Firebase app initialization
├── store/
│   └── gameStore.js           # Firebase read/write helpers + constants
└── pages/
    ├── DisplayPage.jsx        # Projector screen (read-only, live)
    └── InputPage.jsx          # Admin input panel
```

---

## 🚀 Getting Started

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd rowing-the-boat
npm install
```

### 2. Install Dependencies

```bash
npm install firebase react-router-dom
```

### 3. Firebase Setup

1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Create a new project
3. Go to **Build → Realtime Database → Create Database** → Start in **test mode**
4. Go to **Project Settings → Your Apps → Add Web App**
5. Copy the config and paste it in `src/firebase/firebaseConfig.js`

```js
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-app.firebaseapp.com",
  databaseURL: "https://your-app-default-rtdb.firebaseio.com",
  projectId: "your-app",
  storageBucket: "your-app.firebasestorage.app",
  messagingSenderId: "000000000000",
  appId: "1:000000000000:web:xxxxxxxxxxxxxx"
};
```

### 4. Run Locally

```bash
npm run dev
```

Open two browser tabs:
- `http://localhost:5173/` → Projector display
- `http://localhost:5173/input` → Admin input panel

---

## 🌐 Deploy on Vercel

### 1. Add `vercel.json` in project root

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### 2. Deploy

```bash
npm install -g vercel
vercel --prod
```

Or connect your GitHub repo to [vercel.com](https://vercel.com) for automatic deployments.

---

## 🎮 How to Use at a Live Event

1. Open **Display page** (`/`) on the projector — full screen
2. Open **Input page** (`/input`) on your laptop or phone
3. Enter score for Q1 → click **Next** or press **Enter**
4. Boat moves on the projector in real-time 🚣
5. Repeat for Q2 through Q20
6. On Q20 — click **Finish ✓** to complete the game
7. Click **↺ Reset Game** to start a new round

---

## 🏗️ Game Logic

| Rule | Value |
|---|---|
| Total questions | 20 |
| Max score per question | 100 |
| Max total score | 2000 |
| Boat position | `(totalScore / 2000) × trackWidth` |

**Score sync flow:**
- Q1–Q19: Score saves to Firebase on **Next** button click
- Q20: Score saves to Firebase only on **Finish ✓** button click
- Display page listens to Firebase in real-time and updates instantly

---

## 📱 Responsive Support

| Device | Layout |
|---|---|
| 📱 Mobile (portrait) | Compact — smaller fonts, tight spacing |
| 📟 Tablet | Medium sizing |
| 💻 Laptop / Desktop | Full size |
| 🖥️ Projector | Optimized full-screen display |

---

## 🎨 Brand

- **Primary Color:** F5 Red `#E4002B`
- **Font:** Noto Sans (Google Fonts)
- **Theme:** Light mode — white background, red accents

---

## 📄 License

Internal use — F5 Networks live event tool.