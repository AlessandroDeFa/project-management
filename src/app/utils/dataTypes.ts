export interface TaskData {
  id: string;
  name: string;
  note: string;
  projectFor: string;
  isCompleted: boolean;
}

export interface NoteData {
  id: string;
  name: string;
  note: string;
  projectFor: string;
  isCompleted: boolean;
}

export interface ProjectData {
  id: string;
  name: string;
  note: string;
  isCompleted: boolean;
}

export interface MemoData {
  id: string;
  name: string;
  note: string;
  isCompleted: boolean;
  dueDate: string;
}

export interface CompletedElement {
  id: string;
  name: string;
  note: string;
  projectFor?: string;
  isCompleted: boolean;
  elementType: string;
  DateCompleted: string;
}

export interface CountsData {
  countTasks: number;
  countNotes: number;
  countProjects: number;
  countCompleted: number;
  countMemo: number;
  countAllElements: number;
  [key: string]: number;
}

export interface AllElements {
  id: string;
  name: string;
  note: string;
  projectFor?: string;
  isCompleted: boolean;
  dueDate?: string;
  elementType?: string;
  DateCompleted?: string;
}
