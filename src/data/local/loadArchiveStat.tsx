import type { ArchiveStat } from "../../domain/models/ArchiveStat";

const ARCHIVE_STAT_KEY = "user-archive-stat";

export function loadArchiveStat(): ArchiveStat | null {
  try {
    const raw = localStorage.getItem(ARCHIVE_STAT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
} 

export function saveArchiveStat(stat: ArchiveStat) {
  localStorage.setItem(ARCHIVE_STAT_KEY, JSON.stringify(stat));
}

export function cleanArchiveStat() {
  localStorage.removeItem(ARCHIVE_STAT_KEY);
}
