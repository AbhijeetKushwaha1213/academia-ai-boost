
import { useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export const useAIAssistant = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (message: string, subject?: string) => {
    if (!message.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const context = messages.slice(-10).map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const { data, error } = await supabase.functions.invoke('ai-assistant', {
        body: {
          message,
          context,
          userType: user?.userType || 'exam',
          subject
        }
      });

      if (error) throw error;

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message to AI:', error);
      toast({
        title: "Error",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateContent = async (contentType: string, topic: string, difficulty: string, count: number, subject?: string) => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('ai-assistant', {
        body: {
          message: topic,
          contentType,
          topic,
          difficulty,
          count,
          subject,
          userType: user?.userType || 'exam'
        }
      });

      if (error) throw error;

      // Parse the AI response to extract JSON content
      let parsedContent;
      try {
        // Try to extract JSON from the response
        const jsonMatch = data.response.match(/```json\n?(.*?)\n?```/s) || 
                         data.response.match(/\{[\s\S]*\}/);
        
        if (jsonMatch) {
          parsedContent = JSON.parse(jsonMatch[1] || jsonMatch[0]);
        } else {
          // If no JSON found, try parsing the entire response
          parsedContent = JSON.parse(data.response);
        }
      } catch (parseError) {
        console.error('Failed to parse AI response as JSON:', parseError);
        // Fallback: create structured content from text response
        parsedContent = createFallbackContent(contentType, data.response, topic, difficulty, count);
      }

      return parsedContent;
    } catch (error) {
      console.error('Error generating content:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate content. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const createFallbackContent = (contentType: string, response: string, topic: string, difficulty: string, count: number) => {
    // Create fallback structured content if AI doesn't return proper JSON
    switch (contentType) {
      case 'flashcards':
        return {
          flashcards: Array.from({ length: count }, (_, i) => ({
            question: `What is the key concept ${i + 1} about ${topic}?`,
            answer: `This is a detailed answer about ${topic} concept ${i + 1}.`,
            hint: `Remember the importance of ${topic} in this context.`
          }))
        };
      case 'mindmaps':
        return {
          mindmap: {
            central_topic: topic,
            branches: [
              {
                title: `Main Concept`,
                subtopics: [`Subtopic 1`, `Subtopic 2`],
                details: `Key aspects of ${topic}`
              }
            ]
          }
        };
      case 'quizzes':
        return {
          quiz: Array.from({ length: count }, (_, i) => ({
            question: `Quiz question ${i + 1} about ${topic}?`,
            options: [`Option A`, `Option B`, `Option C`, `Option D`],
            correct_answer: 0,
            explanation: `Explanation for question ${i + 1} about ${topic}.`
          }))
        };
      default:
        return { content: response };
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  return {
    messages,
    sendMessage,
    generateContent,
    clearChat,
    isLoading,
  };
};
