
import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Bot, User, Loader2, Maximize2, Minimize2, Save, History } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useChatHistory, ChatSession } from '@/hooks/useChatHistory';
import { ChatHistoryPanel } from './ChatHistoryPanel';
import { format } from 'date-fns';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface AIChatProps {
  context?: string;
  placeholder?: string;
  className?: string;
  expandable?: boolean;
}

export const AIChat = ({ 
  context = "study assistant", 
  placeholder = "Ask me anything about your studies...",
  className = "",
  expandable = false
}: AIChatProps) => {
  const { toast } = useToast();
  const { saveChatSession } = useChatHistory();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: `Hi! I'm your AI ${context}. How can I help you today?`,
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [currentTopic, setCurrentTopic] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    // Set topic if not already set
    if (!currentTopic) {
      setCurrentTopic(input.trim());
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('ai-assistant', {
        body: {
          message: input.trim(),
          context: context,
          conversationHistory: messages.slice(-10)
        }
      });

      if (error) {
        console.error('AI Assistant Error:', error);
        throw error;
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response || "I'm sorry, I couldn't process your request right now.",
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error calling AI assistant:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, I'm having trouble connecting right now. Please try again later.",
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "Connection Error",
        description: "Unable to reach AI assistant. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSession = () => {
    if (messages.length <= 1) {
      toast({
        title: "Nothing to Save",
        description: "Start a conversation to save your chat session.",
        variant: "destructive",
      });
      return;
    }

    try {
      const sessionData = {
        title: currentTopic || `Chat ${format(new Date(), 'MMM dd, HH:mm')}`,
        topic: currentTopic || 'General',
        messages: messages.slice(1).map(msg => ({
          role: msg.sender === 'user' ? 'user' as const : 'assistant' as const,
          content: msg.text,
          timestamp: msg.timestamp.toISOString()
        }))
      };

      console.log('AIChat: Saving chat session:', sessionData);
      saveChatSession(sessionData);
    } catch (error) {
      console.error('AIChat: Error saving session:', error);
      toast({
        title: "Save Failed",
        description: "Failed to save chat session. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSelectSession = (session: ChatSession) => {
    setMessages([
      {
        id: '1',
        text: `Hi! I'm your AI ${context}. How can I help you today?`,
        sender: 'ai',
        timestamp: new Date()
      },
      ...session.messages.map((msg, index) => ({
        id: `${index + 2}`,
        text: msg.content,
        sender: msg.role === 'user' ? 'user' as const : 'ai' as const,
        timestamp: new Date(msg.timestamp)
      }))
    ]);
    setCurrentTopic(session.topic);
    setShowHistory(false);
  };

  const handleNewChat = () => {
    setMessages([
      {
        id: '1',
        text: `Hi! I'm your AI ${context}. How can I help you today?`,
        sender: 'ai',
        timestamp: new Date()
      }
    ]);
    setCurrentTopic('');
    setShowHistory(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const chatHeight = isExpanded ? 'h-[80vh]' : 'h-64';

  return (
    <Card className={`flex flex-col ${chatHeight} ${className}`}>
      <div className="p-4 border-b flex items-center justify-between">
        <h3 className="font-semibold flex items-center">
          <Bot className="w-5 h-5 mr-2 text-blue-600" />
          AI {context.charAt(0).toUpperCase() + context.slice(1)}
        </h3>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowHistory(!showHistory)}
            className="text-gray-600"
          >
            <History className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSaveSession}
            className="text-gray-600"
          >
            <Save className="w-4 h-4" />
          </Button>
          {expandable && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-gray-600"
            >
              {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </Button>
          )}
        </div>
      </div>

      {showHistory ? (
        <div className="flex-1 p-4">
          <ChatHistoryPanel
            onSelectSession={handleSelectSession}
            onNewChat={handleNewChat}
          />
        </div>
      ) : (
        <>
          <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.sender === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      {message.sender === 'ai' && (
                        <Bot className="w-4 h-4 mt-0.5 text-blue-600" />
                      )}
                      {message.sender === 'user' && (
                        <User className="w-4 h-4 mt-0.5 text-white" />
                      )}
                      <div className="flex-1">
                        <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                        <p className={`text-xs mt-1 ${
                          message.sender === 'user' ? 'text-blue-200' : 'text-gray-500'
                        }`}>
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-900 rounded-lg p-3 max-w-[80%]">
                    <div className="flex items-center space-x-2">
                      <Bot className="w-4 h-4 text-blue-600" />
                      <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                      <span className="text-sm">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="p-4 border-t">
            <div className="flex space-x-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={placeholder}
                disabled={isLoading}
                className="flex-1"
              />
              <Button 
                onClick={handleSendMessage} 
                disabled={!input.trim() || isLoading}
                size="sm"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </>
      )}
    </Card>
  );
};
