
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
      
      console.log('Fetching chat sessions for user:', user.user_id);
      
      const { data, error } = await supabase
        .from('chat_sessions')
        .select('*')
        .eq('user_id', user.user_id)
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Error fetching chat sessions:', error);
        throw error;
      }

      console.log('Fetched chat sessions:', data);

      // Transform the data to match our ChatSession interface
      return (data || []).map(session => {
        let parsedMessages = [];
        
        try {
          // Handle both array and object formats from the database
          if (Array.isArray(session.messages)) {
            parsedMessages = session.messages.map((msg: any) => ({
              role: (msg.role === 'user' || msg.role === 'assistant') ? msg.role : 'user',
              content: String(msg.content || ''),
              timestamp: msg.timestamp || new Date().toISOString()
            }));
          } else if (session.messages && typeof session.messages === 'object') {
            // Handle case where messages might be stored as an object
            parsedMessages = [];
          }
        } catch (e) {
          console.error('Error parsing messages for session:', session.id, e);
          parsedMessages = [];
        }

        return {
          id: session.id,
          title: session.title,
          topic: session.topic,
          messages: parsedMessages,
          created_at: session.created_at,
          updated_at: session.updated_at
        } as ChatSession;
      });
    },
    enabled: !!user?.user_id,
  });

  // Save chat session
  const saveChatSession = useMutation({
    mutationFn: async (sessionData: Omit<ChatSession, 'id' | 'created_at' | 'updated_at'>) => {
      if (!user?.user_id) {
        throw new Error('User not authenticated');
      }

      console.log('Saving chat session:', sessionData);

      const { data, error } = await supabase
        .from('chat_sessions')
        .insert([{
          title: sessionData.title,
          topic: sessionData.topic,
          messages: sessionData.messages,
          user_id: user.user_id,
        }])
        .select()
        .single();

      if (error) {
        console.error('Error saving chat session:', error);
        throw error;
      }

      console.log('Chat session saved successfully:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat_sessions'] });
      toast({
        title: "Chat Saved ✅",
        description: "Your conversation has been saved successfully.",
      });
    },
    onError: (error) => {
      console.error('Error saving chat session:', error);
      toast({
        title: "Save Failed ❌",
        description: "Failed to save chat session. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Update chat session
  const updateChatSession = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<ChatSession> }) => {
      console.log('Updating chat session:', id, updates);

      const { data, error } = await supabase
        .from('chat_sessions')
        .update({
          title: updates.title,
          topic: updates.topic,
          messages: updates.messages,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating chat session:', error);
        throw error;
      }

      console.log('Chat session updated successfully:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat_sessions'] });
      toast({
        title: "Chat Updated ✅",
        description: "Your conversation has been updated.",
      });
    },
    onError: (error) => {
      console.error('Error updating chat session:', error);
      toast({
        title: "Update Failed ❌",
        description: "Failed to update chat session.",
        variant: "destructive",
      });
    },
  });

  // Delete chat session
  const deleteChatSession = useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting chat session:', id);

      const { error } = await supabase
        .from('chat_sessions')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting chat session:', error);
        throw error;
      }

      console.log('Chat session deleted successfully');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat_sessions'] });
      toast({
        title: "Chat Deleted ✅",
        description: "Chat session has been removed successfully.",
      });
    },
    onError: (error) => {
      console.error('Error deleting chat session:', error);
      toast({
        title: "Delete Failed ❌",
        description: "Failed to delete chat session.",
        variant: "destructive",
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
