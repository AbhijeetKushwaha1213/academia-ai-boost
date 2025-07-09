
export interface UserProfile {
  id: string;
  user_id: string;
  name: string;
  email: string;
  user_type: 'exam' | 'college';
  exam_type?: string;
  college?: string;
  branch?: string;
  semester?: number;
  exam_date?: string;
  study_streak: number;
  total_study_hours: number;
  current_level: number;
  experience_points: number;
  avatar?: string;
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
  metadata?: Record<string, any>;
}

export interface ChatSession {
  id: string;
  user_id: string;
  title: string;
  topic: string;
  created_at: string;
  updated_at: string;
  messages?: ChatMessage[];
}
