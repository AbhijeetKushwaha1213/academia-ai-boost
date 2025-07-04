
import React, { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
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
  FileText,
  Upload,
  Plus,
  Settings,
  Target,
  Eye,
  Download,
  Tag,
  StickyNote,
  Music,
  Volume2,
  VolumeOff,
  Timer,
  TrendingUp,
  Brain,
  CheckCircle,
  Code,
  Github,
  Linkedin
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AIChat } from '../chat/AIChat';

interface StudySessionPageProps {
  subject?: string;
  topic?: string;
  onBack?: () => void;
}

interface Resource {
  id: string;
  name: string;
  type: 'pdf' | 'video' | 'link' | 'notes' | 'ppt' | 'doc';
  category: string;
  tags: string[];
  url?: string;
  file?: File;
}

interface SessionNote {
  id: string;
  content: string;
  timestamp: Date;
  type: 'understanding' | 'difficulty' | 'important';
}

const TIMER_PRESETS = [
  { label: '5 minutes', value: 5 },
  { label: '15 minutes', value: 15 },
  { label: '25 minutes (Pomodoro)', value: 25 },
  { label: '45 minutes', value: 45 },
  { label: '60 minutes', value: 60 },
  { label: 'Custom', value: 0 }
];

const BREAK_PRESETS = [
  { label: '5 minutes', value: 5 },
  { label: '10 minutes', value: 10 },
  { label: '15 minutes', value: 15 },
  { label: 'Custom', value: 0 }
];

