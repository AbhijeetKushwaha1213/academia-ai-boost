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
  CheckCircle
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

const AI_SUGGESTIONS = [
  "Summarize this topic",
  "Explain SN2 mechanism",
  "Give me MCQs for Organic Chemistry",
  "What's the difference between SN1 and SN2?",
  "Create practice problems for this topic"
];

export const StudySessionPage = ({ 
  subject = "Chemistry", 
  topic = "Organic Reactions",
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
    { id: '1', name: 'Organic Chemistry Notes.pdf', type: 'pdf', category: 'Notes', tags: ['chemistry', 'organic'], url: '#' },
    { id: '2', name: 'SN1 vs SN2 Mechanisms', type: 'video', category: 'Video', tags: ['mechanism', 'reactions'], url: '#' },
    { id: '3', name: 'Khan Academy - Organic Reactions', type: 'link', category: 'Web Link', tags: ['tutorial', 'online'], url: '#' },
    { id: '4', name: 'Practice Problems Set 3.pdf', type: 'pdf', category: 'Problem Set', tags: ['practice', 'problems'], url: '#' },
  ]);
  
  // Notes states
  const [notes, setNotes] = useState<SessionNote[]>([]);
  const [currentNote, setCurrentNote] = useState('');
  const [noteType, setNoteType] = useState<'understanding' | 'difficulty' | 'important'>('understanding');
  
  // Session metrics
  const [sessionStartTime] = useState(new Date());
  const [totalFocusTime, setTotalFocusTime] = useState(90); // minutes
  const [sessionsCompleted, setSessionsCompleted] = useState(2);
  const [resourcesOpened, setResourcesOpened] = useState(3);
  const [topicsCovered, setTopicsCovered] = useState(1);
  
  // Ambient sound
  const [ambientSound, setAmbientSound] = useState<'none' | 'rain' | 'lofi' | 'nature'>('none');
  const [soundEnabled, setSoundEnabled] = useState(false);
  
  // AI objectives
  const [sessionObjective] = useState(`Complete ${topic} study and solve practice problems`);
  const [showObjective, setShowObjective] = useState(true);

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
          description: "Time to get back to studying!",
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
    if (minutes === 0) return; // Custom option
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
      description: isBreak ? "Enjoy your break!" : "Focus time! You've got this!",
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
      case 'understanding': return 'bg-green-50 border-green-200';
      case 'difficulty': return 'bg-red-50 border-red-200';
      case 'important': return 'bg-yellow-50 border-yellow-200';
    }
  };

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
          <div className="flex items-center space-x-3">
            <Badge className={`${isBreak ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'} text-lg px-4 py-2`}>
              {isBreak ? 'Break Time' : 'Active Session'}
            </Badge>
            {soundEnabled && (
              <Button variant="outline" size="sm" onClick={() => setSoundEnabled(false)}>
                <Volume2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* AI Objective Banner */}
        {showObjective && (
          <Card className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Target className="w-5 h-5 text-blue-600" />
                <div>
                  <h3 className="font-semibold text-blue-900">Session Objective</h3>
                  <p className="text-blue-700">{sessionObjective}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setShowObjective(false)}>×</Button>
            </div>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Session Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Enhanced Timer */}
            <Card className="p-8 text-center">
              <div className="mb-6">
                <div className="flex justify-center items-center space-x-4 mb-4">
                  <Clock className={`w-16 h-16 ${isBreak ? 'text-orange-500' : 'text-indigo-600'}`} />
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowTimerSettings(!showTimerSettings)}
                  >
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className={`text-6xl font-bold mb-2 ${isBreak ? 'text-orange-600' : 'text-gray-900'}`}>
                  {formatTime(timeLeft)}
                </div>
                
                <Progress value={progress} className="h-3 mb-4" />
                
                <p className="text-gray-600 mb-4">
                  {isBreak 
                    ? 'Break time! Relax and recharge.' 
                    : isRunning 
                      ? 'Focus time! Stay concentrated.' 
                      : 'Ready to start your session?'
                  }
                </p>

                {/* Timer Settings */}
                {showTimerSettings && (
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Focus Time</label>
                        <Select onValueChange={(value) => handleTimerPreset(parseInt(value))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select focus time" />
                          </SelectTrigger>
                          <SelectContent>
                            {TIMER_PRESETS.map(preset => (
                              <SelectItem key={preset.value} value={preset.value.toString()}>
                                {preset.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {customTime && (
                          <div className="flex mt-2 space-x-2">
                            <Input
                              type="number"
                              value={customTime}
                              onChange={(e) => setCustomTime(parseInt(e.target.value) || 25)}
                              min="1"
                              max="180"
                              className="w-20"
                            />
                            <Button size="sm" onClick={handleCustomTime}>Set</Button>
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">Break Time</label>
                        <Select onValueChange={(value) => setBreakTime(parseInt(value))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select break time" />
                          </SelectTrigger>
                          <SelectContent>
                            {BREAK_PRESETS.map(preset => (
                              <SelectItem key={preset.value} value={preset.value.toString()}>
                                {preset.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={autoMode}
                          onChange={(e) => setAutoMode(e.target.checked)}
                          className="rounded"
                        />
                        <span className="text-sm">Auto Pomodoro Cycle</span>
                      </label>
                      
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">Ambient Sound:</span>
                        <Select value={ambientSound} onValueChange={(value: any) => setAmbientSound(value)}>
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            <SelectItem value="rain">Rain</SelectItem>
                            <SelectItem value="lofi">Lo-fi</SelectItem>
                            <SelectItem value="nature">Nature</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                )}
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
                
                <Button onClick={handleStop} variant="outline">
                  <Square className="w-4 h-4 mr-2" />
                  End Session
                </Button>
              </div>
            </Card>

            {/* Enhanced Resources */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Session Resources</h3>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={handleResourceUpload}>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Files
                  </Button>
                  <Button variant="outline" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Link
                  </Button>
                </div>
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.mp4,.avi,.mov"
              />
              
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="all">All ({resources.length})</TabsTrigger>
                  <TabsTrigger value="pdf">PDFs</TabsTrigger>
                  <TabsTrigger value="video">Videos</TabsTrigger>
                  <TabsTrigger value="notes">Notes</TabsTrigger>
                  <TabsTrigger value="links">Links</TabsTrigger>
                </TabsList>
                
                <TabsContent value="all">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {resources.map((resource) => {
                      const IconComponent = getResourceIcon(resource.type);
                      return (
                        <div 
                          key={resource.id}
                          className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer group"
                          onClick={() => handleResourceOpen(resource)}
                        >
                          <IconComponent className="w-5 h-5 mr-3 text-gray-600" />
                          <div className="flex-1">
                            <span className="text-sm font-medium">{resource.name}</span>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant="outline" className="text-xs">{resource.category}</Badge>
                              {resource.tags.slice(0, 2).map(tag => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  <Tag className="w-3 h-3 mr-1" />
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Download className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </TabsContent>
              </Tabs>
            </Card>

            {/* Quick Notes */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Session Notes</h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex space-x-2 mb-2">
                    <Select value={noteType} onValueChange={(value: any) => setNoteType(value)}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="understanding">💡 Understanding</SelectItem>
                        <SelectItem value="difficulty">❗ Difficulty</SelectItem>
                        <SelectItem value="important">⭐ Important</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Textarea
                      value={currentNote}
                      onChange={(e) => setCurrentNote(e.target.value)}
                      placeholder="What did you learn? What was difficult? Important points..."
                      className="flex-1"
                      rows={2}
                    />
                    <Button onClick={addNote} disabled={!currentNote.trim()}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                {notes.length > 0 && (
                  <ScrollArea className="h-32">
                    <div className="space-y-2">
                      {notes.map((note) => (
                        <div key={note.id} className={`p-3 rounded-lg border ${getNoteColor(note.type)}`}>
                          <div className="flex justify-between items-start">
                            <p className="text-sm flex-1">{note.content}</p>
                            <span className="text-xs text-gray-500 ml-2">
                              {note.timestamp.toLocaleTimeString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </div>
            </Card>
          </div>

          {/* Enhanced Side Panel */}
          <div className="space-y-6">
            {/* AI Assistant */}
            <Card className="p-4 h-96">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold flex items-center">
                  <Brain className="w-5 h-5 mr-2 text-blue-600" />
                  AI Study Assistant
                </h4>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowChat(!showChat)}
                >
                  {showChat ? 'Hide' : 'Show'}
                </Button>
              </div>
              
              {showChat ? (
                <div className="h-80">
                  <AIChat 
                    context={`study assistant for ${subject} - ${topic}`}
                    placeholder={`Ask about ${topic}...`}
                    className="h-full"
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 mb-3">Quick suggestions:</p>
                  {AI_SUGGESTIONS.map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="w-full text-left justify-start text-xs"
                      onClick={() => setShowChat(true)}
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              )}
            </Card>

            {/* Live Session Metrics */}
            <Card className="p-4">
              <h4 className="font-semibold mb-3 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                Live Metrics
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Sessions Today</span>
                  <span className="font-medium">{sessionsCompleted}/4</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Focus Time</span>
                  <span className="font-medium">{Math.floor(totalFocusTime / 60)}h {totalFocusTime % 60}m</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Resources Opened</span>
                  <span className="font-medium">{resourcesOpened}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Topics Covered</span>
                  <span className="font-medium">{topicsCovered}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Notes Taken</span>
                  <span className="font-medium">{notes.length}</span>
                </div>
              </div>
            </Card>

            {/* Session Progress */}
            <Card className="p-4">
              <h4 className="font-semibold mb-3 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-blue-600" />
                Today's Goals
              </h4>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Study Sessions</span>
                    <span>{sessionsCompleted}/4</span>
                  </div>
                  <Progress value={(sessionsCompleted / 4) * 100} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Focus Time</span>
                    <span>{Math.floor(totalFocusTime / 60)}/3h</span>
                  </div>
                  <Progress value={(totalFocusTime / 180) * 100} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Topics</span>
                    <span>{topicsCovered}/3</span>
                  </div>
                  <Progress value={(topicsCovered / 3) * 100} className="h-2" />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};