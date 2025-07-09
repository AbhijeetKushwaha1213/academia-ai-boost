
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import { ChatMessage, ChatSession } from '@/types/user';

export const useChat = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load chat sessions
  const loadSessions = async () => {
    if (!user?.user_id) return;

    try {
      const { data, error } = await supabase
        .from('chat_sessions')
        .select('*')
        .eq('user_id', user.user_id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setSessions(data || []);
    } catch (err) {
      console.error('Error loading sessions:', err);
      setError('Failed to load chat sessions');
    }
  };

  // Load messages for a session
  const loadMessages = async (sessionId: string) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('chat_sessions')
        .select('messages')
        .eq('id', sessionId)
        .single();

      if (error) throw error;
      
      const sessionMessages = data?.messages as ChatMessage[] || [];
      setMessages(sessionMessages);
    } catch (err) {
      console.error('Error loading messages:', err);
      setError('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  // Create new session
  const createSession = async (title: string, topic: string) => {
    if (!user?.user_id) return null;

    try {
      const { data, error } = await supabase
        .from('chat_sessions')
        .insert({
          user_id: user.user_id,
          title,
          topic,
          messages: []
        })
        .select()
        .single();

      if (error) throw error;
      
      const newSession = data as ChatSession;
      setSessions(prev => [newSession, ...prev]);
      setCurrentSession(newSession);
      setMessages([]);
      
      return newSession;
    } catch (err) {
      console.error('Error creating session:', err);
      setError('Failed to create session');
      return null;
    }
  };

  // Send message
  const sendMessage = async (content: string) => {
    if (!currentSession || !user?.user_id) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      user_id: user.user_id,
      session_id: currentSession.id,
      role: 'user',
      content,
      timestamp: new Date().toISOString()
    };

    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);

    try {
      // Update session with new messages
      const { error } = await supabase
        .from('chat_sessions')
        .update({
          messages: updatedMessages,
          updated_at: new Date().toISOString()
        })
        .eq('id', currentSession.id);

      if (error) throw error;

      // Here you would typically call your AI service to get a response
      // For now, we'll simulate a response
      setTimeout(() => {
        const aiResponse: ChatMessage = {
          id: (Date.now() + 1).toString(),
          user_id: user.user_id,
          session_id: currentSession.id,
          role: 'assistant',
          content: generateMockResponse(content),
          timestamp: new Date().toISOString()
        };

        const finalMessages = [...updatedMessages, aiResponse];
        setMessages(finalMessages);

        // Update session with AI response
        supabase
          .from('chat_sessions')
          .update({
            messages: finalMessages,
            updated_at: new Date().toISOString()
          })
          .eq('id', currentSession.id);
      }, 1000);

    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message');
    }
  };

  // Delete session
  const deleteSession = async (sessionId: string) => {
    try {
      const { error } = await supabase
        .from('chat_sessions')
        .delete()
        .eq('id', sessionId);

      if (error) throw error;
      
      setSessions(prev => prev.filter(s => s.id !== sessionId));
      
      if (currentSession?.id === sessionId) {
        setCurrentSession(null);
        setMessages([]);
      }
    } catch (err) {
      console.error('Error deleting session:', err);
      setError('Failed to delete session');
    }
  };

  useEffect(() => {
    if (user?.user_id) {
      loadSessions();
    }
  }, [user?.user_id]);

  return {
    messages,
    sessions,
    currentSession,
    loading,
    error,
    setCurrentSession,
    loadMessages,
    createSession,
    sendMessage,
    deleteSession,
    clearError: () => setError(null)
  };
};

function generateMockResponse(userMessage: string): string {
  const responses = [
    "That's a great question! Let me help you understand this concept better.",
    "I can definitely help you with that. Here's what you need to know:",
    "Excellent topic to study! Let me break this down for you:",
    "This is an important concept. Here's my explanation:",
    "I understand what you're asking. Let me provide a clear answer:"
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
}
