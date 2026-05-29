import localforage from 'localforage';
import { DailyLog, UserProfile } from '../types';

localforage.config({
  name: 'MindGlow',
  storeName: 'daily_logs'
});

export const getDailyLog = async (date: string): Promise<DailyLog> => {
  const log = await localforage.getItem<DailyLog>(date);
  if (log) return log;
  return { date, tasks: [] };
};

export const saveDailyLog = async (log: DailyLog): Promise<void> => {
  await localforage.setItem(log.date, log);
};

export const getUserProfile = async (): Promise<UserProfile | null> => {
  return await localforage.getItem<UserProfile>('user_profile');
};

export const saveUserProfile = async (profile: UserProfile): Promise<void> => {
  await localforage.setItem('user_profile', profile);
};

export const getAllLogs = async (): Promise<DailyLog[]> => {
  const keys = await localforage.keys();
  const logs: DailyLog[] = [];
  for (const key of keys) {
    if (key !== 'user_profile') {
      const log = await localforage.getItem<DailyLog>(key);
      if (log) logs.push(log);
    }
  }
  return logs.sort((a, b) => a.date.localeCompare(b.date));
};

