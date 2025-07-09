
import { useState, useCallback } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { useToast } from '@/hooks/use-toast';

interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AIAssistantConfig {
  model: string;
  temperature: number;
  maxTokens: number;
  systemPrompt: string;
}

export const useAIAssistant = (config?: Partial<AIAssistantConfig>) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const defaultConfig: AIAssistantConfig = {
    model: 'gpt-3.5-turbo',
    temperature: 0.7,
    maxTokens: 1000,
    systemPrompt: `You are StudyMate AI, a helpful study assistant. The user is a ${
      user?.user_type === 'college' ? 'college student' : 'student preparing for exams'
    }. Provide helpful, encouraging, and educational responses. Keep answers concise but comprehensive.`,
    ...config
  };

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    const userMessage: AIMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

      // Generate a mock response based on the user's message
      const mockResponse = generateMockResponse(content, user?.user_type || 'exam');
      
      const assistantMessage: AIMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: mockResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      console.error('AI Assistant Error:', err);
      setError('Failed to get AI response. Please try again.');
      toast({
        title: "AI Assistant Error",
        description: "Failed to get a response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [user?.user_type, toast]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  const regenerateLastResponse = useCallback(async () => {
    if (messages.length < 2) return;
    
    const lastUserMessage = messages[messages.length - 2];
    if (lastUserMessage.role !== 'user') return;

    // Remove the last assistant message
    setMessages(prev => prev.slice(0, -1));
    
    // Regenerate response
    await sendMessage(lastUserMessage.content);
  }, [messages, sendMessage]);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
    regenerateLastResponse,
    config: defaultConfig
  };
};

function generateMockResponse(userMessage: string, userType: string): string {
  const message = userMessage.toLowerCase();
  
  // Study-related responses
  if (message.includes('study') || message.includes('learn')) {
    return "Great question about studying! Here are some effective study strategies:\n\n1. **Active Recall**: Test yourself frequently instead of just re-reading\n2. **Spaced Repetition**: Review material at increasing intervals\n3. **Pomodoro Technique**: Study in 25-minute focused sessions\n4. **Teach Others**: Explain concepts to solidify your understanding\n\nWhat specific subject or topic would you like help with?";
  }
  
  // Math-related responses
  if (message.includes('math') || message.includes('calculus') || message.includes('algebra')) {
    return "Mathematics can be challenging, but with the right approach, you can master it! Here's how to improve:\n\n📚 **Practice regularly** - Math is like a muscle that needs exercise\n🔍 **Understand concepts** - Don't just memorize formulas\n📝 **Show your work** - This helps you catch errors and understand your process\n🤝 **Ask for help** - Don't hesitate to seek clarification\n\nWhich specific math topic are you working on? I can provide more targeted advice!";
  }
  
  // Science-related responses
  if (message.includes('physics') || message.includes('chemistry') || message.includes('biology')) {
    return "Science subjects require both conceptual understanding and practical application. Here are some tips:\n\n🧪 **Connect theory to practice** - Relate formulas to real-world phenomena\n📊 **Use visual aids** - Diagrams, charts, and models help understanding\n🔬 **Practice problems** - Work through many examples\n📚 **Create concept maps** - Show relationships between ideas\n\nWhat science topic would you like to explore together?";
  }
  
  // Exam preparation responses
  if (message.includes('exam') || message.includes('test') || message.includes('jee') || message.includes('neet')) {
    return `${userType === 'exam' ? "Perfect! Since you're preparing for competitive exams, here's a focused strategy:" : "Exam preparation requires a systematic approach:"}\n\n⏰ **Time Management**: Create a realistic study schedule\n📋 **Practice Tests**: Take regular mock exams\n📝 **Weak Areas**: Identify and work on your problem areas\n💪 **Stay Consistent**: Regular study is better than cramming\n🎯 **Set Goals**: Break down your preparation into achievable milestones\n\nWhat specific exam are you preparing for? I can provide more targeted guidance!`;
  }
  
  // Motivation and encouragement
  if (message.includes('motivation') || message.includes('difficult') || message.includes('hard') || message.includes('give up')) {
    return "I understand that studying can feel overwhelming sometimes, but remember:\n\n✨ **Every expert was once a beginner** - You're building skills step by step\n🎯 **Focus on progress, not perfection** - Small improvements add up\n🌟 **Celebrate small wins** - Acknowledge your daily achievements\n💪 **You're stronger than you think** - You've overcome challenges before\n\nWhat's making you feel this way? Let's work through it together and find a solution that works for you! 🚀";
  }
  
  // Default response
  return "I'm here to help you with your studies! Whether you need help with:\n\n📚 **Subject-specific questions** (Math, Science, etc.)\n📝 **Study strategies and techniques**\n⏰ **Time management and planning**\n🎯 **Exam preparation tips**\n💪 **Motivation and study habits**\n\nJust let me know what you'd like to work on, and I'll provide personalized guidance to help you succeed! What would you like to explore first?";
}