export const StudySessionPage = ({ 
  subject = "React Development", 
  topic = "Portfolio Website",
  onBack 
}: StudySessionPageProps) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Timer states
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [totalTime, setTotalTime] = useState(25 * 60);
  const [customTime, setCustomTime] = useState(25);
  const [breakTime, setBreakTime] = useState(5);
  const [isBreak, setIsBreak] = useState(false);
  const [autoMode, setAutoMode] = useState(false);
  const [showTimerSettings, setShowTimerSettings] = useState(false);
  
  // Session states
  const [showChat, setShowChat] = useState(true);
  const [resources, setResources] = useState<Resource[]>([
    { id: '1', name: 'React Documentation', type: 'link', category: 'Docs', tags: ['react', 'frontend'], url: 'https://react.dev' },
    { id: '2', name: 'Portfolio Design Tutorial', type: 'video', category: 'Tutorial', tags: ['design', 'portfolio'], url: '#' },
    { id: '3', name: 'Component Architecture Guide', type: 'pdf', category: 'Guide', tags: ['architecture', 'components'], url: '#' },
    { id: '4', name: 'Deployment Checklist', type: 'notes', category: 'Notes', tags: ['deployment', 'checklist'], url: '#' },
  ]);
  
  // Notes states
  const [notes, setNotes] = useState<SessionNote[]>([]);
  const [currentNote, setCurrentNote] = useState('');
  const [noteType, setNoteType] = useState<'understanding' | 'difficulty' | 'important'>('understanding');
  
  // Session metrics
  const [sessionStartTime] = useState(new Date());
  const [totalFocusTime, setTotalFocusTime] = useState(90);
  const [sessionsCompleted, setSessionsCompleted] = useState(2);
  const [resourcesOpened, setResourcesOpened] = useState(3);
  const [topicsCovered, setTopicsCovered] = useState(1);
  
  // Ambient sound
  const [ambientSound, setAmbientSound] = useState<'none' | 'rain' | 'lofi' | 'nature'>('none');
  const [soundEnabled, setSoundEnabled] = useState(false);
  
  // Session objective
  const [sessionObjective] = useState(`Build and deploy ${topic} with modern React practices`);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      if (isBreak) {
        setIsBreak(false);
        if (autoMode) {
          setTimeLeft(totalTime);
          setIsRunning(true);
        }
        toast({
          title: "Break Complete! 🎯",
          description: "Time to get back to coding!",
        });
      } else {
        setSessionsCompleted(prev => prev + 1);
        setTopicsCovered(prev => prev + 1);
        if (autoMode) {
          setIsBreak(true);
          setTimeLeft(breakTime * 60);
          setIsRunning(true);
        }
        toast({
          title: "Session Complete! 🎉",
          description: autoMode ? "Starting break time..." : "Great job! Take a break.",
        });
      }
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, isBreak, autoMode, totalTime, breakTime, toast]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleTimerPreset = (minutes: number) => {
    if (minutes === 0) return;
    setTotalTime(minutes * 60);
    setTimeLeft(minutes * 60);
    setCustomTime(minutes);
  };

  const handleCustomTime = () => {
    const seconds = customTime * 60;
    setTotalTime(seconds);
    setTimeLeft(seconds);
  };

  const handleStart = () => {
    setIsRunning(true);
    toast({
      title: `${isBreak ? 'Break' : 'Focus'} Started! 🚀`,
      description: isBreak ? "Enjoy your break!" : "Focus time! Let's build something amazing!",
    });
  };

  const handlePause = () => {
    setIsRunning(false);
    toast({
      title: "Timer Paused ⏸️",
      description: "Take your time, resume when ready.",
    });
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(isBreak ? breakTime * 60 : totalTime);
    toast({
      title: "Timer Reset 🔄",
      description: `Timer reset to ${isBreak ? breakTime : Math.floor(totalTime / 60)} minutes.`,
    });
  };

  const handleStop = () => {
    setIsRunning(false);
    setIsBreak(false);
    setTimeLeft(totalTime);
    generateSessionSummary();
  };

  const handleResourceUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const newResource: Resource = {
          id: Date.now().toString() + Math.random(),
          name: file.name,
          type: getFileType(file.name),
          category: 'Uploaded',
          tags: ['uploaded', subject.toLowerCase()],
          file
        };
        setResources(prev => [...prev, newResource]);
      });
      toast({
        title: "Files Uploaded! 📁",
        description: `Added ${files.length} file(s) to resources.`,
      });
    }
  };

  const getFileType = (filename: string): Resource['type'] => {
    const ext = filename.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'pdf': return 'pdf';
      case 'mp4': case 'avi': case 'mov': return 'video';
      case 'ppt': case 'pptx': return 'ppt';
      case 'doc': case 'docx': return 'doc';
      case 'txt': case 'md': return 'notes';
      default: return 'pdf';
    }
  };

  const addNote = () => {
    if (!currentNote.trim()) return;
    
    const newNote: SessionNote = {
      id: Date.now().toString(),
      content: currentNote.trim(),
      timestamp: new Date(),
      type: noteType
    };
    
    setNotes(prev => [...prev, newNote]);
    setCurrentNote('');
    toast({
      title: "Note Saved! 📝",
      description: "Your session note has been saved.",
    });
  };

  const handleResourceOpen = (resource: Resource) => {
    setResourcesOpened(prev => prev + 1);
    toast({
      title: "Opening Resource 👀",
      description: `Opening ${resource.name}`,
    });
  };

  const generateSessionSummary = () => {
    const duration = Math.floor((new Date().getTime() - sessionStartTime.getTime()) / 60000);
    toast({
      title: "Session Summary 📊",
      description: `Duration: ${duration}m | Resources: ${resourcesOpened} | Notes: ${notes.length}`,
    });
  };

  const progress = isBreak 
    ? ((breakTime * 60 - timeLeft) / (breakTime * 60)) * 100
    : ((totalTime - timeLeft) / totalTime) * 100;

  const getResourceIcon = (type: Resource['type']) => {
    switch (type) {
      case 'pdf': return FileText;
      case 'video': return Video;
      case 'link': return ExternalLink;
      case 'notes': return StickyNote;
      case 'ppt': return FileText;
      case 'doc': return FileText;
      default: return FileText;
    }
  };

  const getNoteColor = (type: SessionNote['type']) => {
    switch (type) {
      case 'understanding': return 'bg-green-500/10 border-green-500/20 text-green-300';
      case 'difficulty': return 'bg-red-500/10 border-red-500/20 text-red-300';
      case 'important': return 'bg-yellow-500/10 border-yellow-500/20 text-yellow-300';
    }
  };

  const openVSCode = () => {
    window.open("vscode://file/your-project-path", "_blank");
  };

  const openGitHub = () => {
    window.open("https://github.com", "_blank");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onBack}
              className="text-gray-400 hover:text-white"
            >
              ← Back to Dashboard
            </Button>
            <h1 className="text-xl font-semibold">DevFocus Dashboard</h1>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6 p-6">
        {/* Main Content Area */}
        <div className="col-span-3 space-y-6">
          {/* Project Header */}
          <Card className="bg-gray-800 border-gray-700">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-semibold text-white mb-1">{topic}</h2>
                  <p className="text-gray-400">{subject} · Due in 2 days</p>
                </div>
                <div className="flex items-center gap-3">
                  {/* Quick Action Buttons */}
                  <Button onClick={openVSCode} variant="outline" size="sm" className="flex items-center gap-2 bg-blue-600/20 border-blue-500/30 text-blue-300 hover:bg-blue-600/30">
                    <Code className="w-4 h-4" />
                    VS Code
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                  <Button onClick={openGitHub} variant="outline" size="sm" className="flex items-center gap-2 bg-gray-600/20 border-gray-500/30 text-gray-300 hover:bg-gray-600/30">
                    <Github className="w-4 h-4" />
                    GitHub
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center gap-2 bg-green-600/20 border-green-500/30 text-green-300 hover:bg-green-600/30">
                    <ExternalLink className="w-4 h-4" />
                    LeetCode
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center gap-2 bg-orange-600/20 border-orange-500/30 text-orange-300 hover:bg-orange-600/30">
                    <Target className="w-4 h-4" />
                    HackerRank
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center gap-2 bg-blue-600/20 border-blue-500/30 text-blue-300 hover:bg-blue-600/30">
                    <Linkedin className="w-4 h-4" />
                    LinkedIn
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                </div>
              </div>

              {/* Timer Section */}
              <div className="flex items-center gap-6 mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="text-purple-400 w-6 h-6" />
                  <span className="text-3xl font-bold">{formatTime(timeLeft)}</span>
                </div>
                <div className="flex gap-3">
                  {!isRunning ? (
                    <Button onClick={handleStart} className="bg-green-600 hover:bg-green-700">
                      <Play className="w-4 h-4 mr-2" />
                      Start
                    </Button>
                  ) : (
                    <Button onClick={handlePause} variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                      <Pause className="w-4 h-4 mr-2" />
                      Pause
                    </Button>
                  )}
                  <Button onClick={handleReset} variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset
                  </Button>
                </div>
              </div>

              <Progress value={progress} className="h-2 bg-gray-700" />
            </div>
          </Card>

          {/* Main Tabs Area */}
          <Card className="bg-gray-800 border-gray-700">
            <Tabs defaultValue="terminal" className="w-full">
              <div className="border-b border-gray-700">
                <TabsList className="bg-transparent border-0 p-0">
                  <TabsTrigger 
                    value="terminal" 
                    className="data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-400 border-0 rounded-none px-6 py-3"
                  >
                    Terminal
                  </TabsTrigger>
                  <TabsTrigger 
                    value="resources" 
                    className="data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-400 border-0 rounded-none px-6 py-3"
                  >
                    Resources
                  </TabsTrigger>
                  <TabsTrigger 
                    value="editor" 
                    className="data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-400 border-0 rounded-none px-6 py-3"
                  >
                    Code Editor
                  </TabsTrigger>
                  <TabsTrigger 
                    value="practice" 
                    className="data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-400 border-0 rounded-none px-6 py-3"
                  >
                    Practice
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="terminal" className="p-6">
                <div className="bg-black rounded-lg p-4 font-mono text-sm">
                  <div className="text-green-400 mb-4">
                    <p>$ npm start</p>
                    <p className="text-gray-400">Launching dev server...</p>
                    <p className="text-green-400">✓ Project running at localhost:3000</p>
                  </div>
                  <div className="flex items-center">
                    <span className="text-green-400 mr-2">$</span>
                    <input 
                      type="text"
                      placeholder="Enter command..."
                      className="bg-transparent border-none outline-none text-white flex-1"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="resources" className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Project Resources</h3>
                    <Button variant="outline" size="sm" onClick={handleResourceUpload} className="border-gray-600 text-gray-300">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Files
                    </Button>
                  </div>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.mp4,.avi,.mov"
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {resources.map((resource) => {
                      const IconComponent = getResourceIcon(resource.type);
                      return (
                        <div 
                          key={resource.id}
                          className="flex items-center p-3 bg-gray-700/50 border border-gray-600 rounded-lg hover:bg-gray-700 cursor-pointer transition-colors"
                          onClick={() => handleResourceOpen(resource)}
                        >
                          <div className="p-2 bg-blue-600/20 rounded-lg mr-3">
                            <IconComponent className="w-4 h-4 text-blue-400" />
                          </div>
                          <div className="flex-1">
                            <span className="font-medium text-white block">{resource.name}</span>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant="secondary" className="text-xs bg-gray-600 text-gray-300">{resource.category}</Badge>
                              {resource.tags.slice(0, 2).map(tag => (
                                <Badge key={tag} variant="outline" className="text-xs border-gray-600 text-gray-400">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="editor" className="p-6">
                <div className="bg-gray-900 rounded-lg p-4 min-h-64 border border-gray-700">
                  <p className="text-gray-500">Code editor integration coming soon...</p>
                </div>
              </TabsContent>

              <TabsContent value="practice" className="p-6">
                <div className="text-center py-12">
                  <p className="text-gray-500">Practice problems and exercises will appear here</p>
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card className="bg-gray-800 border-gray-700">
            <div className="p-4">
              <h3 className="font-medium mb-3 text-white">Quick Actions</h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gray-700">
                  View Progress
                </Button>
                <Button variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gray-700">
                  Submit Update
                </Button>
                <Button className="w-full bg-red-600 hover:bg-red-700">
                  Mark as Complete
                </Button>
              </div>
            </div>
          </Card>

          {/* AI Assistant */}
          <Card className="bg-gray-800 border-gray-700">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium flex items-center text-white">
                  <Brain className="w-4 h-4 mr-2 text-blue-400" />
                  AI Assistant
                </h4>
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-blue-400 mb-2">How can I help you focus today?</p>
                <div className="bg-gray-700 rounded-lg p-3 mb-3">
                  <p className="text-sm text-gray-300">Hey there! FocusBot here.</p>
                </div>
                <div className="bg-gray-700 rounded-lg p-3 mb-3">
                  <p className="text-sm text-gray-300">How can I help you with your project today?</p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <input 
                  type="text"
                  placeholder="Ask AI anything..."
                  className="flex-1 bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm text-white placeholder-gray-400"
                />
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  <MessageCircle className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>

          {/* Focus Tips */}
          <Card className="bg-gray-800 border-gray-700">
            <div className="p-4">
              <h4 className="font-medium mb-3 text-white">Focus Tips</h4>
              <ul className="text-sm space-y-2 text-gray-300">
                <li>• Break large tasks into smaller steps.</li>
                <li>• Use the timer for focused Pomodoro sessions.</li>
                <li>• Push code regularly to track progress.</li>
                <li>• Stay consistent — 1 hour daily matters.</li>
              </ul>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
