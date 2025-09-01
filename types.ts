export interface RevisionHistory {
  revisionDate: string; // ISO string
  previousLevel: number;
  confidence?: 'hard' | 'good' | 'easy';
}

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
  notes?: string;
  tags?: string[];
  history?: RevisionHistory[];
  parentId?: string | null;
  prerequisiteIds?: string[];
}

export interface Settings {
}

export interface Achievement {
    id: string;
    name: string;
    description: string;
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
}