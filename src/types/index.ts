export type ToolCategory = 'all' | 'kindergarten' | 'design' | 'assessment' | 'evaluation' | 'interaction' | 'classroom';

export type ToolId = 
  | 'lesson-plan'
  | 'kindergarten-activity'
  | 'child-observation'
  | 'kindergarten-env'
  | 'quiz-gen'
  | 'essay-grade'
  | 'student-comment'
  | 'ppt-outline'
  | 'parent-comm'
  | 'class-activity'
  | 'micro-lesson'
  | 'in-class-tools'
  | 'library';

export interface ToolMeta {
  id: ToolId;
  name: string;
  shortDesc: string;
  category: ToolCategory;
  iconName: string;
  badge?: string;
  gradient: string;
  accentColor: string;
}

export interface SavedResource {
  id: string;
  title: string;
  toolId: ToolId;
  category: string;
  createdAt: number;
  tags: string[];
  content: string;
  meta?: Record<string, any>;
  isFavorite?: boolean;
}

export interface QuizQuestion {
  id: number;
  type: 'single' | 'multiple' | 'fill' | 'judge' | 'qa' | 'analysis';
  question: string;
  options?: string[];
  answer: string;
  explanation: string;
  points?: number;
  knowledgePoint?: string;
}

export interface SlideItem {
  id: number;
  slideNumber: number;
  title: string;
  subtitle?: string;
  keyPoints: string[];
  teacherNotes: string;
  interactivePrompt?: string;
  layoutType?: 'cover' | 'content' | 'split' | 'activity' | 'summary';
}

export interface StudentCommentItem {
  id: string;
  name: string;
  gender: 'male' | 'female';
  academicLevel: string;
  characteristics: string[];
  strengths: string;
  improvementAreas: string;
  generatedComment: string;
  shortComment?: string;
}
