import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '../../hooks/useChat';
import { Send, Plus, MessageCircle, Trash2, Edit2, Check, X } from 'lucide-react';

const ChatInterface: React.FC = () => {
  const { 
    sessions, 
    currentSession, 
    messages, 
    saveStatus,
    createSession, 
    loadSession, 
    saveMessage, 
    deleteSession,
    updateSessionTitle
  } = useChat();
  
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [editingSession, setEditingSession] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    let session = currentSession;
    if (!session) {
      session = await createSession();
      if (!session) return;
    }

    const userMessage = input.trim();
    setInput('');
    setIsTyping(true);

    // Save user message
    await saveMessage('user', userMessage);

    // Simulate AI response (replace with actual AI integration)
    setTimeout(async () => {
      const aiResponse = `I understand you said: "${userMessage}". This is a simulated AI response. Please integrate with your actual AI service.`;
      await saveMessage('assistant', aiResponse);
      setIsTyping(false);
    }, 1000);
  };

  const handleNewChat = async () => {
    await createSession();
  };

  const handleDeleteSession = async (sessionId: string) => {
    if (window.confirm('Are you sure you want to delete this chat?')) {
      await deleteSession(sessionId);
    }
  };

  const handleEditSessionTitle = (sessionId: string, currentTitle: string) => {
    setEditingSession(sessionId);
    setEditTitle(currentTitle);
  };

  const handleSaveTitle = async (sessionId: string) => {
    await updateSessionTitle(sessionId, editTitle);
    setEditingSession(null);
    setEditTitle('');
  };

  const handleCancelEdit = () => {
    setEditingSession(null);
    setEditTitle('');
  };

  const getSaveStatusIcon = () => {
    switch (saveStatus) {
      case 'saving':
        return <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full" />;
      case 'saved':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'error':
        return <X className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <button
            onClick={handleNewChat}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            New Chat
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Recent Chats</h3>
          <div className="space-y-2">
            {sessions.map((session) => (
              <div
                key={session.id}
                className={`group p-3 rounded-lg cursor-pointer transition-colors ${
                  currentSession?.id === session.id
                    ? 'bg-blue-50 border border-blue-200'
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => loadSession(session.id)}
              >
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 text-gray-400" />
                  {editingSession === session.id ? (
                    <div className="flex-1 flex items-center gap-2">
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleSaveTitle(session.id);
                          }
                        }}
                        autoFocus
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSaveTitle(session.id);
                        }}
                        className="p-1 text-green-600 hover:bg-green-50 rounded"
                      >
                        <Check className="h-3 w-3" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCancelEdit();
                        }}
                        className="p-1 text-gray-600 hover:bg-gray-50 rounded"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className="flex-1 text-sm font-medium text-gray-900 truncate">
                        {session.title}
                      </span>
                      <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditSessionTitle(session.id, session.title);
                          }}
                          className="p-1 text-gray-500 hover:bg-gray-100 rounded"
                        >
                          <Edit2 className="h-3 w-3" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteSession(session.id);
                          }}
                          className="p-1 text-red-500 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {new Date(session.updated_at).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {currentSession?.title || 'AI Study Assistant'}
            </h2>
            <p className="text-sm text-gray-500">
              Ask me anything about your studies
            </p>
          </div>
          <div className="flex items-center gap-2">
            {getSaveStatusIcon()}
            {saveStatus === 'saved' && (
              <span className="text-sm text-green-600">Chat Saved</span>
            )}
            {saveStatus === 'error' && (
              <span className="text-sm text-red-600">Save Failed</span>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-900'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p className="text-xs mt-1 opacity-70">
                  {new Date(message.created_at).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-200 text-gray-900 max-w-xs lg:max-w-md px-4 py-2 rounded-lg">
                <div className="flex items-center gap-1">
                  <div className="animate-pulse">AI is typing</div>
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="bg-white border-t border-gray-200 p-4">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;