
import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, Send, User, Trash2, BookOpen, Target, Lightbulb, Zap, Loader2 } from 'lucide-react';
import { useAIAssistant } from '@/hooks/useAIAssistant';
import { useAuth } from '@/components/auth/AuthProvider';
import { useToast } from '@/hooks/use-toast';

const quickPrompts = [
  {
    icon: Target,
    text: "What should I study next?",
    color: "from-blue-500 to-indigo-600"
  },
  {
    icon: BookOpen, 
    text: "Explain this concept to me",
    color: "from-green-500 to-teal-600"
  },
  {
    icon: Lightbulb,
    text: "Give me study tips",
    color: "from-purple-500 to-pink-600"
  },
  {
    icon: Zap,
    text: "Create a study plan",
    color: "from-orange-500 to-red-600"
  }
];

export const AIChat = () => {
  const { user } = useAuth();
  const { messages, sendMessage, clearChat, isLoading } = useAIAssistant();
  const { toast } = useToast();
  const [inputMessage, setInputMessage] = useState('');
  const [subject, setSubject] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    
    try {
      console.log('AIChat: Sending message:', inputMessage);
      await sendMessage(inputMessage, subject);
      setInputMessage('');
    } catch (error) {
      console.error('AIChat: Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleQuickPrompt = async (prompt: string) => {
    try {
      console.log('AIChat: Sending quick prompt:', prompt);
      await sendMessage(prompt, subject);
    } catch (error) {
      console.error('AIChat: Error sending quick prompt:', error);
      toast({
        title: "Error", 
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Bot className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">AI Study Assistant</h2>
        <p className="text-gray-600">Get personalized help with your studies</p>
        <Badge className="mt-2 bg-green-100 text-green-800 hover:bg-green-100">
          {user?.userType === 'exam' ? 'Exam Mode' : 'College Mode'}
        </Badge>
      </div>

      {/* Subject Input */}
      <Card className="p-4">
        <label className="text-sm font-medium text-gray-700 mb-2 block">
          Current Subject (Optional)
        </label>
        <Input
          placeholder="e.g., Physics, Mathematics, History..."
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
      </Card>

      {/* Quick Prompts */}
      {messages.length === 0 && (
        <div className="grid grid-cols-2 gap-3">
          {quickPrompts.map((prompt, index) => (
            <Card 
              key={index} 
              className="p-4 cursor-pointer hover:shadow-md transition-all duration-200 transform hover:-translate-y-1"
              onClick={() => handleQuickPrompt(prompt.text)}
            >
              <div className={`w-8 h-8 bg-gradient-to-br ${prompt.color} rounded-lg flex items-center justify-center mb-2`}>
                <prompt.icon className="w-4 h-4 text-white" />
              </div>
              <p className="text-sm font-medium text-gray-900">{prompt.text}</p>
            </Card>
          ))}
        </div>
      )}

      {/* Chat Messages */}
      {messages.length > 0 && (
        <Card className="flex flex-col h-96">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="font-semibold text-gray-900">Chat History</h3>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearChat}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear
            </Button>
          </div>
          
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex max-w-xs lg:max-w-md ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start space-x-2`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      message.role === 'user' 
                        ? 'bg-indigo-600' 
                        : 'bg-gradient-to-br from-indigo-600 to-purple-600'
                    }`}>
                      {message.role === 'user' ? (
                        <User className="w-4 h-4 text-white" />
                      ) : (
                        <Bot className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <div className={`px-4 py-3 rounded-2xl ${
                      message.role === 'user'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        message.role === 'user' ? 'text-indigo-200' : 'text-gray-500'
                      }`}>
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex items-start space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-gray-100 px-4 py-3 rounded-2xl">
                      <div className="flex items-center space-x-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-sm text-gray-600">AI is thinking...</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div ref={messagesEndRef} />
          </ScrollArea>
        </Card>
      )}

      {/* Message Input */}
      <Card className="p-4">
        <div className="flex space-x-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about your studies..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button 
            onClick={handleSendMessage}
            disabled={isLoading || !inputMessage.trim()}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
};
