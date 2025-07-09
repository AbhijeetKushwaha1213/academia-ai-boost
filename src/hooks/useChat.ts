import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { ChatMessage, ChatSession } from '../types/user';
import { useAuth } from './useAuth';

export const useChat = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  useEffect(() => {
    if (user) {
      fetchSessions();
    }
  }, [user]);

  const fetchSessions = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('chat_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setSessions(data || []);
    } catch (error) {
      console.error('Error fetching sessions:', error);
    }
  };

  const createSession = async (title: string = 'New Chat') => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('chat_sessions')
        .insert({
          user_id: user.id,
          title
        })
        .select()
        .single();

      if (error) throw error;

      setSessions(prev => [data, ...prev]);
      setCurrentSession(data);
      setMessages([]);
      return data;
    } catch (error) {
      console.error('Error creating session:', error);
      return null;
    }
  };

  const loadSession = async (sessionId: string) => {
    if (!user) return;

    try {
      // Get session details
      const { data: session, error: sessionError } = await supabase
        .from('chat_sessions')
        .select('*')
        .eq('id', sessionId)
        .single();

      if (sessionError) throw sessionError;

      // Get messages for this session
      const { data: messages, error: messagesError } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });

      if (messagesError) throw messagesError;

      setCurrentSession(session);
      setMessages(messages || []);
    } catch (error) {
      console.error('Error loading session:', error);
    }
  };

  const saveMessage = async (role: 'user' | 'assistant', content: string) => {
    if (!user || !currentSession) return null;

    setSaveStatus('saving');

    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .insert({
          user_id: user.id,
          session_id: currentSession.id,
          role,
          content
        })
        .select()
        .single();

      if (error) throw error;

      setMessages(prev => [...prev, data]);
      setSaveStatus('saved');
      
      // Update session timestamp
      await supabase
        .from('chat_sessions')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', currentSession.id);

      // Reset save status after 2 seconds
      setTimeout(() => setSaveStatus('idle'), 2000);

      return data;
    } catch (error) {
      console.error('Error saving message:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 2000);
      return null;
    }
  };

  const deleteSession = async (sessionId: string) => {
    if (!user) return;

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
    } catch (error) {
      console.error('Error deleting session:', error);
    }
  };

  const updateSessionTitle = async (sessionId: string, title: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('chat_sessions')
        .update({ title })
        .eq('id', sessionId);

      if (error) throw error;

      setSessions(prev => prev.map(s => 
        s.id === sessionId ? { ...s, title } : s
      ));

      if (currentSession?.id === sessionId) {
        setCurrentSession(prev => prev ? { ...prev, title } : null);
      }
    } catch (error) {
      console.error('Error updating session title:', error);
    }
  };

  return {
    sessions,
    currentSession,
    messages,
    loading,
    saveStatus,
    createSession,
    loadSession,
    saveMessage,
    deleteSession,
    updateSessionTitle,
    fetchSessions
  };
};