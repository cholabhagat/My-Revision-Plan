export interface RevisionItem {
  id: string;
  title: string;
  level: number;
  lastRevisionDate: string; // ISO string
  nextRevisionDate: string; // ISO string
  createdAt: string; // ISO string
  revisionIntervals?: number[];
  archivedAt?: string; // ISO string
  completedAt?: string; // ISO string
}