export type Language = string;

export type GradeLevel =
  | 'Class 1-5 (Primary / Elementary)'
  | 'Class 6-8 (Middle School)'
  | 'Class 9-10 (Secondary / Matric / O-Level)'
  | 'Class 11-12 (Higher Secondary / FSc / A-Level)'
  | 'Undergraduate / College (BS CS / Math / Sciences)'
  | 'Postgraduate / Master\'s (MS / MPhil)'
  | 'Doctoral / PhD Research Level';

export type Difficulty = 'Easy' | 'Standard' | 'Challenging' | 'Olympiad / PhD';

export type LearningPace = 'Foundational (Gentle)' | 'Standard' | 'Accelerated' | 'Deep Dive';

export type Subject =
  | 'Computer Science & Coding'
  | 'Mathematics'
  | 'Islamic Studies & History'
  | 'Natural Sciences (Physics/Chem/Bio)'
  | 'Languages & Literature (English & Urdu)'
  | 'General Academics';

export interface SolutionStep {
  stepNumber: number;
  title: string;
  explanation: string;
  mathOrCode?: string;
  tip?: string;
}

export interface PracticeChallenge {
  question: string;
  hint: string;
}

export interface AcademicCitation {
  source: string;
  reference: string;
  notes?: string;
}

export interface SolveResponse {
  problemSummary: string;
  subject: string;
  detectedLanguage: string;
  textDirection: 'ltr' | 'rtl';
  steps: SolutionStep[];
  finalAnswer: string;
  keyTakeaways: string[];
  practiceChallenge?: PracticeChallenge;
  countryContext?: string;
  bookReference?: string;
  citations?: AcademicCitation[];
  safetyVerified?: boolean;
}

export interface GradingCriterion {
  name: string;
  score: number;
  maxScore: number;
  comment: string;
}

export interface GradeResponse {
  assignmentTitle: string;
  overallScore: number;
  letterGrade: string;
  criteria: GradingCriterion[];
  strengths: string[];
  areasForImprovement: string[];
  correctedSolution: string;
  teacherFeedback: string;
  recommendedAction: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  hint: string;
  explanation: string;
}

export interface QuizData {
  title: string;
  subject: string;
  topic: string;
  gradeLevel: string;
  questions: QuizQuestion[];
}

export interface CodeDebugResponse {
  hasBugs: boolean;
  summary: string;
  issuesFound: Array<{
    line: number;
    type: string;
    description: string;
    fix: string;
  }>;
  fixedCode: string;
  timeComplexity: string;
  spaceComplexity: string;
  simulatedOutput: string;
  learningPoints: string[];
}

export interface DeadlineItem {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  type: 'Homework' | 'Quiz' | 'Coding Project' | 'Exam';
  completed: boolean;
  notes?: string;
}

export interface UserProgress {
  totalSolved: number;
  streakDays: number;
  lastActiveDate: string;
  hoursSpent: number;
  accuracyRate: number;
  subjectMastery: Record<string, number>;
  history: Array<{
    id: string;
    query: string;
    subject: string;
    gradeLevel: string;
    timestamp: string;
    solution: SolveResponse;
  }>;
}

export interface TeacherFeedbackItem {
  id: string;
  assignmentTitle: string;
  studentName: string;
  teacherName: string;
  date: string;
  rating: number;
  status: 'Reviewed' | 'Needs Revision' | 'Approved';
  notes: string;
  responseFromStudent?: string;
}
