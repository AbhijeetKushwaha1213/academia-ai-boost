import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Play, Pause, RotateCcw, Code, ExternalLink, Github, Timer, Brain, Send, Plus, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";

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

interface Resource {
  id: number;
  title: string;
  url: string;
  type: 'documentation' | 'tutorial' | 'article' | 'video';
}

interface LeetCodeProblem {
  id: number;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tags: string[];
  url: string;
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
  const [codeContent, setCodeContent] = useState("Write or paste your code here... This is a local scratchpad and does not save.");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hey there! FocusBot here.\n\nHow can I help you with your project today?',
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [resources, setResources] = useState<Resource[]>([
    { id: 1, title: "React Docs", url: "https://reactjs.org/docs", type: "documentation" },
    { id: 2, title: "Tailwind CSS Guide", url: "https://tailwindcss.com/docs", type: "documentation" }
  ]);
  const [newResource, setNewResource] = useState({ title: "", url: "", type: "documentation" as Resource['type'] });

  const leetcodeProblems: LeetCodeProblem[] = [
    {
      id: 1,
      title: "Two Sum",
      difficulty: "Easy",
      tags: ["Array", "Hash Table"],
      url: "https://leetcode.com/problems/two-sum/"
    },
    {
      id: 20,
      title: "Valid Parentheses",
      difficulty: "Easy", 
      tags: ["Stack", "String"],
      url: "https://leetcode.com/problems/valid-parentheses/"
    }
  ];

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
      } else if (terminalInput.includes("npm start")) {
        newOutput.push("Launching dev server...", "✔️ Project running at localhost:3000");
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
        text: "I understand you're working on a React Portfolio Website. Let me help you with that! Feel free to ask about React concepts, debugging, or best practices.",
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const addResource = () => {
    if (newResource.title && newResource.url) {
      setResources(prev => [...prev, { ...newResource, id: Date.now() }]);
      setNewResource({ title: "", url: "", type: "documentation" });
    }
  };

  const removeResource = (id: number) => {
    setResources(prev => prev.filter(resource => resource.id !== id));
  };

  const openLeetCodeProblem = (problem: LeetCodeProblem) => {
    window.open(problem.url, "_blank");
  };

  const openExternalLink = (url: string) => {
    window.open(url, "_blank");
  };

  const openInVSCode = () => {
    // This opens VS Code with a file protocol - may require VS Code to be installed
    window.open("vscode://file/your-project-path", "_blank");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4 sticky top-0 z-40">
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
                  <div className="flex gap-2 flex-wrap">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={openInVSCode}
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
                          className="bg-transparent border-none text-green-400 font-mono focus:ring-0 focus-visible:ring-0"
                          placeholder="Enter command..."
                        />
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="resources" className="mt-4">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-white">Project Resources</h3>
                      
                      {/* Add Resource Form */}
                      <div className="flex gap-2">
                        <Input 
                          placeholder="Add resource URL or document name" 
                          value={newResource.title}
                          onChange={(e) => setNewResource({...newResource, title: e.target.value})}
                          className="bg-gray-900 border-gray-600 text-white placeholder-gray-400"
                        />
                        <Button onClick={addResource} className="bg-blue-600 hover:bg-blue-700">
                          Add
                        </Button>
                      </div>
                      
                      {/* Resources List */}
                      <div className="space-y-2">
                        {resources.map(resource => (
                          <div key={resource.id} className="flex items-center justify-between p-3 bg-gray-900 rounded border border-gray-700">
                            <div className="flex items-center gap-3">
                              <div className="px-2 py-1 bg-blue-600 text-white text-xs rounded">
                                {resource.type}
                              </div>
                              <a 
                                href={resource.url} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-white hover:text-blue-400 flex items-center gap-1"
                              >
                                {resource.title}
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                            <Button 
                              onClick={() => removeResource(resource.id)} 
                              variant="ghost" 
                              size="sm"
                              className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="editor" className="mt-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium text-white">Code Scratchpad</h3>
                        <Button 
                          onClick={openInVSCode}
                          variant="outline" 
                          className="border-gray-600 text-gray-300 hover:bg-gray-700"
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Open in VS Code
                        </Button>
                      </div>
                      <Textarea 
                        value={codeContent}
                        onChange={(e) => setCodeContent(e.target.value)}
                        placeholder="Write or paste your code here... This is a local scratchpad and does not save."
                        className="bg-gray-900 border-gray-600 text-white placeholder-gray-400 font-mono h-96 resize-none"
                      />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="practice" className="mt-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium text-white">Practice Problems</h3>
                        <Button 
                          onClick={() => openExternalLink("https://leetcode.com")}
                          variant="outline" 
                          className="border-gray-600 text-gray-300 hover:bg-gray-700"
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Open LeetCode
                        </Button>
                      </div>
                      
                      <div className="space-y-3">
                        {leetcodeProblems.map(problem => (
                          <div 
                            key={problem.id} 
                            className="p-4 bg-gray-900 rounded border border-gray-700 cursor-pointer hover:bg-gray-800 transition-colors"
                            onClick={() => openLeetCodeProblem(problem)}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium text-white mb-1">{problem.title}</h4>
                                <p className="text-sm text-gray-400">
                                  {problem.tags.join(", ")} - {problem.difficulty}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openLeetCodeProblem(problem);
                                  }}
                                  size="sm"
                                  className="bg-orange-600 hover:bg-orange-700"
                                >
                                  Practice Now
                                </Button>
                                <div className="w-6 h-6 bg-orange-500 rounded text-white text-xs flex items-center justify-center font-bold">
                                  LC
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar - Sticky */}
          <div className="space-y-6 lg:sticky lg:top-24 lg:h-fit">
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

            {/* AI Assistant - Sticky */}
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Brain className="w-5 h-5 text-purple-400" />
                  <h3 className="font-medium text-white">AI Assistant</h3>
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
                        <div className="whitespace-pre-wrap">{message.text}</div>
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
