
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Play, Pause, RotateCcw, Code, ExternalLink, Github, Timer, Brain, Send } from "lucide-react";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AIChat } from "../chat/AIChat";

interface ProjectFocusViewProps {
  projectName?: string;
  projectType?: string;
  deadline?: string;
  onBack: () => void;
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export default function ProjectFocusView({ 
  projectName = "React Portfolio Website", 
  projectType = "Frontend Project", 
  deadline = "2 days",
  onBack 
}: ProjectFocusViewProps) {
  const [timer, setTimer] = useState(3600); // 1 hour default
  const [isRunning, setIsRunning] = useState(false);
  const [terminalOutput, setTerminalOutput] = useState([
    "$ npm start",
    "Launching dev server...",
    "✓ Project running at localhost:3000"
  ]);
  const [terminalInput, setTerminalInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hey there! FocusBot here.\n\nHow can I help you with your project today?',
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  // Timer functionality
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && timer > 0) {
      interval = setInterval(() => {
        setTimer(timer => timer - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, timer]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleStart = () => setIsRunning(true);
  const handlePause = () => setIsRunning(false);
  const handleReset = () => {
    setTimer(3600);
    setIsRunning(false);
  };

  const executeCommand = () => {
    if (terminalInput.trim()) {
      const newOutput = [...terminalOutput, `$ ${terminalInput}`];
      
      if (terminalInput.includes("npm install")) {
        newOutput.push("Installing dependencies...", "✔️ Installation complete");
      } else if (terminalInput.includes("git")) {
        newOutput.push("✔️ Git command executed");
      } else if (terminalInput.includes("npm run")) {
        newOutput.push("Running script...", "✔️ Script executed successfully");
      } else {
        newOutput.push("Command executed");
      }
      
      setTerminalOutput(newOutput);
      setTerminalInput("");
    }
  };

  const sendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "I understand you're working on a React Portfolio Website. Let me help you with that!",
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const openExternalLink = (url: string) => {
    window.open(url, "_blank");
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
              className="text-gray-300 hover:text-white hover:bg-gray-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <div className="text-xl font-semibold text-white">DevFocus Dashboard</div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Project Header */}
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h1 className="text-2xl font-bold text-white mb-2">{projectName}</h1>
                    <p className="text-gray-400">{projectType} · Due in {deadline}</p>
                  </div>
                  
                  {/* External Platform Links */}
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => openExternalLink("https://code.visualstudio.com")}
                      className="border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      <Code className="w-4 h-4 mr-2" />
                      VS Code
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => openExternalLink("https://github.com")}
                      className="border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      <Github className="w-4 h-4 mr-2" />
                      GitHub
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => openExternalLink("https://leetcode.com")}
                      className="border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      LeetCode
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => openExternalLink("https://hackerrank.com")}
                      className="border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      HackerRank
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => openExternalLink("https://linkedin.com")}
                      className="border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      LinkedIn
                    </Button>
                  </div>
                </div>

                {/* Timer Section */}
                <div className="flex items-center justify-between bg-gray-900 rounded-lg p-4">
                  <div className="flex items-center gap-4">
                    <Timer className="w-8 h-8 text-purple-400" />
                    <div className="text-3xl font-mono font-bold text-white">
                      {formatTime(timer)}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      onClick={handleStart} 
                      disabled={isRunning}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Start
                    </Button>
                    <Button 
                      onClick={handlePause} 
                      disabled={!isRunning}
                      variant="outline"
                      className="border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      <Pause className="w-4 h-4 mr-2" />
                      Pause
                    </Button>
                    <Button 
                      onClick={handleReset}
                      variant="outline"
                      className="border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Reset
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabs Section */}
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <Tabs defaultValue="terminal" className="w-full">
                  <TabsList className="bg-gray-900 border-gray-700">
                    <TabsTrigger value="terminal" className="data-[state=active]:bg-gray-700">Terminal</TabsTrigger>
                    <TabsTrigger value="resources" className="data-[state=active]:bg-gray-700">Resources</TabsTrigger>
                    <TabsTrigger value="editor" className="data-[state=active]:bg-gray-700">Code Editor</TabsTrigger>
                    <TabsTrigger value="practice" className="data-[state=active]:bg-gray-700">Practice</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="terminal" className="mt-4">
                    <div className="bg-black text-green-400 font-mono p-4 rounded h-96 overflow-y-auto">
                      {terminalOutput.map((line, index) => (
                        <div key={index} className="mb-1">{line}</div>
                      ))}
                      <div className="flex items-center mt-4">
                        <span className="mr-2">$</span>
                        <Input 
                          value={terminalInput}
                          onChange={(e) => setTerminalInput(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && executeCommand()}
                          className="bg-transparent border-none text-green-400 font-mono focus:ring-0"
                          placeholder="Enter command..."
                        />
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="resources" className="mt-4">
                    <div className="text-gray-300 p-4">
                      <p>Resources content goes here...</p>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="editor" className="mt-4">
                    <div className="bg-gray-900 p-4 rounded h-96">
                      <p className="text-gray-400 mb-4">Write or paste your code here...</p>
                      <Button 
                        variant="outline" 
                        className="border-gray-600 text-gray-300 hover:bg-gray-700"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Open in VS Code
                      </Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="practice" className="mt-4">
                    <div className="text-gray-300 p-4">
                      <p>Practice problems and exercises...</p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <h3 className="font-medium text-white mb-3">Quick Actions</h3>
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
              </CardContent>
            </Card>

            {/* AI Assistant */}
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Brain className="w-5 h-5 text-purple-400" />
                  <h3 className="font-medium text-white">AI Assistant</h3>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm text-gray-400 mb-2">How can I help you focus today?</p>
                </div>

                <ScrollArea className="h-48 mb-4">
                  <div className="space-y-3">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`p-2 rounded text-sm ${
                          message.sender === 'user'
                            ? 'bg-blue-600 text-white ml-8'
                            : 'bg-gray-700 text-gray-300 mr-8'
                        }`}
                      >
                        {message.text}
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                <div className="flex gap-2">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Ask AI anything..."
                    className="bg-gray-900 border-gray-600 text-white placeholder-gray-400"
                  />
                  <Button 
                    onClick={sendMessage}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Focus Tips */}
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <h3 className="font-medium text-white mb-3">Focus Tips</h3>
                <ul className="text-sm text-gray-400 space-y-2">
                  <li>• Break large tasks into smaller steps.</li>
                  <li>• Use the timer for focused Pomodoro sessions.</li>
                  <li>• Push code regularly to track progress.</li>
                  <li>• Stay consistent — 1 hour daily matters.</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
