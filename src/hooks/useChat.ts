
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
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

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
      
      // Safely cast messages from JSON
      const sessionMessages = Array.isArray(data?.messages) 
        ? (data.messages as unknown as ChatMessage[]) 
        : [];
      setMessages(sessionMessages);
    } catch (err) {
      console.error('Error loading messages:', err);
      setError('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  // Load a specific session
  const loadSession = async (sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId);
    if (session) {
      setCurrentSession(session);
      await loadMessages(sessionId);
    }
  };

  // Create new session
  const createSession = async (title?: string, topic?: string) => {
    if (!user?.user_id) return null;

    const sessionTitle = title || 'New Chat';
    const sessionTopic = topic || 'general';

    try {
      const { data, error } = await supabase
        .from('chat_sessions')
        .insert({
          user_id: user.user_id,
          title: sessionTitle,
          topic: sessionTopic,
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

  // Save a message
  const saveMessage = async (role: 'user' | 'assistant', content: string) => {
    if (!currentSession || !user?.user_id) return;

    setSaveStatus('saving');

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      user_id: user.user_id,
      session_id: currentSession.id,
      role,
      content,
      timestamp: new Date().toISOString()
    };

    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);

    try {
      // Update session with new messages - cast to unknown first to avoid type issues
      const { error } = await supabase
        .from('chat_sessions')
        .update({
          messages: updatedMessages as unknown as any,
          updated_at: new Date().toISOString()
        })
        .eq('id', currentSession.id);

      if (error) throw error;
      setSaveStatus('saved');
      
      // Reset save status after a delay
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (err) {
      console.error('Error saving message:', err);
      setError('Failed to save message');
      setSaveStatus('error');
    }
  };

  // Send message (combines user message and AI response)
  const sendMessage = async (content: string) => {
    if (!currentSession || !user?.user_id) return;

    // Save user message
    await saveMessage('user', content);

    // Simulate AI response
    setTimeout(async () => {
      const aiResponse = generateMockResponse(content);
      await saveMessage('assistant', aiResponse);
    }, 1000);
  };

  // Update session title
  const updateSessionTitle = async (sessionId: string, newTitle: string) => {
    try {
      const { error } = await supabase
        .from('chat_sessions')
        .update({ title: newTitle })
        .eq('id', sessionId);

      if (error) throw error;
      
      setSessions(prev => prev.map(s => 
        s.id === sessionId ? { ...s, title: newTitle } : s
      ));
      
      if (currentSession?.id === sessionId) {
        setCurrentSession(prev => prev ? { ...prev, title: newTitle } : null);
      }
    } catch (err) {
      console.error('Error updating session title:', err);
      setError('Failed to update session title');
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
    saveStatus,
    setCurrentSession,
    loadMessages,
    loadSession,
    createSession,
    sendMessage,
    saveMessage,
    updateSessionTitle,
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
