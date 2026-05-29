# 🌗 PWA Night-Morning Tracker

An offline-first, zero-friction productivity Progressive Web App (PWA) designed to eliminate pre-sleep anxiety and optimize morning cognitive load. Built with **React**, **TypeScript**, **Tailwind CSS**, and **IndexedDB** (`localforage`).

The core philosophy of this application is **Micro-Friction Separation**: making data-dumping effortless at night when the brain is exhausted, and shifting task organization (prioritization) to the morning when cognitive energy is restored.

---

## ✨ Features

### 🌙 Night Mode (The Mental Dump)

- **Zero-Friction Input:** Rapid, sequential task capturing using `Enter-to-Add` behavior to keep the keyboard active without interruption.
- **Contextual Micro-Tagging:** Fast, single-tap categorization (Important, Routine, Idea, Reminder).
- **Energy Forecasting:** Predict next-day battery/energy levels (1-5) to set expectations.
- **"Mind Cleared" Sequence:** A smooth, ambient fading animation that locks the app into sleep mode, preventing late-night screen interactions.

### ☀️ Morning Mode (The Blueprint)

- **Context-Aware Greeting:** Personalized dynamic layout displaying the day, date, and previous night's energy prediction.
- **The Golden Top-3 Focus:** A dedicated zone using Drag & Drop to cherry-pick the day's 3 absolute priorities.
- **The Sandbox:** A structured view of the remaining late-night thoughts to check off, edit, or archive.
- **Auto-Generated Insights:** Textual summary summarizing the night's dump and guiding the user's initial focus.

### ⚙️ Technical Highlights (Value of Installation)

- **100% Offline-First Architecture:** Powered by `IndexedDB` through `localforage` for instantaneous, zero-latency reads/writes.
- **Fully Installable PWA:** Configured with `vite-plugin-pwa` utilizing a `CacheFirst` strategy for instant offline assets loading.
- **Bi-Lingual Infrastructure:** Full out-of-the-box support for both **English** and **Persian (RTL)** layouts.
- **Autonomic Theme Morphing:** Automatic, smooth interface transition between Night and Morning modes based on system clock hours.

---

## 🛠️ Tech Stack & Architecture

- **Frontend Library:** React 18+ (Vite)
- **Language:** TypeScript (Strict Mode)
- **Styling:** Tailwind CSS (Custom OLED Black & Sun-Glow gradients)
- **Local Storage Layer:** IndexedDB via `localforage`
- **Icons:** `lucide-react`

### 🗄️ Database Schema (`DailyLog`)

Data is structured around a single-source-of-truth **date-string key** (`YYYY-MM-DD`), allowing atomic daily operations and simple historical archiving:

```typescript
interface Task {
  id: string;
  text: string;
  category: "important" | "routine" | "idea" | "reminder";
  completed: boolean;
  completedAt?: string;
}

interface DailyLog {
  date: string; // Primary Key (e.g., "2026-05-29")
  nightMood?: {
    energyPrediction: number;
    rawNotes?: string;
    bedTime: string;
  };
  morningMood?: {
    wakeTime: string;
    focusTop3: string[]; // Task IDs chosen for the Top 3 focus
  };
  tasks: Task[];
}
```
