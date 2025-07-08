
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import { useToast } from '@/hooks/use-toast';

export interface ChatSession {
  id: string;
  title: string;
  topic: string;
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
  }>;
  created_at: string;
  updated_at: string;
}

export const useChatHistory = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch chat sessions
  const {
    data: chatSessions = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['chat_sessions', user?.user_id],
    queryFn: async () => {
      if (!user?.user_id) return [];
      
      const { data, error } = await supabase
        .from('chat_sessions')
        .select('*')
        .eq('user_id', user.user_id)
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Error fetching chat sessions:', error);
        throw error;
      }

      // Transform the data to match our ChatSession interface
      return (data || []).map(session => ({
        ...session,
        messages: Array.isArray(session.messages) 
          ? session.messages.map((msg: any) => ({
              role: msg.role as 'user' | 'assistant',
              content: msg.content || '',
              timestamp: msg.timestamp || new Date().toISOString()
            }))
          : []
      })) as ChatSession[];
    },
    enabled: !!user?.user_id,
  });

  // Save chat session
  const saveChatSession = useMutation({
    mutationFn: async (sessionData: Omit<ChatSession, 'id' | 'created_at' | 'updated_at'>) => {
      if (!user?.user_id) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('chat_sessions')
        .insert([{
          ...sessionData,
          user_id: user.user_id,
        }])
        .select()
        .single();

      if (error) {
        console.error('Error saving chat session:', error);
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat_sessions'] });
      toast({
        title: "Chat Saved",
        description: "Your chat session has been saved successfully.",
      });
    },
    onError: (error) => {
      console.error('Error saving chat session:', error);
      toast({
        title: "Error",
        description: "Failed to save chat session. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Update chat session
  const updateChatSession = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<ChatSession> }) => {
      const { data, error } = await supabase
        .from('chat_sessions')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat_sessions'] });
    },
  });

  // Delete chat session
  const deleteChatSession = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('chat_sessions')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat_sessions'] });
      toast({
        title: "Chat Deleted",
        description: "Chat session has been removed successfully.",
      });
    },
  });

  return {
    chatSessions,
    isLoading,
    error,
    saveChatSession: saveChatSession.mutate,
    updateChatSession: updateChatSession.mutate,
    deleteChatSession: deleteChatSession.mutate,
    isSaving: saveChatSession.isPending,
    isUpdating: updateChatSession.isPending,
    isDeleting: deleteChatSession.isPending,
  };
};
