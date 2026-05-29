export interface Task {
  id: string;
  text: string;
  category: 'important' | 'routine' | 'idea' | 'reminder' | 'none';
  completed: boolean;
  completedAt?: string;
}

export interface UserProfile {
  name: string;
  lang: 'fa' | 'en';
}

export interface DailyLog {
  date: string; // YYYY-MM-DD
  nightMood?: {
    energyPrediction: number; // 1-5
    bedTime: string; // ISO String
    rawNotes?: string;
  };
  morningMood?: {
    wakeTime: string;
    focusTop3: string[]; // Task IDs
  };
  tasks: Task[];
}
