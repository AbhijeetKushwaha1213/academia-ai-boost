
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Play, 
  Pause, 
  Square, 
  RotateCcw, 
  Clock,
  BookOpen,
  Video,
  ExternalLink,
  MessageCircle,
  FileText
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AIChat } from '../chat/AIChat';

interface StudySessionPageProps {
  subject?: string;
  topic?: string;
  onBack?: () => void;
}

export const StudySessionPage = ({ 
  subject = "Chemistry", 
  topic = "Organic Reactions",
  onBack 
}: StudySessionPageProps) => {
  const { toast } = useToast();
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [totalTime] = useState(25 * 60);
  const [showChat, setShowChat] = useState(false);

  // Pomodoro timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      toast({
        title: "Session Complete! 🎉",
        description: "Great job! Take a 5-minute break.",
      });
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, toast]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    setIsRunning(true);
    toast({
      title: "Session Started! 🚀",
      description: "Focus time! You've got this!",
    });
  };

  const handlePause = () => {
    setIsRunning(false);
    toast({
      title: "Session Paused ⏸️",
      description: "Take your time, resume when ready.",
    });
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(totalTime);
    toast({
      title: "Session Reset 🔄",
      description: "Timer reset to 25 minutes.",
    });
  };

  const progress = ((totalTime - timeLeft) / totalTime) * 100;

  const resources = [
    { type: 'pdf', name: 'Organic Chemistry Notes.pdf', icon: FileText },
    { type: 'video', name: 'SN1 vs SN2 Mechanisms', icon: Video },
    { type: 'link', name: 'Khan Academy - Organic Reactions', icon: ExternalLink },
    { type: 'pdf', name: 'Practice Problems Set 3.pdf', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <Button variant="ghost" onClick={onBack} className="mb-2">
              ← Back to Dashboard
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">{subject} Study Session</h1>
            <p className="text-gray-600">{topic}</p>
          </div>
          <Badge className="bg-blue-100 text-blue-800 text-lg px-4 py-2">
            Active Session
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Session Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Pomodoro Timer */}
            <Card className="p-8 text-center">
              <div className="mb-6">
                <Clock className="w-16 h-16 mx-auto mb-4 text-indigo-600" />
                <div className="text-6xl font-bold text-gray-900 mb-2">
                  {formatTime(timeLeft)}
                </div>
                <Progress value={progress} className="h-3 mb-4" />
                <p className="text-gray-600">
                  {isRunning ? 'Focus time! Stay concentrated.' : 'Ready to start your session?'}
                </p>
              </div>

              <div className="flex justify-center space-x-4">
                {!isRunning ? (
                  <Button onClick={handleStart} className="bg-green-600 hover:bg-green-700">
                    <Play className="w-4 h-4 mr-2" />
                    Start
                  </Button>
                ) : (
                  <Button onClick={handlePause} variant="outline">
                    <Pause className="w-4 h-4 mr-2" />
                    Pause
                  </Button>
                )}
                
                <Button onClick={handleReset} variant="outline">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              </div>
            </Card>

            {/* Session Resources */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Session Resources</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {resources.map((resource, index) => (
                  <div 
                    key={index}
                    className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => toast({ 
                      title: "Opening Resource", 
                      description: `Opening ${resource.name}` 
                    })}
                  >
                    <resource.icon className="w-5 h-5 mr-3 text-gray-600" />
                    <span className="flex-1 text-sm font-medium">{resource.name}</span>
                    <ExternalLink className="w-4 h-4 text-gray-400" />
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* Chat Toggle */}
            <Card className="p-4">
              <Button 
                onClick={() => setShowChat(!showChat)}
                className="w-full"
                variant={showChat ? "default" : "outline"}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                {showChat ? 'Hide AI Assistant' : 'Show AI Assistant'}
              </Button>
            </Card>

            {/* AI Chat Panel */}
            {showChat && (
              <Card className="p-4 h-96">
                <h4 className="font-semibold mb-4">AI Study Assistant</h4>
                <ScrollArea className="h-full">
                  <div className="space-y-3">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-sm">How can I help you with {topic} today?</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm">Ask me about SN1 vs SN2 mechanisms, reaction conditions, or practice problems!</p>
                    </div>
                  </div>
                </ScrollArea>
              </Card>
            )}

            {/* Session Stats */}
            <Card className="p-4">
              <h4 className="font-semibold mb-3">Today's Progress</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Sessions Completed</span>
                  <span className="font-medium">2/4</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Focus Time</span>
                  <span className="font-medium">1h 30m</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Topics Covered</span>
                  <span className="font-medium">3</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
