export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  mode?: 'college' | 'exam_preparation';
  semester?: number;
  college_name?: string;
  target_exam?: string;
  attempt_year?: number;
  onboarding_completed?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface OnboardingData {
  full_name: string;
  mode: 'college' | 'exam_preparation';
  semester?: number;
  college_name?: string;
  target_exam?: string;
  attempt_year?: number;
}

export interface ChatMessage {
  id: string;
  user_id: string;
  session_id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  metadata?: any;
}

export interface ChatSession {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
}